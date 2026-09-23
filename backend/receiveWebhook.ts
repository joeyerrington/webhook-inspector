import type { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { randomUUID } from "node:crypto"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const dynamodb = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const webhookId = event.pathParameters?.webhookId

    if (!webhookId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: "webhookId is required",
        }),
      }
    }

    const receivedAt = new Date().toISOString()
    const eventId = `${receivedAt}#${randomUUID()}`
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24

    const item = {
      webhookId,
      eventId,
      receivedAt,
      expiresAt,

      method: event.requestContext.http.method,
      path: event.rawPath,

      headers: event.headers ?? {},
      queryParameters: event.queryStringParameters ?? {},

      body: event.body ?? null,
      isBase64Encoded: event.isBase64Encoded ?? false,
    }

    await dynamodb.send(
      new PutCommand({
        TableName: "WebhookEvents",
        Item: item,
      })
    )

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        webhookId,
        eventId,
      }),
    }
  } catch (error) {
    console.error("Error storing webhook:", error)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Failed to store webhook",
      }),
    }
  }
}
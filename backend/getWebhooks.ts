import type { APIGatewayProxyHandlerV2 } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const dynamodb = DynamoDBDocumentClient.from(client)

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    // Check that the request contains the correct internal API secret.
    const providedSecret =
      event.headers["x-inspector-secret"]

    const expectedSecret =
      process.env.INSPECTOR_API_SECRET

    if (
      !expectedSecret ||
      providedSecret !== expectedSecret
    ) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
      }
    }

    const webhookId = event.pathParameters?.webhookId

    if (!webhookId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: "webhookId is required",
        }),
      }
    }

    const result = await dynamodb.send(
      new QueryCommand({
        TableName: "WebhookEvents",
        KeyConditionExpression: "webhookId = :webhookId",
        ExpressionAttributeValues: {
          ":webhookId": webhookId,
        },
        ScanIndexForward: false,
        Limit: 50,
      })
    )

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhookId,
        events: result.Items ?? [],
      }),
    }
  } catch (error) {
    console.error("Error retrieving webhooks:", error)

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Failed to retrieve webhooks",
      }),
    }
  }
}
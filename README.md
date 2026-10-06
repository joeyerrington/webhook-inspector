Lightweight webhook inspector built with Next.js and AWS. It creates temporary webhook endpoints, captures incoming HTTP requests, and provides a UI for inspecting them.

This repository is intended as a reference for deploying your own instance.

## Architecture

```text
Next.js / Amplify
        |
        | GET events
        v
    API Gateway
        |
        v
   getWebhooks
        |
        v
     DynamoDB
        ^
        |
  receiveWebhook
        ^
        |
    API Gateway
        ^
        |
External webhook sender
```

AWS services:

- Amplify for the Next.js frontend
- API Gateway HTTP API
- Two Lambda functions
- DynamoDB for temporary event storage
- Route 53 and ACM for custom domains and TLS

## AWS setup

### DynamoDB

Create a table named:

```text
WebhookEvents
```

Keys:

```text
Partition key: webhookId (String)
Sort key:      eventId (String)
```

Use on-demand capacity.

Enable DynamoDB TTL using:

```text
expiresAt
```

Events currently set `expiresAt` to 24 hours after receipt.

DynamoDB TTL deletion is asynchronous, so records are not guaranteed to disappear exactly at the expiry time.

### Lambda

Deploy the two handlers in `/backend` as separate Lambda functions.

The receive function requires:

```text
dynamodb:PutItem
```

The read function requires:

```text
dynamodb:Query
```

Restrict both IAM policies to the `WebhookEvents` table.

The functions can be bundled with esbuild and deployed as ZIP packages. Infrastructure as code is recommended if maintaining your own instance longer term.

### API Gateway

Create an HTTP API with:

```text
POST /webhooks/{webhookId}
GET  /webhooks/{webhookId}
```

Map each route to its respective Lambda.

The POST endpoint must be publicly accessible so third-party systems can send webhooks.

The GET endpoint is protected by the `x-inspector-secret` header.

### Read API security

Configure the read Lambda with:

```text
INSPECTOR_API_SECRET=<random-secret>
```

The frontend's server-side request sends:

```text
x-inspector-secret: <random-secret>
```

The Lambda rejects requests where this value does not match `INSPECTOR_API_SECRET`.

Do not expose this value through a `NEXT_PUBLIC_*` environment

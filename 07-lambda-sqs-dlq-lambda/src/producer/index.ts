import { SendMessageCommand, SendMessageCommandInput, SQSClient } from '@aws-sdk/client-sqs';
import { APIGatewayProxyEvent } from 'aws-lambda';

const client = new SQSClient()


export const handler = async (event: APIGatewayProxyEvent) => {
    const body = JSON.parse(event.body || '{}');

    const input: SendMessageCommandInput = {
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify(body),
    }

    const command = new SendMessageCommand(input)
    await client.send(command)

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Message sent to SQS successfully',
            input,
        }),
    };
}
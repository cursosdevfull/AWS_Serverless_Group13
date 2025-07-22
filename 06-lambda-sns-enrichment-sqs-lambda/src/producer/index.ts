import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns"

const client = new SNSClient();

import { APIGatewayProxyEvent } from 'aws-lambda';
export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const topicArn = process.env.TOPIC_ARN;
        console.log("TOPIC_ARN:", topicArn);
        if (!topicArn) {
            throw new Error('TOPIC_ARN environment variable is not set');
        }

        const input: PublishCommandInput = {
            TopicArn: topicArn,
            Message: event.body as string
        }

        console.log("Input for PublishCommand:", input);

        const command = new PublishCommand(input)
        await client.send(command);
        console.log("Message sent to SNS successfully");

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Message sent to SNS successfully" })
        };

    } catch (error) {
        console.error("Error sending message to SNS:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }


}
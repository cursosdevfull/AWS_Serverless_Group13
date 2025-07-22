import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns"
import { SQSEvent } from "aws-lambda";

const client = new SNSClient();

export const handler = async (event: SQSEvent) => {
    console.log("Enrichment SQS event:", JSON.stringify(event, null, 2));

    const records = event.Records

    //records.forEach(async record => {
    for (const record of records) {
        const body = JSON.parse(record.body);
        console.log("Processing record:", body);

        // Simulate enrichment logic
        body.enrichedData = `Enriched data for ${body}`;
        console.log("Enriched record:", body);

        try {
            const topicArn = process.env.TOPIC_ARN;
            console.log("TOPIC_ARN:", topicArn);
            if (!topicArn) {
                throw new Error('TOPIC_ARN environment variable is not set');
            }

            const input: PublishCommandInput = {
                TopicArn: topicArn,
                Message: JSON.stringify(body)
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
    //})


    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Enrichment Lambda processed the SQS event successfully" })
    }
}
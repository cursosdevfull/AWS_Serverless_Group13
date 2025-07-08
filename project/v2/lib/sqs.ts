import { SendMessageCommand, SendMessageCommandInput, SQSClient } from "@aws-sdk/client-sqs"

export class SQSService {
    private readonly client: SQSClient

    constructor() {
        this.client = new SQSClient()
    }

    async send(queueUrl: string, payload: Record<string, any>) {
        const input: SendMessageCommandInput = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(payload),
        }

        console.log("Sending message to SQS:", JSON.stringify(input, null, 2));

        const command = new SendMessageCommand(input)

        try {
            await this.client.send(command);
            return { message: 'Message sent to SQS successfully', input };

        } catch (error) {
            console.error("Error parsing response payload:", error)
            throw new Error("Failed to parse response payload")
        }
    }
}
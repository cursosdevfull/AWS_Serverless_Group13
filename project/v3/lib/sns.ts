import { PublishCommand, PublishCommandInput, SNSClient } from "@aws-sdk/client-sns"

export class SNSService {
    private readonly client: SNSClient

    constructor() {
        this.client = new SNSClient()
    }

    async send(topicArn: string, payload: Record<string, any>) {
        const input: PublishCommandInput = {
            TopicArn: topicArn,
            Message: JSON.stringify(payload),
        }

        console.log("Sending message to SNS:", JSON.stringify(input, null, 2));

        const command = new PublishCommand(input)

        try {
            await this.client.send(command);
            return { message: 'Message sent to SNS successfully', input };

        } catch (error) {
            console.error("Error parsing response payload:", error)
            throw new Error("Failed to parse response payload")
        }
    }
}
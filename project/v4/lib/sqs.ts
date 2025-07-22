import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";

export class SQS {
    private client: SQSClient;
    private static instance: SQS;

    private constructor() {
        this.client = new SQSClient({});
    }

    public static getInstance(): SQS {
        if (!SQS.instance) {
            SQS.instance = new SQS();
        }
        return SQS.instance;
    }

    public async sendMessage(queueUrl: string, messageBody: string): Promise<void> {
        const params: SendMessageCommandInput = {
            QueueUrl: queueUrl,
            MessageBody: messageBody,
        };

        const command = new SendMessageCommand(params);
        await this.client.send(command);
    }

}
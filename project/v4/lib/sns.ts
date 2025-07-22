import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';

export class Sns {
    private client: SNSClient;
    private static instance: Sns;

    private constructor() {
        this.client = new SNSClient();
    }

    static getInstance(): Sns {
        if (!Sns.instance) {
            Sns.instance = new Sns();
        }
        return Sns.instance;
    }

    public async publishMessage(topicArn: string, message: string): Promise<void> {
        const params: PublishCommandInput = {
            Message: message,
            TopicArn: topicArn,
        };

        const command = new PublishCommand(params);
        await this.client.send(command);
    }
}
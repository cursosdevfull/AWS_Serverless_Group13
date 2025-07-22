import { InvocationType, InvokeCommand, InvokeCommandInput, LambdaClient } from "@aws-sdk/client-lambda"

export class LambdaService {
    private readonly client: LambdaClient

    constructor() {
        this.client = new LambdaClient()
    }

    async invoke(functionName: string, invocationType: InvocationType, payload: Record<string, any>) {
        const input: InvokeCommandInput = {
            InvocationType: invocationType,
            FunctionName: functionName,
            Payload: JSON.stringify(payload),
        }

        const command = new InvokeCommand(input)

        try {
            if (invocationType === InvocationType.RequestResponse) {
                const response = await this.client.send(command)
                const payload = response.Payload as Uint8Array;
                const responseString = Buffer.from(payload).toString('utf-8');
                return JSON.parse(responseString);
            } else {
                await this.client.send(command);
                return { message: "Invocation successful" };
            }

        } catch (error) {
            console.error("Error parsing response payload:", error)
            throw new Error("Failed to parse response payload")
        }
    }
}
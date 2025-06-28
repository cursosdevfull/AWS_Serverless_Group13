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

        const response = await this.client.send(command)

        try {
            return JSON.parse(String.fromCharCode.apply(null, response.Payload as Uint8Array))
        } catch (error) {
            console.error("Error parsing response payload:", error)
            throw new Error("Failed to parse response payload")
        }
    }
}
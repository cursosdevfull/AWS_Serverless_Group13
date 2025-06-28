import { TMessage } from "./types/message.type";
import { LambdaService } from "../lib";
import { InvocationType } from "@aws-sdk/client-lambda";
import { env } from "../env"

export const handler = async (event: any, context: any) => {

    console.log("Event received:", JSON.stringify(event, null, 2));
    console.log("Context received:", JSON.stringify(context, null, 2));

    const parameters = JSON.parse(event.body)

    const lambdaService = new LambdaService()

    const payload: TMessage = {
        sender: "sender@email.com",
        recipient: parameters.email,
        subject: "Hello from Lambda with TypeScript!",
        body: "This is a test email sent from a Lambda function using TypeScript.",
        timestamp: new Date().toISOString(), // Optional field to store the time when the message was created
    }

    // Invoke another Lambda function
    const functionName = env.FUNCTION_NAME_INVOKE
    const response = await lambdaService.invoke(functionName, InvocationType.RequestResponse, payload)
    const body = response.body ? JSON.parse(response.body) : {};

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Lambda invoked successfully!",
            response: body
        }),
    }
}
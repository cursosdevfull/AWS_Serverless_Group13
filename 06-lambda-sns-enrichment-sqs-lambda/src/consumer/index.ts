import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
    console.log("Consumer SQS event:", JSON.stringify(event, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Consumer Lambda processed the SQS event successfully" })
    }

}
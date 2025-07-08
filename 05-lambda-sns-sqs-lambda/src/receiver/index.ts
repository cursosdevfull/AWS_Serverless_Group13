import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
    console.log("Received SQS event:", JSON.stringify(event, null, 2));


}
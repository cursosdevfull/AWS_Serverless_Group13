import { S3Event } from "aws-lambda";

export const handler = async (event: S3Event) => {
    console.log("Event received:", JSON.stringify(event, null, 2));
};
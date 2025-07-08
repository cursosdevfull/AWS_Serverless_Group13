import { parseEnv, z } from "znv";
import { env } from "./env";
import { APIGatewayProxyEvent } from "aws-lambda";
import { SQSService } from "../../lib/sqs";

const SQS_QUEUE_URL = {
    SQS_PE: env.SQS_PE_URL,
    SQS_MX: env.SQS_MX_URL,
    SQS_CO: env.SQS_CO_URL,
}

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        if (!event.body) throw new Error("Event body is required");

        const body = JSON.parse(event.body) as Record<string, any>;

        console.log("Event received:", JSON.stringify(event, null, 2));

        const data = parseEnv(body, {
            patientId: z.coerce.number().min(1, "Patient ID must be a positive number"),
            scheduleId: z.coerce.number().min(1, "Schedule ID must be a positive number"),
            countryISO: z.enum(["PE", "CO", "MX"])
        })

        const sqsService = new SQSService();

        console.log("Parsed data:", JSON.stringify(data, null, 2));
        console.log("SQS Queue URL:", SQS_QUEUE_URL);
        console.log(`SQS_${data.countryISO}`)

        const queueUrl = SQS_QUEUE_URL[`SQS_${data.countryISO}`];

        console.log("Queue URL:", queueUrl);
        if (!queueUrl) {
            throw new Error(`No queue configured for country ISO: ${data.countryISO}`);
        }

        const response = await sqsService.send(queueUrl, body);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: response })
        }
    } catch (error) {
        throw new Error(`Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
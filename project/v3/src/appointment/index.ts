import { parseEnv, z } from "znv";
import { env } from "./env";
import { APIGatewayProxyEvent } from "aws-lambda";
import { SQSService } from "../../lib/sqs";
import { SNSService } from "../../lib";

const TOPIC_ARN = env.TOPIC_ARN;

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

        const snsService = new SNSService();

        console.log("Parsed data:", JSON.stringify(data, null, 2));
        console.log("SNS Topic Arn:", TOPIC_ARN);
        console.log(`SNS_${data.countryISO}`)

        const topicArn = TOPIC_ARN;

        console.log("TopicArn:", topicArn);
        if (!topicArn) {
            throw new Error(`No topic configured for country ISO: ${data.countryISO}`);
        }

        const response = await snsService.send(topicArn, body);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: response })
        }
    } catch (error) {
        throw new Error(`Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "../../lib/dynamodb";
import { z } from 'zod';
import { Status } from "../../shared/enums/status";

export const handler = async (event: SQSEvent) => {
    console.log("event", event)

    const dynamo = DynamoDB.getInstance();

    const schemaEnv = z.object({
        TABLE_NAME: z.string(),
    });

    const envResult = schemaEnv.safeParse(process.env);

    if (!envResult.success) {
        throw new Error(`Invalid environment variables: ${envResult.error}`);
    }

    for (const record of event.Records) {
        const body = JSON.parse(record.body);

        const schema = z.object({
            scheduleId: z.uuid(),
            patientId: z.uuid(),
            countryISO: z.string(),
            id: z.string(),
        })

        const result = schema.safeParse(body);

        if (!result.success) {
            throw new Error(`Invalid request: ${result.error}`);
        }

        await dynamo.putItem(envResult.data.TABLE_NAME, { ...body, status: Status.REJECTED });
    }
}
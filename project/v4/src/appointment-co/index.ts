import { SQSEvent } from "aws-lambda";
import { DynamoDB } from "../../lib/dynamodb";
import { z } from 'zod';
import { Status } from "../../shared/enums/status";
import { SQS } from "../../lib/sqs";

export const handler = async (event: SQSEvent) => {
    throw new Error("This handler is not implemented yet. Please check the latest version of the code.");



    const dynamo = DynamoDB.getInstance();
    const sqs = SQS.getInstance();

    const schemaEnv = z.object({
        TABLE_NAME: z.string(),
        QUEUE_URL: z.string(),
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
            countryISO: z.enum(["CO"]),
            id: z.string(),
        })

        const result = schema.safeParse(body);

        if (!result.success) {
            throw new Error(`Invalid request: ${result.error}`);
        }

        //await dynamo.putItem(envResult.data.TABLE_NAME, { ...body, status: Status.COMPLETED });
        //await sqs.sendMessage(envResult.data.QUEUE_URL, JSON.stringify({ id: body.id, status: Status.COMPLETED }));
    }
}
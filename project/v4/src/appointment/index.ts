import { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { z } from 'zod';
import { Sns } from '../../lib/sns';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDB } from '../../lib/dynamodb';
import { Status } from '../../shared/enums/status';
import { create } from 'domain';

export const handler = async (event: APIGatewayProxyEvent | SQSEvent): Promise<APIGatewayProxyResult | void> => {
    const sns = Sns.getInstance();
    const dynamo = DynamoDB.getInstance();

    const schemaEnv = z.object({
        TOPIC_ARN: z.string(),
        TABLE_NAME: z.string(),
    });

    const envResult = schemaEnv.safeParse(process.env);

    if (!envResult.success) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Invalid environment variables',
                errors: envResult.error,
            }),
        };
    }

    const schema = z.object({
        scheduleId: z.uuid(),
        patientId: z.uuid(),
        countryISO: z.enum(["PE", "MX", "CO"]),
    })

    if (typeof event === 'object' && 'Records' in event) {
        const record = event.Records[0];
        const body = record.body ? JSON.parse(record.body) : {};

        const schemaSQS = z.object({
            id: z.string(),
            status: z.enum([Status.COMPLETED, Status.ERROR]),
        })

        const result = schemaSQS.safeParse(body);

        if (!result.success) {
            throw new Error(`Invalid SQS message format ${result.error}`);
        }

        const { id, status } = result.data;

        await dynamo.updateItem(envResult.data.TABLE_NAME, { id }, 'SET #status = :status, #updatedAt = :updatedAt', { '#status': 'status', '#updatedAt': 'updatedAt' }, {
            ':status': status,
            ':updatedAt': new Date().toISOString()
        });

    } else if (typeof event === 'object' && 'body' in event) {
        const params = event.body ? JSON.parse(event.body) : {};

        const result = schema.safeParse(params);

        if (!result.success) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Invalid request',
                    errors: result.error,
                }),
            };
        }

        const { scheduleId, patientId, countryISO } = result.data;
        const id = uuidv4();
        const status = Status.QUEUED;

        await sns.publishMessage(envResult.data.TOPIC_ARN, JSON.stringify({
            scheduleId,
            patientId,
            countryISO,
            id,
        }));

        await dynamo.putItem(envResult.data.TABLE_NAME, {
            scheduleId,
            patientId,
            countryISO,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            status
        });

        return {
            statusCode: 200,
            body: event.body ? event.body : JSON.stringify({
                message: 'Hello from the appointment service!',
            }),
        };
    }



}
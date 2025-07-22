import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import crypto from 'crypto';
import { z } from 'zod';

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
    const body = JSON.parse(event.body || '{}');

    const schema = z.object({
        name: z.string().min(1, 'Name is required'),
        age: z.coerce.number().int().positive('Age must be a positive integer'),
        email: z.email('Invalid email format')
    });

    let parsedBody;

    try {
        parsedBody = schema.parse(body);
    } catch (error: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Validation error',
                error: error.errors
            })
        }
    }

    const { name, age, email } = parsedBody;

    const input: PutItemCommandInput = {
        TableName: process.env.TABLE_NAME || '',
        Item: {
            id: { S: crypto.randomUUID() },
            name: { S: name },
            age: { N: age.toString() },
            email: { S: email }
        }
    }

    const command = new PutItemCommand(input)

    try {
        const response = await client.send(command)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Item created successfully',
                data: response
            })
        }
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error creating item',
                error: error.message
            })
        }
    }


}
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand, PutItemCommandInput, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import crypto from 'crypto';
import { z } from 'zod';

const client = new DynamoDBClient();

export const handler = async (event: APIGatewayProxyEvent) => {
    //const queryStringParameters = event.queryStringParameters || {};
    const params = event.pathParameters || {};

    const schema = z.object({
        id: z.string().min(1, 'Id is required')
    });

    let parsedBody;

    try {
        //parsedBody = schema.parse(queryStringParameters);
        parsedBody = schema.parse(params);
    } catch (error: any) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Validation error',
                error: error.errors
            })
        }
    }

    const { id } = parsedBody;

    const input: ScanCommandInput = {
        TableName: process.env.TABLE_NAME || '',
        ExpressionAttributeNames: {
            "#IDENTITY": "id",
            "#CORREO": "email"
        },
        ExpressionAttributeValues: {
            ":identity": {
                S: id
            }
        },
        FilterExpression: "#IDENTITY = :identity",
        ProjectionExpression: "#IDENTITY, #CORREO"
    }

    const command = new ScanCommand(input)

    try {
        const response = await client.send(command)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Listed successfully',
                data: response
            })
        }
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error listing items',
                error: error.message
            })
        }
    }


}
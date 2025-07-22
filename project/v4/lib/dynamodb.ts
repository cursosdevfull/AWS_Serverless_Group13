import { AttributeValue, DynamoDBClient, PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

export class DynamoDB {
    private client: DynamoDBClient;
    private static instance: DynamoDB;

    private constructor() {
        this.client = new DynamoDBClient({});
    }

    static getInstance(): DynamoDB {
        if (!DynamoDB.instance) {
            DynamoDB.instance = new DynamoDB();
        }
        return DynamoDB.instance;
    }

    async putItem(tableName: string, item: Record<string, any>): Promise<void> {
        const params: PutItemCommandInput = {
            TableName: tableName,
            Item: marshall(item),
        };

        console.log(`Putting item into table ${tableName}:`, params.Item);

        const command = new PutItemCommand(params);
        await this.client.send(command);
    }

    async updateItem(tableName: string, key: Record<string, any>, updateExpression?: string, expressionAttributeNames?: Record<string, string>, expressionAttributeValues?: Record<string, any>): Promise<void> {
        const params: UpdateItemCommandInput = {
            TableName: tableName,
            Key: marshall(key),
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues ? marshall(expressionAttributeValues) : undefined,
        };

        console.log(`Updating item in table ${tableName}:`, params);

        const command = new UpdateItemCommand(params);
        await this.client.send(command);
    }

}
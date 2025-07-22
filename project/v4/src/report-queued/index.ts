import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});

export const handler = async (): Promise<void> => {
    console.log("Handler invoked", new Date().toISOString());

    try {
        // Calcular la fecha de hace 1 minuto
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        const oneMinuteAgoISO = oneMinuteAgo.toISOString();

        console.log(`Searching for records with createdAt < ${oneMinuteAgoISO} and status = QUEUED`);

        const params = {
            TableName: process.env.TABLE_NAME!,
            IndexName: "StatusCreatedAtIndex",
            KeyConditionExpression: "#status = :status AND #createdAt < :createdAt",
            ExpressionAttributeNames: {
                "#status": "status",
                "#createdAt": "createdAt"
            },
            ExpressionAttributeValues: {
                ":status": { S: "QUEUED" },
                ":createdAt": { S: oneMinuteAgoISO }
            }
        };

        const result = await client.send(new QueryCommand(params));

        console.log(`Found ${result.Items?.length || 0} queued records older than 1 minute`);

        if (result.Items && result.Items.length > 0) {
            // Convertir los items de DynamoDB format a JavaScript objects
            const items = result.Items.map(item => unmarshall(item));
            console.log("Queued records:", JSON.stringify(items, null, 2));

            // Aquí puedes agregar la lógica adicional que necesites para procesar estos registros
            // Por ejemplo: enviar notificaciones, mover a otra cola, etc.
        } else {
            console.log("No queued records found older than 1 minute");
        }

    } catch (error) {
        console.error("Error querying DynamoDB:", error);
        throw error;
    }
}
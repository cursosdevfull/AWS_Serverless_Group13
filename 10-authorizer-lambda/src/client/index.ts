import { APIGatewayProxyEvent } from 'aws-lambda';
import { DatabaseService } from '../../lib/database.service';

export const handler = async (event: APIGatewayProxyEvent) => {
    const instance = await DatabaseService.getInstance();

    const connection = instance.connection;

    if (!connection) {
        console.error("Database connection is not initialized");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Database connection error" })
        };
    } else {
        console.log("Database connection is initialized");
    }

    try {
        const results = await connection.prepare("SELECT * FROM product limit 10");
        const rows = await results.execute([]);
        console.log("Rows found:", rows);
        if (rows.length > 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ data: rows[0] })
            };
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }

}
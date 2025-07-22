import { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { DatabaseService } from '../../lib/database.service';

export const handler = async (event: APIGatewayProxyEvent) => {
    const instance = await DatabaseService.getInstance();
    const { email, password, name } = JSON.parse(event.body || '{}');

    const schema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.email(),
        password: z.string().min(6, "Password must be at least 6 characters long")
    })

    try {
        schema.parse({ name, email, password });
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Invalid input" })
        };
    }

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

        // Check if the user already exists
        const existingUser = await connection.prepare("SELECT * FROM user WHERE email = ?");
        const rows = await existingUser.execute([email]);
        if (rows.length > 0) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: "User already exists" })
            };
        }

        const preparedStatement = await connection.prepare("INSERT INTO user (name, email, password) VALUES (?, ?, ?)");
        await preparedStatement.execute([name, email, password]);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User registered successfully" })
        }

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" })
        };
    }

}
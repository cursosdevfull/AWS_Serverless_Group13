import { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';
import { DatabaseService } from '../../lib/database.service';
import { Token } from '../../lib/token';

export const handler = async (event: APIGatewayProxyEvent) => {
    const instance = await DatabaseService.getInstance();
    const { email, password } = JSON.parse(event.body || '{}');

    const schema = z.object({
        email: z.email(),
        password: z.string().min(6, "Password must be at least 6 characters long")
    })

    try {
        schema.parse({ email, password });
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
        const existingUser = await connection.prepare("SELECT * FROM user WHERE email = ?");
        const rows: any = await existingUser.execute([email]);
        console.log("Rows found:", rows);
        if (rows.length > 0) {
            const token = Token.generateToken({ name: rows[0][0].name }, "UGKO6Q79cUut9HXuf34dEOX", '1h');

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "User valid", token })
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
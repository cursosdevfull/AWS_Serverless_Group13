import mysql from 'mysql2/promise';
import { SecretManager } from "./secret-manager";
import { SystemManager } from "./system-manager";

export class DatabaseService {
    private static instance: DatabaseService;
    public connection!: mysql.Connection;
    private connectionPromise: Promise<void>;

    private constructor() {
        this.connectionPromise = this.connectToDatabase();
    }

    async connectToDatabase() {
        let response;
        let user: string
        let password: string;
        let host: string;

        try {
            response = await SecretManager.getSecretValue("rds!db-870cdd33-8111-4ba7-a6a8-e0ddcacbe72d");
            user = response.username;
            password = response.password;
        } catch (error) {
            throw error;
        }

        try {
            host = await SystemManager.getParameterValue("/database/cursos-dev");
        } catch (error) {
            throw error;
        }

        console.log("Connection parameters:", {
            host,
            user,
            password,
            database: 'db'
        })

        this.connection = await mysql.createConnection({
            host,
            user,
            password,
            database: 'db'
        });

        console.log("Database connection established successfully.");
    }

    public static async getInstance(): Promise<DatabaseService> {
        if (!this.instance) {
            this.instance = new DatabaseService();
        }
        await this.instance.connectionPromise;
        return this.instance;
    }

    public async ensureConnection(): Promise<void> {
        await this.connectionPromise;
    }
}
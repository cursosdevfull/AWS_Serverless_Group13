import {
    SecretsManagerClient,
    GetSecretValueCommand,
    GetSecretValueCommandInput,
} from "@aws-sdk/client-secrets-manager";

export class SecretManager {
    static getSecretValue(secretName: string) {
        const client = new SecretsManagerClient();

        const params: GetSecretValueCommandInput = {
            SecretId: secretName,
            VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
        };

        return client.send(new GetSecretValueCommand(params))
            .then(response => {
                console.log("Secret retrieved successfully:", response);
                console.log("Secret", response.SecretString);
                console.log("JSON.parse", JSON.parse(response.SecretString!));
                if (response.SecretString) {
                    return JSON.parse(response.SecretString);
                } else {
                    throw new Error("Secret string is empty or undefined");
                }
            })
            .catch(error => {
                console.error("Error retrieving secret:", error);
                throw error;
            });
    }
}
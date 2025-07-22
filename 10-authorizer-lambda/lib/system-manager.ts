import {
    SSMClient,
    GetParameterCommand,
    GetParameterCommandInput,
} from "@aws-sdk/client-ssm";

export class SystemManager {
    static getParameterValue(parameterName: string) {
        const client = new SSMClient();

        const params: GetParameterCommandInput = {
            Name: parameterName,
            WithDecryption: true,
        };

        return client.send(new GetParameterCommand(params))
            .then(response => {
                if (response.Parameter?.Value) {
                    return response.Parameter.Value;
                } else {
                    throw new Error("Parameter value is empty or undefined");
                }
            })
            .catch(error => {
                console.error("Error retrieving parameter:", error);
                throw error;
            });
    }
}
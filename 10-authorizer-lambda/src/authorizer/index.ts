import { SecretManager } from "../../lib/secret-manager";
import { Token } from "../../lib/token";

interface AuthorizerEvent {
    type: string;
    methodArn: string;
    authorizationToken: string;
}

export const handler = async (event: AuthorizerEvent) => {
    let response
    let key

    const secretName = process.env.SECRET_KEY_TOKEN

    try {
        console.log("secretName", secretName);
        response = await SecretManager.getSecretValue(secretName!);
        console.log("response", response);
        key = response.key
    } catch (error) {
        throw error;
    }

    const payload = Token.verifyToken(event.authorizationToken, key);

    if (payload) {
        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: event.methodArn
                    }
                ]
            }
        }
    } else {
        return {
            principalId: "user",
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Deny",
                        Resource: event.methodArn
                    }
                ]
            }
        }
    }




};
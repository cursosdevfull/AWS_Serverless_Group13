import { TMessage } from "../types/message.type";

export const handler = async (event: TMessage) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Simulate some processing
    const result = {
        message: "Hola from Lambda!",
        input: {
            sender: event.sender,
            recipient: event.recipient,
            subject: event.subject,
            body: event.body,
            timestamp: event.timestamp
        },
    };

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}
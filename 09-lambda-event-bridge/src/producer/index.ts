import { APIGatewayProxyEvent } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-eventbridge';

const client = new EventBridgeClient()

export const handler = async (event: APIGatewayProxyEvent) => {
    const body = JSON.parse(event.body || '{}');

    const { name, email, scheduleId, patientId } = body;

    const input: PutEventsCommandInput = {
        Entries: [
            {
                Source: 'desktop-app',
                DetailType: 'appointment-create',
                Detail: JSON.stringify({
                    name,
                    email,
                    scheduleId,
                    patientId
                }),
                EventBusName: process.env.EVENT_BUS_NAME || ''
            }
        ]
    }

    const command = new PutEventsCommand(input);

    try {
        const response = await client.send(command);
        console.log('Event sent to EventBridge:', response);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event sent successfully',
                response: response
            })
        }
    } catch (error: any) {
        console.error('Error sending event to EventBridge:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error sending event',
                error: error.message
            })
        }
    }
}
import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        console.log('Processing record:', JSON.stringify(record, null, 2));

        // Simulate processing logic
        try {
            // Here you would typically process the message
            console.log(`Processing message: ${record.body}`);

            // Simulate a successful processing
            // If an error occurs, throw an error to trigger DLQ
        } catch (error) {
            console.error('Error processing record:', error);
            throw error; // This will send the message to the DLQ
        }
    }

    return {
        statusCode: 200,
        body: 'Processed successfully',
    };
}
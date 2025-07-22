import { SQSEvent } from 'aws-lambda';

type IResponse = {
    batchItemFailures: Array<{ itemIdentifier: string }>;
}

export const handler = async (event: SQSEvent) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const response: IResponse = {
        batchItemFailures: []
    }

    for (const record of event.Records) {
        console.log('Processing record:', JSON.stringify(record, null, 2));

        // Simulate processing logic
        console.log(`Processing message: ${record.body}`);

        const data = JSON.parse(record.body);

        if (data.message === "error") {
            console.error(`Simulated error for message: ${record.body}`);
            response.batchItemFailures.push({ itemIdentifier: record.messageId });
        }

        //throw new Error("Simulated processing error"); // Simulate an error for demonstration
    }

    return response;

    /*     return {
            statusCode: 200,
            body: 'Processed successfully',
        }; */
}
import { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent) => {
    console.log('Received SQS event:', JSON.stringify(event, null, 2));

    await new Promise(resolve => {
        setTimeout(() => {
            resolve("done")
        }, 20000);
    })

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Messages processed successfully',
        }),
    };

}
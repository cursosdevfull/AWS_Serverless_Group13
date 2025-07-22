
export const handler = async (event: any) => {
    console.log('Event received:', JSON.stringify(event, null, 2));

    return {
        status: 200,
        body: JSON.stringify({
            message: 'Event processed successfully',
            event: event
        })
    }
}
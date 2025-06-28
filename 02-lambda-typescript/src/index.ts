export const handler = async (event: any) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Simulate some processing
    const result = {
        message: "Hello from Lambda!",
        input: event,
    };

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
}
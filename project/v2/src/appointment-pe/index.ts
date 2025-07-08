export const handler = async (event: any) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    return {
        statusCode: 200,
        body: "Hello from Appointment PE",
    }
}
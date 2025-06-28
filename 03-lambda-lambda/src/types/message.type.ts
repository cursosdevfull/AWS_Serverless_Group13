export type TMessage = {
    sender: string;
    recipient: string;
    subject: string;
    body: string;
    timestamp?: string; // Optional field to store the time when the message was created
}
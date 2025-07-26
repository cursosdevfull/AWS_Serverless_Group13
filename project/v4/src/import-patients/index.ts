import { S3Client, GetObjectCommand, GetObjectCommandInput } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";

const s3Client = new S3Client();

const streamToString = (stream: Readable): Promise<string> => {
    return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        stream.on("data", (chunk: Uint8Array) => {
            chunks.push(chunk);
        })
            .on("error", reject)
            .on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    })
}

const getContent = async (bucketName: string, objectKey: string): Promise<string> => {
    const input: GetObjectCommandInput = {
        Bucket: bucketName,
        Key: objectKey
    };

    const command = new GetObjectCommand(input);
    const response = await s3Client.send(command);

    if (!response.Body) {
        throw new Error(`No content found for object ${objectKey} in bucket ${bucketName}`);
    }

    return await streamToString(response.Body as Readable);

}


export const handler = async (event: S3Event) => {
    console.log("Event received:", JSON.stringify(event, null, 2));

    if (event.Records && event.Records.length > 0) {
        for (const record of event.Records) {
            console.log("Processing record:", JSON.stringify(record, null, 2));

            // Here you can add your logic to process the S3 event
            // For example, you might want to read the file from S3 and import patients
            const bucketName = record.s3.bucket.name;
            const objectKey = record.s3.object.key;

            const content = await getContent(bucketName, objectKey);

            console.log(`Content of ${objectKey} in bucket ${bucketName}:`, content);

        }
    }
};
import { parseEnv, z } from "znv";
import { env } from "./env";
import { APIGatewayProxyEvent } from "aws-lambda";
import { LambdaService } from "../../lib";
import { InvocationType } from "@aws-sdk/client-lambda";

const functionNames = {
    appointmentPE: env.APPOINTMENT_PE,
    appointmentCO: env.APPOINTMENT_CO,
    appointmentMX: env.APPOINTMENT_MX
}

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        if (!event.body) throw new Error("Event body is required");

        const body = JSON.parse(event.body);

        const data = parseEnv(body, {
            patientId: z.coerce.number().min(1, "Patient ID must be a positive number"),
            scheduleId: z.coerce.number().min(1, "Schedule ID must be a positive number"),
            countryISO: z.enum(["PE", "CO", "MX"])
        })

        const lambdaService = new LambdaService()

        const functionName = functionNames[`appointment${data.countryISO}`];
        if (!functionName) {
            throw new Error(`No function configured for country ISO: ${data.countryISO}`);
        }

        await lambdaService.invoke(functionName, InvocationType.Event, {
            patientId: data.patientId,
            scheduleId: data.scheduleId,
            countryISO: data.countryISO
        });


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Hello from Appointment Service",
                env: {
                    appointmentPe: env.APPOINTMENT_PE,
                    appointmentCo: env.APPOINTMENT_CO,
                    appointmentMx: env.APPOINTMENT_MX
                },
                body: {
                    patientId: data.patientId,
                    scheduleId: data.scheduleId,
                    countryISO: data.countryISO
                }
            })
        }
    } catch (error) {
        throw new Error(`Error processing request: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
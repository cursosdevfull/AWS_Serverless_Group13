import { parseEnv, z } from "znv";

export const env = parseEnv(process.env, {
    APPOINTMENT_PE: z.string().min(5),
    APPOINTMENT_CO: z.string().min(5),
    APPOINTMENT_MX: z.string().min(5)
})
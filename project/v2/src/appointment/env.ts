import { parseEnv, z } from "znv";

export const env = parseEnv(process.env, {
    SQS_PE_URL: z.string().url().min(5),
    SQS_CO_URL: z.string().url().min(5),
    SQS_MX_URL: z.string().url().min(5)
})
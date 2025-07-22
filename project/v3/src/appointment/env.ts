import { parseEnv, z } from "znv";

export const env = parseEnv(process.env, {
    TOPIC_ARN: z.string().min(5)
})
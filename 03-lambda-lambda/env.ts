import { parseEnv, z } from "znv";

export const env = parseEnv(process.env, {
    FUNCTION_NAME_INVOKE: z.string().min(1),
});

export type Env = typeof env

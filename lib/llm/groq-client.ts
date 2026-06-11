import OpenAI from "openai";
import { LLMServiceError } from "./error";
const getClient = (() => {
    let client: OpenAI | null = null;

    return (): OpenAI => {
        if (!client) {
            const apiKey = process.env.GROQ_API_KEY;
            if (!apiKey) {
                throw new LLMServiceError("GROQ_API_KEY belum dipasang di file .env");
            }
            client = new OpenAI({
                apiKey,
                baseURL: "https://api.groq.com/openai/v1",
            });
        }
        return client;
    };
})();

export async function callGroqAPI(prompt: string): Promise<string> {
    const client = getClient();

    let result;
    try {
        result = await client.chat.completions.create({
            model: "qwen/qwen3-32b",
            messages: [
                {
                    role: "system",
                    content:
                        "Anda adalah sistem analitik yang HANYA mengeluarkan output berupa JSON valid sesuai skema yang diminta. Dilarang keras memberikan teks pengantar atau penutup.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: { type: "json_object" },
        });
    } catch (apiError: unknown) {
        throw new LLMServiceError(
            `Groq API Request failed: ${apiError instanceof Error ? apiError.message : String(apiError)}`,
            apiError
        );
    }

    const rawResponse = result.choices[0]?.message?.content;
    if (!rawResponse) {
        throw new LLMServiceError("Groq AI tidak memberikan respons teks.");
    }

    return rawResponse;
}
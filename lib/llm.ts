import OpenAI from "openai";
import { MinimalBusinessInput } from "@/types/business";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    throw new Error("GROQ_API_KEY belum dipasang di file .env");
}

const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

interface AnalyzeParams {
    business: MinimalBusinessInput;
    solutionFocus: string;
}

export async function analyzeLeadWithLLM({ business, solutionFocus }: AnalyzeParams) {
    const prompt = `
Anda adalah Sales Intelligence Agent untuk analisis B2B lead.

DATA BISNIS (Ramping):
- Nama Usaha: ${business.nama || "Tidak diketahui"}
- Kategori/Tipe: ${business.kategori || "Tidak diketahui"}
- Rating Google: ${business.rating ?? "Tidak ada"}
- Total Ulasan: ${business.total_review ?? 0}
- Sudah Punya Website: ${business.has_website ? "Ya" : "Tidak"}
- Memiliki Nomor HP/Kontak: ${business.has_phone_number ? "Ya" : "Tidak"}

SOLUSI YANG DITAWARKAN:
"${solutionFocus}"

ATURAN PENILAIAN:
1. Score "High" jika bisnis sangat relevan dengan solusi dan punya kelemahan digital, seperti belum punya website, kontak kurang jelas, atau butuh sistem operasional.
2. Score "Medium" jika bisnis relevan, tetapi sudah punya fondasi digital dasar.
3. Score "Low" jika bisnis tidak relevan dengan solusi.

ATURAN OUTPUT:
- Jawab hanya JSON murni.
- Jangan pakai markdown (JANGAN gunakan bungkus \`\`\`json ... \`\`\`).
- Jangan beri penjelasan di luar JSON.
- Reason maksimal 2 sampai 3 kalimat dalam Bahasa Indonesia.
- Whatsapp harus format 628xxx jika nomor tersedia. Jika tidak ada nomor, isi null.

Format JSON wajib:
{
  "score": "High",
  "reason": "Alasan singkat dalam Bahasa Indonesia.",
  "whatsapp": "628xxx atau null"
}
`.trim();

    try {
        const result = await client.chat.completions.create({
            model: "qwen/qwen3-32b",
            messages: [
                {
                    role: 'system',
                    content: "Anda adalah sistem analitik yang HANYA mengeluarkan output berupa JSON valid. Dilarang keras memberikan teks pengantar atau penutup.",
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawResponse = result.choices[0].message.content;

        if (!rawResponse) {
            throw new Error("Groq AI tidak memberikan respons teks.");
        }

        return JSON.parse(rawResponse);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ Groq AI SDK Analysis Error:", errorMessage);
        return {
            score: "Low",
            reason: `Gagal dianalisis karena kendala API Groq: ${errorMessage}`,
            whatsapp: null,
        };
    }
}
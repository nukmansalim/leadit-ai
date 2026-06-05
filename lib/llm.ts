import OpenAI from "openai";
import { MinimalBusinessInput } from "@/types/business";
import { retryWithBackoff } from "./utils/resilience";

export class LLMServiceError extends Error {
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = "LLMServiceError";
  }
}

interface AnalyzeParams {
  business: MinimalBusinessInput;
  solutionFocus: string;
}

export interface LeadAnalysisResult {
  score: "High" | "Medium" | "Low";
  reason: string;
  whatsapp: string | null;
}

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new LLMServiceError("GROQ_API_KEY belum dipasang di file .env");
  }
  return key;
}

export async function analyzeLeadWithLLM({ business, solutionFocus }: AnalyzeParams): Promise<LeadAnalysisResult> {
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
    return await retryWithBackoff(async () => {
      const apiKey = getApiKey();
      
      const client = new OpenAI({
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });

      let result;
      try {
        result = await client.chat.completions.create({
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

      try {
        const parsed = JSON.parse(rawResponse);
        if (!parsed.score || !parsed.reason) {
          throw new Error("Missing required fields in LLM response");
        }
        return parsed as LeadAnalysisResult;
      } catch (parseError: unknown) {
        throw new LLMServiceError(
          `Failed to parse LLM JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw response: ${rawResponse}`,
          parseError
        );
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorDetails = error instanceof LLMServiceError ? error.details : "";
    
    console.error("❌ Groq AI SDK Analysis Error:", errorMessage, errorDetails || "");
    
    // Return a user-friendly generic reason instead of raw stack/API details
    return {
      score: "Low",
      reason: "Gagal menganalisis profil bisnis saat menghubungi layanan AI. Silakan coba beberapa saat lagi.",
      whatsapp: null,
    };
  }
}

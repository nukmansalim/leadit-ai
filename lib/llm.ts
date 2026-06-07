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
  no_instagram: boolean;
  no_pos: boolean;
}

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new LLMServiceError("GROQ_API_KEY belum dipasang di file .env");
  }
  return key;
}

export async function analyzeLeadWithLLM({ business, solutionFocus }: AnalyzeParams): Promise<LeadAnalysisResult> {
  let mappedSolution = solutionFocus;
  const lowerFocus = solutionFocus.toLowerCase();
  if (lowerFocus === "cafe") {
    mappedSolution = "Pembuatan website UMKM, menu QR digital, dan sistem online ordering untuk meningkatkan kunjungan cafe.";
  } else if (lowerFocus === "rumah makan") {
    mappedSolution = "Pembuatan website sederhana, digitalisasi menu, dan optimasi Google Maps/profil bisnis untuk rumah makan.";
  } else if (lowerFocus === "restaurant" || lowerFocus === "restoran") {
    mappedSolution = "Pembuatan website profesional, sistem reservasi meja online, dan integrasi digital menu untuk restoran.";
  } else if (lowerFocus === "bakery") {
    mappedSolution = "Pembuatan website katalog roti, sistem pre-order online/delivery, dan optimasi Google Maps.";
  } else if (lowerFocus === "catering") {
    mappedSolution = "Pembuatan website profil usaha catering, sistem paket menu, form pemesanan online, dan review pelanggan.";
  } else {
    mappedSolution = `Pembuatan website, digital menu QR, dan sistem reservasi/pemesanan online untuk meningkatkan kehadiran digital bisnis ${solutionFocus}.`;
  }

  const reviewsContext = business.reviews && business.reviews.length > 0 
    ? `\nULASAN PELANGGAN (Top 5):\n${business.reviews.map((r, i) => `${i+1}. "${r}"`).join("\n")}`
    : "\nULASAN PELANGGAN: Tidak ada ulasan.";

  const prompt = `
Anda adalah Sales Intelligence Agent untuk analisis B2B lead.

DATA BISNIS (Ramping):
- Nama Usaha: ${business.nama || "Tidak diketahui"}
- Kategori/Tipe: ${business.kategori || "Tidak diketahui"}
- Rating Google: ${business.rating ?? "Tidak ada"}
- Total Ulasan: ${business.total_review ?? 0}
- Sudah Punya Website Custom (Bukan Instagram): ${business.has_website ? "Ya" : "Tidak"}
- Website URL di Profil: ${business.website_url || "Tidak ada"}
- Memiliki Nomor HP/Kontak: ${business.has_phone_number ? "Ya" : "Tidak"}
${reviewsContext}

SOLUSI YANG DITAWARKAN:
"${mappedSolution}"

ATURAN PENILAIAN:
1. Score "High" jika bisnis sangat relevan dengan solusi dan punya kelemahan digital, seperti belum punya website, kontak kurang jelas, atau butuh sistem operasional/POS.
2. Score "Medium" jika bisnis relevan, tetapi sudah punya fondasi digital dasar.
3. Score "Low" jika bisnis tidak relevan dengan solusi.

ATURAN ANALISIS DIGITAL:
- Tentukan apakah bisnis ini TIDAK memiliki Instagram yang ditautkan di profil (jika website URL bukan instagram.com, dan tidak ada ulasan/indikasi instagram, set no_instagram = true).
- Tentukan apakah bisnis ini TIDAK menerapkan sistem POS/Kasir digital / Cash-only (set no_pos = true jika ulasan pelanggan mengeluhkan 'hanya menerima tunai', 'tidak bisa QRIS/debit', atau jika bisnis ini adalah warung/kaki lima kecil yang biasanya cash-only).

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
  "whatsapp": "628xxx atau null",
  "no_instagram": true/false,
  "no_pos": true/false
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
        if (parsed.score === undefined || parsed.reason === undefined) {
          throw new Error("Missing required fields in LLM response");
        }
        return {
          score: parsed.score,
          reason: parsed.reason,
          whatsapp: parsed.whatsapp,
          no_instagram: !!parsed.no_instagram,
          no_pos: !!parsed.no_pos,
        } as LeadAnalysisResult;
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
    throw error;
  }
}

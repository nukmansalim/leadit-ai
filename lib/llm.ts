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
  confidence?: number;
  no_instagram?: boolean;
  no_pos?: boolean;
  complaint_category: string | null;
  bad_review_summary: string | null;
  recommended_solution: string | null;
}

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new LLMServiceError("GROQ_API_KEY belum dipasang di file .env");
  }
  return key;
}

export let mockAnalyzeLeadWithLLM: typeof analyzeLeadWithLLM | null = null;
export function setMockAnalyzeLeadWithLLM(mock: typeof analyzeLeadWithLLM | null) {
  mockAnalyzeLeadWithLLM = mock;
}

export async function analyzeLeadWithLLM({ business, solutionFocus }: AnalyzeParams): Promise<LeadAnalysisResult> {
  if (mockAnalyzeLeadWithLLM) {
    return mockAnalyzeLeadWithLLM({ business, solutionFocus });
  }

  const reviewsContext = business.reviews && business.reviews.length > 0 
    ? `\nULASAN PELANGGAN:\n${business.reviews.map((r, i) => `${i+1}. ${r}`).join("\n")}`
    : "\nULASAN PELANGGAN: Tidak ada ulasan.";

  const prompt = `
Anda adalah Sales Intelligence Agent untuk analisis B2B lead di bidang F&B (Food & Beverage).
Tugas Anda adalah menilai kelayakan prospek bisnis berdasarkan keluhan pelanggan yang ada pada ulasan Google.

DATA BISNIS:
- Nama Usaha: ${business.nama || "Tidak diketahui"}
- Kategori/Tipe: ${business.kategori || "Tidak diketahui"}
- Rating Google: ${business.rating ?? "Tidak ada"}
- Total Ulasan: ${business.total_review ?? 0}
- Sudah Punya Website Custom (Bukan Instagram): ${business.has_website ? "Ya" : "Tidak"}
- Website URL di Profil: ${business.website_url || "Tidak ada"}
- Memiliki Nomor HP/Kontak: ${business.has_phone_number ? "Ya" : "Tidak"}
${reviewsContext}

SOLUSI JASA/PRODUK YANG DITAWARKAN (Solution Focus):
"${solutionFocus}"

ATURAN SCORING (Lead Scoring berdasarkan Bukti Ulasan):
1. Score "High": Jika ulasan pelanggan menunjukkan bukti keluhan yang JELAS, ACTIONABLE, BERULANG, atau SEVERE (parah) terkait operasional yang relevan dengan solusi yang ditawarkan.
2. Score "Medium": Jika ulasan pelanggan menunjukkan keluhan yang relevan namun kurang parah atau kurang berulang.
3. Score "Low": Jika ulasan pelanggan menunjukkan keluhan yang tidak relevan, tidak jelas (vague), tidak mencukupi, atau tidak actionable.

ATURAN KLASIFIKASI KATEGORI KELUHAN (complaint_category):
Pilih salah satu kategori keluhan berikut yang paling dominan dalam ulasan buruk:
- "slow_service": Keluhan tentang pelayanan lambat, antrean lama, makanan keluar lama.
- "long_queues": Keluhan tentang antrean yang terlalu panjang, pengaturan tempat duduk bermasalah.
- "payment_issues": Keluhan tentang pembayaran bermasalah, tidak menerima QRIS/debit, hanya tunai (cash-only), kasir lambat.
- "food_consistency": Keluhan tentang rasa makanan tidak konsisten, makanan dingin, tidak matang, basi, kotoran dalam makanan.
- "cleanliness": Keluhan tentang kebersihan tempat, bau kotor, lalat, serangga, toilet kotor.
- "other": Keluhan operasional lainnya yang tidak masuk kategori di atas.
Jika tidak ada keluhan yang jelas, isi null atau "other".

ATURAN ANALISIS DIGITAL:
- set no_instagram = true jika website URL bukan instagram.com dan tidak ada tanda-tanda Instagram di profil.
- set no_pos = true jika ulasan pelanggan mengeluhkan 'hanya menerima tunai', 'tidak bisa QRIS/debit', atau jika bisnis ini adalah warung/kaki lima kecil yang biasanya cash-only.

ATURAN OUTPUT:
- Jawab HANYA JSON murni.
- Jangan gunakan markdown format (JANGAN bungkus dengan \`\`\`json ... \`\`\`).
- Jangan beri penjelasan apa pun di luar JSON.
- Reason harus ditulis dalam Bahasa Indonesia (maksimal 2-3 kalimat) menjelaskan mengapa lead ini mendapat skor tersebut berdasarkan bukti keluhan pelanggan.
- WhatsApp diisi dengan format nomor HP internasional (misal 628xxx) jika nomor telepon bisnis tersedia di data atau ulasan, jika tidak ada set null.
- Confidence diisi dengan angka keyakinan Anda (0-100) mengenai tingkat kecocokan solusi dengan keluhan yang dianalisis.

Format JSON wajib:
{
  "score": "High" | "Medium" | "Low",
  "reason": "Penjelasan singkat dalam Bahasa Indonesia.",
  "complaint_category": "slow_service" | "long_queues" | "payment_issues" | "food_consistency" | "cleanliness" | "other" | null,
  "bad_review_summary": "Ringkasan ulasan buruk pelanggan mengenai keluhan utama mereka.",
  "recommended_solution": "Pernyataan spesifik mengenai rekomendasi solusi/pitch penjualan berdasarkan keluhan tersebut.",
  "whatsapp": "628xxx atau null",
  "confidence": 85,
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
              content: "Anda adalah sistem analitik yang HANYA mengeluarkan output berupa JSON valid sesuai skema yang diminta. Dilarang keras memberikan teks pengantar atau penutup.",
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
          whatsapp: parsed.whatsapp || null,
          confidence: typeof parsed.confidence === "number" ? parsed.confidence : undefined,
          no_instagram: parsed.no_instagram !== undefined ? !!parsed.no_instagram : undefined,
          no_pos: parsed.no_pos !== undefined ? !!parsed.no_pos : undefined,
          complaint_category: parsed.complaint_category || null,
          bad_review_summary: parsed.bad_review_summary || null,
          recommended_solution: parsed.recommended_solution || null,
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

import openAI from "openai";
const apiKey = process.env.HELYX_API_KEY;


if (!apiKey) {
    throw new Error("HELYX_API_KEY belum dipasang di file .env");
}

const client = new openAI({
    apiKey,
    baseURL: "https://helyxai.space/api/v1",
});


interface AnalyzeParams {
    business: any;
    solutionFocus: string;
}

export async function analyzeLeadWithLLM({ business, solutionFocus }: AnalyzeParams) {
    const reviewsText = business.reviews
        ? business.reviews.map((r: any) => `"${r.text?.text || r.text || ""}"`).join(" | ")
        : "Tidak ada ulasan.";

    const prompt = `
Anda adalah Sales Intelligence Agent untuk analisis B2B lead.

DATA BISNIS:
- Nama Usaha: ${business.displayName?.text || business.nama || "Tidak diketahui"}
- Kategori/Tipe: ${business.kategori || business.primaryType || "Tidak diketahui"}
- Alamat: ${business.formattedAddress || "Tidak diketahui"}
- Rating Google: ${business.rating || "Tidak ada"}
- Total Ulasan: ${business.userRatingCount || business.total_review || 0}
- Website: ${business.websiteUri || "Tidak ada"}
- Kontak: ${business.nationalPhoneNumber || "Tidak ada"}
- Ulasan Pelanggan Terakhir: ${reviewsText}

SOLUSI YANG DITAWARKAN:
"${solutionFocus}"

ATURAN PENILAIAN:
1. Score "High" jika bisnis sangat relevan dengan solusi dan punya kelemahan digital, seperti belum punya website, kontak kurang jelas, atau butuh sistem operasional.
2. Score "Medium" jika bisnis relevan, tetapi sudah punya fondasi digital dasar.
3. Score "Low" jika bisnis tidak relevan dengan solusi.

ATURAN OUTPUT:
- Jawab hanya JSON murni.
- Jangan pakai markdown.
- Jangan beri penjelasan di luar JSON.
- Reason maksimal 2 sampai 3 kalimat.
- Whatsapp harus format 628xxx jika nomor tersedia.
- Jika tidak ada nomor, isi null.

Format JSON wajib:
{
  "score": "High",
  "reason": "Alasan singkat dalam Bahasa Indonesia.",
  "whatsapp": "628xxx atau null"
}
`.trim();


    try {

        const result = await client.chat.completions.create({
            model: "helix_3_5",
            messages: [
                {
                    role: 'system',
                    content: "Anda hanya menghasilkan JSON valid sesuai format yang diminta.",
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });

        const rawResponse = result.choices[0].message.content;

        if (!rawResponse) {
            throw new Error("AI tidak memberikan respons teks.");
        }
        return JSON.parse(rawResponse);

    } catch (error) {
        console.error("AI SDK Analysis Error:", error);
        return {
            score: "Low",
            reason: "Gagal dianalisis oleh AI karena gangguan API atau kesalahan pemrosesan teks.",
            whatsapp: null,
        };
    }
}
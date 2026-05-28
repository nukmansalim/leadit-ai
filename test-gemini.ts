import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY tidak ditemukan di .env!");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    console.log("--- 1. Mengecek Daftar Model ---");
    try {
        // Kita gunakan fetch manual karena SDK kadang menyembunyikan list model
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        const data = await response.json();

        if (data.models) {
            console.log("✅ API Key Valid. Model yang tersedia:");
            data.models.forEach((m: any) => {
                if (m.name.includes("flash") || m.name.includes("pro")) {
                    console.log(`   - ${m.name} (Support: ${m.supportedGenerationMethods})`);
                }
            });
        } else {
            console.log("⚠️ Tidak ada model yang ditemukan atau API Key bermasalah.");
            console.log("Response:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("❌ Gagal mengambil daftar model:", e);
    }

    console.log("\n--- 2. Test Prompt ke gemini-1.5-flash ---");
    try {
        // Kita coba panggil model yang kamu mau
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Halo, apakah kamu aktif? Jawab singkat saja.");
        const response = await result.response;
        console.log("✅ Respon Gemini:", response.text());
    } catch (e: any) {
        console.error("❌ Gagal panggil gemini-1.5-flash:");
        console.error("   Pesan Error:", e.message);
    }
}

testGemini();
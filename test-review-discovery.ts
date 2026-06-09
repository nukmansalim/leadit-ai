import { prisma } from "./lib/prisma";
import { googlePlacesService } from "./lib/google-places";
import { setMockAnalyzeLeadWithLLM } from "./lib/llm";
import { runLeadSearch } from "./lib/services/lead-search.service";
import assert from "assert";
import "dotenv/config";

// Setup mock details
const originalSearchText = googlePlacesService.searchText;
const originalGetPlaceDetails = googlePlacesService.getPlaceDetails;

async function runTests() {
  console.log("🚀 Starting Lead Review-Driven Discovery Test Suite...");

  // 1. Setup Test User and Job
  const testUser = await prisma.user.upsert({
    where: { email: "test-editor@leadit.ai" },
    update: {},
    create: {
      email: "test-editor@leadit.ai",
      name: "Test Editor",
    },
  });

  const createJob = async (category: string) => {
    return await prisma.searchJob.create({
      data: {
        userId: testUser.id,
        query_params: {
          location: "Test City",
          businessCategory: category,
          solutionFocus: "QR Ordering & POS System",
        },
        status: "pending",
      },
    });
  };

  // Clean up existing test leads for testUser
  await prisma.lead.deleteMany({
    where: { userId: testUser.id },
  });

  try {
    // TEST Case 1: Qualified lead with negative review evidence (Indonesian terms)
    console.log("\n--- TEST 1: Qualified lead with negative review evidence (Indonesian terms) ---");
    const job1 = await createJob("cafe");

    // Mock search text
    googlePlacesService.searchText = async () => {
      return [{ place_id: "place-qualified-1" }];
    };

    // Mock place details with negative reviews (lambat, kotor)
    googlePlacesService.getPlaceDetails = async (placeId: string) => {
      assert.strictEqual(placeId, "place-qualified-1");
      return {
        id: "place-qualified-1",
        displayName: { text: "Kafe Lambat Sekali" },
        formattedAddress: "Jl. Lambat No. 1",
        rating: 3.1,
        userRatingCount: 20,
        websiteUri: "https://lambatcafe.com",
        nationalPhoneNumber: "08123456789",
        reviews: [
          { rating: 2, text: { text: "Pelayanan di kafe ini sangat lambat dan lama sekali antrean kasirnya." } },
          { rating: 5, text: { text: "Rasa kopi enak." } }
        ]
      };
    };

    // Mock LLM response
    setMockAnalyzeLeadWithLLM(async () => {
      return {
        score: "High",
        reason: "Kafe ini memiliki keluhan berulang mengenai pelayanan lambat dan kasir yang membuat antrean panjang.",
        whatsapp: "628123456789",
        confidence: 90,
        no_instagram: true,
        no_pos: true,
        complaint_category: "slow_service",
        bad_review_summary: "Pelayanan sangat lambat dan antrean kasir lama.",
        recommended_solution: "Implementasi menu QR digital mandiri untuk memangkas antrean di kasir.",
      };
    });

    const result1 = await runLeadSearch({
      jobId: job1.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "cafe",
      solutionFocus: "QR Ordering & POS System",
    });

    assert.strictEqual(result1.success, true);
    assert.strictEqual(result1.totalLeads, 1);

    const savedLead1 = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-qualified-1",
        }
      }
    });

    assert.ok(savedLead1);
    assert.strictEqual(savedLead1.business_name, "Kafe Lambat Sekali");
    assert.strictEqual(savedLead1.ai_lead_score, "High");
    assert.strictEqual(savedLead1.complaint_category, "slow_service");
    assert.strictEqual(savedLead1.bad_review_summary, "Pelayanan sangat lambat dan antrean kasir lama.");
    assert.strictEqual(savedLead1.recommended_solution, "Implementasi menu QR digital mandiri untuk memangkas antrean di kasir.");
    assert.strictEqual(savedLead1.confidence, 90);
    console.log("✅ TEST 1 PASSED: Qualified lead saved successfully with review analysis fields.");

    // TEST Case 2: Business with no reviews (should be skipped)
    console.log("\n--- TEST 2: Business with no reviews (should be skipped) ---");
    const job2 = await createJob("bakery");

    googlePlacesService.searchText = async () => {
      return [{ place_id: "place-no-reviews" }];
    };

    googlePlacesService.getPlaceDetails = async () => {
      return {
        id: "place-no-reviews",
        displayName: { text: "Bakery Sunyi" },
        rating: 0,
        userRatingCount: 0,
        reviews: []
      };
    };

    const result2 = await runLeadSearch({
      jobId: job2.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "bakery",
      solutionFocus: "QR Ordering & POS System",
    });

    assert.strictEqual(result2.success, true);
    assert.strictEqual(result2.totalLeads, 0); // Should skip and generate 0 leads

    const skippedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-no-reviews",
        }
      }
    });
    assert.strictEqual(skippedLead, null);
    console.log("✅ TEST 2 PASSED: Business with no reviews skipped successfully.");

    // TEST Case 3: Business with high rating / no complaints (should be skipped)
    console.log("\n--- TEST 3: Business with high rating / no complaints (should be skipped) ---");
    const job3 = await createJob("restaurant");

    googlePlacesService.searchText = async () => {
      return [{ place_id: "place-high-rating" }];
    };

    googlePlacesService.getPlaceDetails = async () => {
      return {
        id: "place-high-rating",
        displayName: { text: "Resto Sempurna" },
        rating: 4.9,
        userRatingCount: 150,
        reviews: [
          { rating: 5, text: { text: "Sangat bersih, cepat, enak sekali makanannya!" } },
          { rating: 5, text: { text: "Pelayanan luar biasa memuaskan." } }
        ]
      };
    };

    const result3 = await runLeadSearch({
      jobId: job3.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "restaurant",
      solutionFocus: "QR Ordering & POS System",
    });

    assert.strictEqual(result3.success, true);
    assert.strictEqual(result3.totalLeads, 0); // Should skip and generate 0 leads

    const skippedLead2 = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-high-rating",
        }
      }
    });
    assert.strictEqual(skippedLead2, null);
    console.log("✅ TEST 3 PASSED: Business with high rating and no complaints skipped successfully.");

    // TEST Case 4: Regression - Deduplication on reprocess
    console.log("\n--- TEST 4: Regression - Deduplication on reprocess ---");
    const job4 = await createJob("cafe");

    googlePlacesService.searchText = async () => {
      return [{ place_id: "place-qualified-1" }];
    };

    googlePlacesService.getPlaceDetails = async () => {
      return {
        id: "place-qualified-1",
        displayName: { text: "Kafe Lambat Sekali (Reprocessed)" },
        formattedAddress: "Jl. Lambat No. 1",
        rating: 3.1,
        userRatingCount: 21,
        websiteUri: "https://lambatcafe.com",
        reviews: [
          { rating: 2, text: { text: "Masih sangat lambat pelayanannya." } }
        ]
      };
    };

    setMockAnalyzeLeadWithLLM(async () => {
      return {
        score: "Medium",
        reason: "Masih lambat tetapi ada sedikit perbaikan.",
        whatsapp: null,
        confidence: 80,
        no_instagram: true,
        no_pos: true,
        complaint_category: "slow_service",
        bad_review_summary: "Masih sangat lambat pelayanannya.",
        recommended_solution: "Layanan menu digital.",
      };
    });

    const result4 = await runLeadSearch({
      jobId: job4.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "cafe",
      solutionFocus: "QR Ordering & POS System",
    });

    assert.strictEqual(result4.success, true);
    assert.strictEqual(result4.totalLeads, 1);

    // Verify deduplication: count should still be 1 total lead for this user and place ID
    const count = await prisma.lead.count({
      where: {
        userId: testUser.id,
        place_id: "place-qualified-1",
      }
    });
    assert.strictEqual(count, 1);

    const updatedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-qualified-1",
        }
      }
    });
    assert.ok(updatedLead);
    assert.strictEqual(updatedLead.business_name, "Kafe Lambat Sekali (Reprocessed)");
    assert.strictEqual(updatedLead.ai_lead_score, "Medium");
    console.log("✅ TEST 4 PASSED: Deduplication and lead update works correctly on reprocess.");

    // Clean up
    await prisma.lead.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.searchJob.deleteMany({
      where: { userId: testUser.id },
    });

    console.log("\n🎉 ALL WORKFLOW TESTS PASSED SUCCESSFULLY!");

  } finally {
    // Restore original methods
    googlePlacesService.searchText = originalSearchText;
    googlePlacesService.getPlaceDetails = originalGetPlaceDetails;
    setMockAnalyzeLeadWithLLM(null);
  }
}

runTests().catch(err => {
  console.error("❌ TEST FAILED:", err);
  process.exit(1);
});

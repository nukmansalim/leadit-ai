import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from "vitest";
import { prisma } from "../prisma";
import { googlePlacesService } from "../google-places";
import { setMockAnalyzeLeadWithLLM } from "../llm/llm";
import { runLeadSearch } from "./lead-search.service";
import type { User } from "@prisma/client";

describe("Lead Search Service", () => {
  let testUser: User;

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

  beforeAll(async () => {
    // 1. Setup Test User
    testUser = await prisma.user.upsert({
      where: { email: "test-editor@leadit.ai" },
      update: {},
      create: {
        email: "test-editor@leadit.ai",
        name: "Test Editor",
      },
    });

    // Clean up any stray test data before starting
    await prisma.lead.deleteMany({
      where: { userId: testUser.id },
    });
    await prisma.searchJob.deleteMany({
      where: { userId: testUser.id },
    });
  });

  afterEach(async () => {
    // Restore all Vitest mocks
    vi.restoreAllMocks();
    setMockAnalyzeLeadWithLLM(null);
  });

  afterAll(async () => {
    // Clean up all test data to prevent database pollution
    if (testUser) {
      await prisma.lead.deleteMany({
        where: { userId: testUser.id },
      });
      await prisma.searchJob.deleteMany({
        where: { userId: testUser.id },
      });
      await prisma.user.delete({
        where: { id: testUser.id },
      });
    }
  });

  it("should process a qualified lead with negative reviews successfully", async () => {
    const job = await createJob("cafe");

    const searchTextSpy = vi
      .spyOn(googlePlacesService, "searchText")
      .mockResolvedValue([{ place_id: "place-qualified-1" }]);

    const getPlaceDetailsSpy = vi
      .spyOn(googlePlacesService, "getPlaceDetails")
      .mockResolvedValue({
        id: "place-qualified-1",
        displayName: { text: "Kafe Lambat Sekali" },
        formattedAddress: "Jl. Lambat No. 1",
        rating: 3.1,
        userRatingCount: 20,
        websiteUri: "https://lambatcafe.com",
        nationalPhoneNumber: "08123456789",
        reviews: [
          {
            rating: 2,
            text: {
              text: "Pelayanan di kafe ini sangat lambat dan lama sekali antrean kasirnya.",
            },
          },
          { rating: 5, text: { text: "Rasa kopi enak." } },
        ],
      } as any);

    setMockAnalyzeLeadWithLLM(async () => {
      return {
        score: "High",
        reason:
          "Kafe ini memiliki keluhan berulang mengenai pelayanan lambat dan kasir yang membuat antrean panjang.",
        whatsapp: "628123456789",
        confidence: 90,
        no_instagram: true,
        no_pos: true,
        complaint_category: "slow_service",
        bad_review_summary: "Pelayanan sangat lambat dan antrean kasir lama.",
        recommended_solution:
          "Implementasi menu QR digital mandiri untuk memangkas antrean di kasir.",
      };
    });

    const result = await runLeadSearch({
      jobId: job.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "cafe",
      solutionFocus: "QR Ordering & POS System",
    });

    expect(searchTextSpy).toHaveBeenCalled();
    expect(getPlaceDetailsSpy).toHaveBeenCalledWith("place-qualified-1");
    expect(result.success).toBe(true);
    expect(result.totalLeads).toBe(1);

    const savedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-qualified-1",
        },
      },
    });

    expect(savedLead).not.toBeNull();
    expect(savedLead!.business_name).toBe("Kafe Lambat Sekali");
    expect(savedLead!.ai_lead_score).toBe("High");
    expect(savedLead!.complaint_category).toBe("slow_service");
    expect(savedLead!.bad_review_summary).toBe(
      "Pelayanan sangat lambat dan antrean kasir lama.",
    );
    expect(savedLead!.recommended_solution).toBe(
      "Implementasi menu QR digital mandiri untuk memangkas antrean di kasir.",
    );
    expect(savedLead!.confidence).toBe(90);
  });

  it("should skip a business with no reviews", async () => {
    const job = await createJob("bakery");

    vi.spyOn(googlePlacesService, "searchText").mockResolvedValue([
      { place_id: "place-no-reviews" },
    ]);

    vi.spyOn(googlePlacesService, "getPlaceDetails").mockResolvedValue({
      id: "place-no-reviews",
      displayName: { text: "Bakery Sunyi" },
      rating: 0,
      userRatingCount: 0,
      reviews: [],
    } as any);

    const result = await runLeadSearch({
      jobId: job.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "bakery",
      solutionFocus: "QR Ordering & POS System",
    });

    expect(result.success).toBe(true);
    expect(result.totalLeads).toBe(0);

    const skippedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-no-reviews",
        },
      },
    });
    expect(skippedLead).toBeNull();
  });

  it("should skip a business with high rating and no complaints", async () => {
    const job = await createJob("restaurant");

    vi.spyOn(googlePlacesService, "searchText").mockResolvedValue([
      { place_id: "place-high-rating" },
    ]);

    vi.spyOn(googlePlacesService, "getPlaceDetails").mockResolvedValue({
      id: "place-high-rating",
      displayName: { text: "Resto Sempurna" },
      rating: 4.9,
      userRatingCount: 150,
      reviews: [
        {
          rating: 5,
          text: { text: "Sangat bersih, cepat, enak sekali makanannya!" },
        },
        { rating: 5, text: { text: "Pelayanan luar biasa memuaskan." } },
      ],
    } as any);

    const result = await runLeadSearch({
      jobId: job.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "restaurant",
      solutionFocus: "QR Ordering & POS System",
    });

    expect(result.success).toBe(true);
    expect(result.totalLeads).toBe(0);

    const skippedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-high-rating",
        },
      },
    });
    expect(skippedLead).toBeNull();
  });

  it("should handle deduplication correctly on reprocess and update existing lead details", async () => {
    const job = await createJob("cafe");

    // Seed initial lead in database to make this test isolated and repeatable
    await prisma.lead.upsert({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-qualified-1",
        },
      },
      update: {
        business_name: "Kafe Lambat Sekali",
        ai_lead_score: "High",
      },
      create: {
        userId: testUser.id,
        place_id: "place-qualified-1",
        jobId: job.id,
        business_name: "Kafe Lambat Sekali",
        ai_lead_score: "High",
        ai_analysis_reason:
          "Kafe ini memiliki keluhan berulang mengenai pelayanan lambat.",
      },
    });

    vi.spyOn(googlePlacesService, "searchText").mockResolvedValue([
      { place_id: "place-qualified-1" },
    ]);

    vi.spyOn(googlePlacesService, "getPlaceDetails").mockResolvedValue({
      id: "place-qualified-1",
      displayName: { text: "Kafe Lambat Sekali (Reprocessed)" },
      formattedAddress: "Jl. Lambat No. 1",
      rating: 3.1,
      userRatingCount: 21,
      websiteUri: "https://lambatcafe.com",
      reviews: [{ rating: 2, text: { text: "Masih sangat lambat pelayanannya." } }],
    } as any);

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

    const result = await runLeadSearch({
      jobId: job.id,
      userId: testUser.id,
      location: "Test City",
      businessCategory: "cafe",
      solutionFocus: "QR Ordering & POS System",
    });

    expect(result.success).toBe(true);
    expect(result.totalLeads).toBe(1);

    // Verify deduplication: count should still be exactly 1 lead for this user and place ID
    const count = await prisma.lead.count({
      where: {
        userId: testUser.id,
        place_id: "place-qualified-1",
      },
    });
    expect(count).toBe(1);

    const updatedLead = await prisma.lead.findUnique({
      where: {
        userId_place_id: {
          userId: testUser.id,
          place_id: "place-qualified-1",
        },
      },
    });

    expect(updatedLead).not.toBeNull();
    expect(updatedLead!.business_name).toBe("Kafe Lambat Sekali (Reprocessed)");
    expect(updatedLead!.ai_lead_score).toBe("Medium");
  });
});

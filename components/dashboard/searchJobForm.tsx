"use client";

import { createSearchJob } from "@/lib/dashboard/queries";
import { createSearchJobSchema } from "@/lib/dashboard/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateSearchJobCardProps = {
  onCreated: (jobId: string) => void;
};

export function CreateSearchJobCard({ onCreated }: CreateSearchJobCardProps) {
  const queryClient = useQueryClient();
  const [websiteStatus, setWebsiteStatus] = useState<string>("any");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createSearchJob,
    onSuccess: async (result) => {
      setErrorMessage(null);
      onCreated(result.jobId);
      await queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create job.",
      );
    },
  });

  function handleSubmit(formData: FormData) {
    const parsed = createSearchJobSchema.safeParse({
      location: formData.get("location"),
      solutionFocus: formData.get("solutionFocus"),
      ratingLimit: formData.get("ratingLimit"),
      websiteStatus:
        websiteStatus === "has-website"
          ? true
          : websiteStatus === "missing-website"
            ? false
            : undefined,
    });

    if (!parsed.success) {
      setErrorMessage(z.flattenError(parsed.error).formErrors[0]);
      return;
    }

    mutation.mutate(parsed.data);
  }

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Create lead search job</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="Jakarta Selatan"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solutionFocus">Solution focus</Label>
            <Input
              id="solutionFocus"
              name="solutionFocus"
              placeholder="Pembuatan Website UMKM"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label>Website status</Label>
            <Select value={websiteStatus} onValueChange={setWebsiteStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Any website status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="missing-website">Missing website</SelectItem>
                <SelectItem value="has-website">Has website</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ratingLimit">Rating limit</Label>
            <Input
              id="ratingLimit"
              name="ratingLimit"
              type="number"
              min="0"
              max="5"
              step="0.1"
              placeholder="4.0"
            />
          </div>

          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Search className="mr-2 size-4" />
            )}
            Start search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

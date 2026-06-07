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
  const [targetCategory, setTargetCategory] = useState<string>("cafe");
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleWeakness = (val: string) => {
    setWeaknesses((prev) =>
      prev.includes(val) ? prev.filter((w) => w !== val) : [...prev, val]
    );
  };

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
      solutionFocus: targetCategory,
      digitalWeaknesses: weaknesses,
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
            <Label>Target F&B category</Label>
            <Select value={targetCategory} onValueChange={setTargetCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select F&B category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe">Cafe / Coffee Shop</SelectItem>
                <SelectItem value="rumah makan">Rumah Makan / Warung</SelectItem>
                <SelectItem value="restaurant">Restaurant / Restoran</SelectItem>
                <SelectItem value="bakery">Bakery / Toko Roti</SelectItem>
                <SelectItem value="catering">Catering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Digital Weaknesses (AND filter)</Label>
            <div className="space-y-2 rounded-xl border p-3 bg-muted/20">
              <label className="flex items-center space-x-2.5 cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  checked={weaknesses.includes("no-website")}
                  onChange={() => toggleWeakness("no-website")}
                  className="rounded border-input text-primary focus:ring-ring h-4 w-4 accent-primary"
                />
                <span>Doesn&apos;t have a website</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  checked={weaknesses.includes("no-instagram")}
                  onChange={() => toggleWeakness("no-instagram")}
                  className="rounded border-input text-primary focus:ring-ring h-4 w-4 accent-primary"
                />
                <span>Doesn&apos;t have Instagram on Maps</span>
              </label>
              <label className="flex items-center space-x-2.5 cursor-pointer text-sm font-medium">
                <input
                  type="checkbox"
                  checked={weaknesses.includes("no-pos")}
                  onChange={() => toggleWeakness("no-pos")}
                  className="rounded border-input text-primary focus:ring-ring h-4 w-4 accent-primary"
                />
                <span>Doesn&apos;t use POS / Cash-only clues</span>
              </label>
            </div>
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

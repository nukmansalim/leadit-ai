"use client";

import type { DashboardLead } from "@/lib/dashboard/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Globe, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function getScoreVariant(score: string): "default" | "secondary" | "destructive" | "outline" {
  if (score === "High") return "default";
  if (score === "Medium") return "secondary";
  if (score === "Low") return "destructive";
  return "outline";
}

export const leadColumns: ColumnDef<DashboardLead>[] = [
  {
    accessorKey: "ai_lead_score",
    header: "AI Score",
    cell: ({ row }) => {
      const score = row.original.ai_lead_score;

      return <Badge variant={getScoreVariant(score)}>{score}</Badge>;
    },
  },
  {
    accessorKey: "business_name",
    header: "Business",
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <div className="max-w-[320px]">
          <p className="font-medium">{lead.business_name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {lead.address ?? "No address"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Google",
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <div>
          <p className="font-medium">{lead.rating ?? "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {lead.total_reviews ?? 0} reviews
          </p>
        </div>
      );
    },
  },
  {
    id: "contacts",
    header: "Contact Gaps",
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="size-4 text-muted-foreground" />
            {lead.website ? "Has website" : "Missing website"}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle className="size-4 text-muted-foreground" />
            {lead.formatted_whatsapp || lead.phone
              ? "Contact available"
              : "No contact info"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "ai_analysis_reason",
    header: "AI Analysis",
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              View reason
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{lead.business_name}</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-6 text-muted-foreground">
              {lead.ai_analysis_reason}
            </p>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const lead = row.original;
      const mapsUrl = `https://www.google.com/maps/place/?q=place_id:${lead.place_id}`;

      return (
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            disabled={!lead.formatted_whatsapp}
            variant={lead.formatted_whatsapp ? "default" : "secondary"}
          >
            <a
              href={lead.formatted_whatsapp ?? "#"}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!lead.formatted_whatsapp}
            >
              <MessageCircle className="mr-2 size-4" />
              WA
            </a>
          </Button>

          <Button
            asChild
            size="sm"
            disabled={!lead.website}
            variant="outline"
          >
            <a
              href={lead.website ?? "#"}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!lead.website}
            >
              <ExternalLink className="mr-2 size-4" />
              Web
            </a>
          </Button>

          <Button asChild size="sm" variant="outline">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin className="mr-2 size-4" />
              Maps
            </a>
          </Button>
        </div>
      );
    },
  },
];

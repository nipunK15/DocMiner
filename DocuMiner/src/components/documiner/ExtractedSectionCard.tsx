
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Tag } from "lucide-react";
import type { ExtractedSection } from "@/lib/types";

type ExtractedSectionCardProps = {
  section: ExtractedSection;
  onOpenChat: (section: ExtractedSection) => void;
};

export function ExtractedSectionCard({
  section,
  onOpenChat,
}: ExtractedSectionCardProps) {
  return (
    <Card className="transition-all hover:shadow-lg flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{section.sectionTitle}</CardTitle>
            <CardDescription>
              From: {section.document} (Page {section.page})
            </CardDescription>
          </div>
          <Badge
            variant={section.importanceRank > 7 ? "default" : "secondary"}
            className={section.importanceRank > 7 ? "bg-primary" : ""}
          >
            Importance: {section.importanceRank}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {section.tags && section.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
              {section.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                 <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="text-muted-foreground whitespace-pre-wrap">{section.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChat(section)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat about this section
        </Button>
      </CardFooter>
    </Card>
  );
}

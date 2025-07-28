
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { AIResponse, ExtractedSection } from "@/lib/types";
import { AlertCircle, Inbox, Download } from "lucide-react";
import { ExtractedSectionCard } from "./ExtractedSectionCard";
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type ResultsDisplayProps = {
  isLoading: boolean;
  aiResponse: AIResponse | null;
  error: string | null;
  onOpenChat: (section: ExtractedSection) => void;
};

export function ResultsDisplay({
  isLoading,
  aiResponse,
  error,
  onOpenChat,
}: ResultsDisplayProps) {

  const handleDownloadPdf = () => {
    if (!aiResponse) return;

    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("DocuMiner AI - Analysis Results", 14, 22);

    const sections = aiResponse.analysis.extractedSections
      .sort((a, b) => b.importanceRank - a.importanceRank);

    const tableData = sections.map(section => ([
        section.sectionTitle,
        section.document,
        section.page,
        section.importanceRank,
        section.content
    ]));

    (doc as any).autoTable({
        head: [['Title', 'Document', 'Page', 'Rank', 'Content']],
        body: tableData,
        startY: 30,
        headStyles: { fillColor: [22, 163, 74] },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 30 },
            2: { cellWidth: 15 },
            3: { cellWidth: 15 },
            4: { cellWidth: 'auto' },
        },
        didParseCell: function (data: any) {
            if (data.column.dataKey === 4) { // Content column
                data.cell.styles.fontStyle = 'italic';
            }
        }
    });

    doc.save("documiner-analysis.pdf");
  };


  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!aiResponse) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Inbox className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">Results will appear here</h3>
        <p className="text-muted-foreground">
          Upload documents and provide context to start the analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
        <Button onClick={handleDownloadPdf} disabled={!aiResponse}>
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Extracted Sections</h3>
          <div className="space-y-4">
            {aiResponse.analysis.extractedSections
              .sort((a, b) => b.importanceRank - a.importanceRank)
              .map((section, index) => (
                <ExtractedSectionCard
                  key={index}
                  section={section}
                  onOpenChat={onOpenChat}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Analyzing...</h2>
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/documiner/Logo";
import { ThemeToggle } from "@/components/documiner/ThemeToggle";
import { PersonaBar } from "@/components/documiner/PersonaBar";
import { DocumentUpload } from "@/components/documiner/DocumentUpload";
import { ResultsDisplay } from "@/components/documiner/ResultsDisplay";
import { handleAnalysis } from "@/app/actions";
import type { AIResponse, ExtractedSection } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { ChatbotDialog } from "@/components/documiner/ChatbotDialog";
import type { DocumentData } from "@/lib/types";

export default function Home() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [aiResponse, setAiResponse] = React.useState<AIResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();

  const [chatSection, setChatSection] = React.useState<ExtractedSection | null>(null);

  const onAnalyze = async (data: {
    persona: string;
    jobToBeDone: string;
    tone: string;
    includeContextualTags: boolean;
  }) => {
    if (files.length < 3 || files.length > 10) {
      toast({
        variant: "destructive",
        title: "Invalid number of files",
        description: "Please upload between 3 and 10 PDF documents.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    const documents: DocumentData[] = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        buffer: Buffer.from(await file.arrayBuffer()),
      }))
    );
    
    const result = await handleAnalysis({ ...data, documents });

    if (result.error) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    } else if (result.data) {
      setAiResponse(result.data);
    }
    
    setIsLoading(false);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen overflow-hidden">
          <header className="p-4 border-b">
            <PersonaBar onAnalyze={onAnalyze} isLoading={isLoading} />
          </header>
          <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
            <div className="rounded-lg border shadow-sm flex flex-col h-full overflow-y-auto">
              <DocumentUpload files={files} setFiles={setFiles} />
            </div>
            <div className="rounded-lg border shadow-sm flex flex-col h-full overflow-y-auto">
              <ResultsDisplay
                isLoading={isLoading}
                aiResponse={aiResponse}
                error={error}
                onOpenChat={setChatSection}
              />
            </div>
          </main>
        </div>
      </SidebarInset>
      <ChatbotDialog section={chatSection} setSection={setChatSection} />
    </SidebarProvider>
  );
}


export type ExtractedSection = {
  document: string;
  page: number;
  sectionTitle: string;
  importanceRank: number;
  content: string;
  tags?: string[];
};

export type AnalysisResult = {
  extractedSections: ExtractedSection[];
};

export type AIResponse = {
  analysis: AnalysisResult;
};

export type DocumentData = {
    name: string;
    buffer: Buffer;
}

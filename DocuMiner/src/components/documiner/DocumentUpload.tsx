"use client";

import * as React from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DocumentUploadProps = {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

export function DocumentUpload({ files, setFiles }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (newFiles: FileList | null) => {
    if (newFiles) {
      const addedFiles = Array.from(newFiles);
      if (files.length + addedFiles.length > 10) {
        toast({
          variant: "destructive",
          title: "File limit exceeded",
          description: "You can upload a maximum of 10 documents.",
        });
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...addedFiles]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  
  return (
    <div className="p-6 flex flex-col h-full">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Documents</h2>
      <div
        className={cn(
          "flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300",
          isDragging ? "border-primary bg-accent" : "border-border"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="font-semibold text-lg">Drag & drop PDFs here</p>
        <p className="text-muted-foreground">or click to browse</p>
        <p className="text-sm text-muted-foreground mt-2">3-10 documents, max 10MB each</p>
      </div>
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Uploaded Files ({files.length}/10)</h3>
          <ul className="mt-2 space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 rounded-md bg-secondary"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate" title={file.name}>{file.name}</span>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 rounded-full hover:bg-destructive/20 text-destructive">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

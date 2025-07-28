import { Archive } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Archive className="w-8 h-8 text-primary" />
      <h1 className="text-xl font-bold text-foreground">DocuMiner AI</h1>
    </div>
  );
}

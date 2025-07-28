
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExtractedSection } from "@/lib/types";
import { SendHorizonal, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { handleChat } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type ChatbotDialogProps = {
  section: ExtractedSection | null;
  setSection: (section: ExtractedSection | null) => void;
};

type Message = {
  sender: "user" | "bot";
  text: string;
  isLoading?: boolean;
};

export function ChatbotDialog({ section, setSection }: ChatbotDialogProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (section) {
      setMessages([
        {
          sender: "bot",
          text: `Hi! Let's talk about the section "${section.sectionTitle}". What would you like to know?`,
        },
      ]);
    }
  }, [section]);

  React.useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector("div");
        if(scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending || !section) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage, {sender: "bot", text: "", isLoading: true}]);
    setInput("");
    setIsSending(true);

    const result = await handleChat({
      question: input,
      section: {
        sectionTitle: section.sectionTitle,
        content: section.content,
      },
    });

    if (result.error || !result.response) {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: result.error || "Failed to get a response from the AI.",
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove the loading message
    } else {
      const botResponse: Message = { sender: "bot", text: result.response };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    }

    setIsSending(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSection(null);
      setMessages([]);
      setInput("");
      setIsSending(false);
    }
  };

  return (
    <Dialog open={!!section} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Analyze Section</DialogTitle>
          <DialogDescription>
            Chat with the AI about "{section?.sectionTitle}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4 -mx-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "bot" && (
                    <Avatar>
                      <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-lg max-w-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    {message.isLoading ? (
                         <div className="flex items-center justify-center space-x-1">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                        </div>
                    ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <Avatar>
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              autoFocus
              disabled={isSending}
            />
            <Button onClick={handleSend} size="icon" disabled={isSending}>
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

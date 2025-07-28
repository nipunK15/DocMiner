"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  persona: z.string().min(2, {
    message: "Persona must be at least 2 characters.",
  }),
  jobToBeDone: z.string().min(10, {
    message: "Job to be done must be at least 10 characters.",
  }),
  tone: z.string(),
  includeContextualTags: z.boolean().default(false),
});

type PersonaBarProps = {
  onAnalyze: (values: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
};

export function PersonaBar({ onAnalyze, isLoading }: PersonaBarProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      persona: "",
      jobToBeDone: "",
      tone: "Professional",
      includeContextualTags: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAnalyze(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <FormField
          control={form.control}
          name="persona"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona</FormLabel>
              <FormControl>
                <Input placeholder="e.g., AI Researcher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobToBeDone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job to be done</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summarize topics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Informative">Informative</SelectItem>
                  <SelectItem value="Concise">Concise</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="includeContextualTags"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
               <FormLabel>Contextual Tags</FormLabel>
              <div className="flex items-center space-x-2 h-10">
                <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <Label htmlFor="includeContextualTags" className="text-sm font-normal text-muted-foreground">
                    Include smart tags
                </Label>
               </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full lg:w-auto justify-self-start">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
      </form>
    </Form>
  );
}

// schemas.ts

import { z } from "zod"

// Schema for individual flashcards
export const FlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
})

// Schema for content objects within summary or keyPoints
export const ContentObjectSchema = z.object({
  title: z.string(),
  flashcards: z.array(FlashcardSchema),
  explanation: z.string(),
})

// Schema for the main content passed to ExplanationModal
export const ContentSchema = z.object({
  chapterId: z.string().optional(),
  chapterName: z.string(),
  content: z.union([z.string(), ContentObjectSchema]),
})

// Schema for the chapter content fetched in RevisionSection
export const ChapterContentSchema = z.object({
  summary: z.array(z.union([z.string(), ContentObjectSchema])),
  keyPoints: z.array(z.union([z.string(), ContentObjectSchema])),
  chapterName: z.string(),
})

// TypeScript types inferred from schemas
export type Flashcard = z.infer<typeof FlashcardSchema>
export type ContentObject = z.infer<typeof ContentObjectSchema>
export type Content = z.infer<typeof ContentSchema>
export type ChapterContent = z.infer<typeof ChapterContentSchema>

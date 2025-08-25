// src/ai/flows/suggest-assignees.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest task assignees based on task description, past history, and current workload.
 *
 * - suggestTaskAssignees - A function that takes task details and suggests potential assignees.
 * - SuggestTaskAssigneesInput - The input type for the suggestTaskAssignees function.
 * - SuggestTaskAssigneesOutput - The return type for the suggestTaskAssignees function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskAssigneesInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to be assigned.'),
  pastHistory: z
    .string()
    .optional()
    .describe('The past history of similar tasks and their assignees.'),
  currentWorkload: z
    .string()
    .optional()
    .describe('Information about the current workload of potential assignees.'),
});
export type SuggestTaskAssigneesInput = z.infer<typeof SuggestTaskAssigneesInputSchema>;

const SuggestTaskAssigneesOutputSchema = z.object({
  suggestedAssignees: z
    .array(z.string())
    .describe('An array of suggested assignees for the task.'),
  reasoning: z.string().describe('The reasoning behind the assignee suggestions.'),
});
export type SuggestTaskAssigneesOutput = z.infer<typeof SuggestTaskAssigneesOutputSchema>;

export async function suggestTaskAssignees(input: SuggestTaskAssigneesInput): Promise<SuggestTaskAssigneesOutput> {
  return suggestTaskAssigneesFlow(input);
}

const suggestAssigneesPrompt = ai.definePrompt({
  name: 'suggestAssigneesPrompt',
  input: {schema: SuggestTaskAssigneesInputSchema},
  output: {schema: SuggestTaskAssigneesOutputSchema},
  prompt: `You are an AI assistant that suggests potential assignees for a task.

  Based on the task description, past history (if available), and current workload (if available), suggest a list of suitable assignees.
  Explain the reasoning behind each suggestion.

  Task Description: {{{taskDescription}}}
  Past History: {{{pastHistory}}}
  Current Workload: {{{currentWorkload}}}

  Output format: array of suggested assignees and the reason behind each suggestion.
  `,
});

const suggestTaskAssigneesFlow = ai.defineFlow(
  {
    name: 'suggestTaskAssigneesFlow',
    inputSchema: SuggestTaskAssigneesInputSchema,
    outputSchema: SuggestTaskAssigneesOutputSchema,
  },
  async input => {
    const {output} = await suggestAssigneesPrompt(input);
    return output!;
  }
);

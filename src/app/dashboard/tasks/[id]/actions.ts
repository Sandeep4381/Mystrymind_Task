
'use server';

import { suggestTaskAssignees, SuggestTaskAssigneesInput } from '@/ai/flows/suggest-assignees';

export async function getSuggestedAssignees(input: SuggestTaskAssigneesInput) {
    try {
        const result = await suggestTaskAssignees(input);
        return result;
    } catch (error) {
        console.error("Error suggesting assignees:", error);
        return { error: 'Failed to get suggestions.' };
    }
}

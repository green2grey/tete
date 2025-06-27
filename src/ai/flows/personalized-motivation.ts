'use server';
/**
 * @fileOverview Provides personalized motivational messages and fitness tips to users based on their progress and department performance.
 *
 * - getPersonalizedMotivation - A function that retrieves personalized motivation for a user.
 * - PersonalizedMotivationInput - The input type for the getPersonalizedMotivation function.
 * - PersonalizedMotivationOutput - The return type for the getPersonalizedMotivation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedMotivationInputSchema = z.object({
  userStepCount: z.number().describe('The current step count of the user.'),
  departmentTotalSteps: z.number().describe('The total step count of the user\'s department.'),
  departmentRank: z.number().describe('The current rank of the user\'s department among all departments.'),
  challengeTargetSteps: z.number().describe('The target step count for the challenge.'),
  userName: z.string().describe('The name of the user.'),
  departmentName: z.string().describe('The name of the user\'s department.'),
});
export type PersonalizedMotivationInput = z.infer<typeof PersonalizedMotivationInputSchema>;

const PersonalizedMotivationOutputSchema = z.object({
  message: z.string().describe('A personalized motivational message for the user.'),
  fitnessTip: z.string().describe('A relevant fitness tip to encourage the user.'),
});
export type PersonalizedMotivationOutput = z.infer<typeof PersonalizedMotivationOutputSchema>;

export async function getPersonalizedMotivation(input: PersonalizedMotivationInput): Promise<PersonalizedMotivationOutput> {
  return personalizedMotivationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedMotivationPrompt',
  input: {schema: PersonalizedMotivationInputSchema},
  output: {schema: PersonalizedMotivationOutputSchema},
  prompt: `You are an AI assistant providing personalized motivational messages and fitness tips to users participating in a step challenge.

  Based on the user's individual step count, their department's total steps and rank, and the overall challenge progress, generate an encouraging message and a relevant fitness tip.

  User Name: {{userName}}
  Department Name: {{departmentName}}
  User Step Count: {{userStepCount}}
  Department Total Steps: {{departmentTotalSteps}}
  Department Rank: {{departmentRank}}
  Challenge Target Steps: {{challengeTargetSteps}}

  Consider the following:
  - If the user's step count is low, encourage them to take small steps and remind them of the benefits of physical activity.
  - If the department is lagging behind, motivate the user to contribute to improving their department's rank.
  - If the challenge is nearing completion, encourage the user to maintain their momentum and finish strong.

  Message: {{message}}
  Fitness Tip: {{fitnessTip}}`,
});

const personalizedMotivationFlow = ai.defineFlow(
  {
    name: 'personalizedMotivationFlow',
    inputSchema: PersonalizedMotivationInputSchema,
    outputSchema: PersonalizedMotivationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

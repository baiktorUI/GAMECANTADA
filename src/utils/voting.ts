import type { Question } from '../types';

export function calculateTotalVotes(question: Question): number {
  return question.votes.reduce((sum, count) => sum + count, 0);
}

export function getWinningOption(question: Question): string {
  const maxVotes = Math.max(...question.votes);
  return question.options[question.votes.indexOf(maxVotes)];
}
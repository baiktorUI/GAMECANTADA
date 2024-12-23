import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function getQuestions() {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createQuestion(options: string[]) {
  const { data, error } = await supabase
    .from('questions')
    .insert([
      {
        options,
        votes: new Array(options.length).fill(0)
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function registerVote(questionId: number, optionIndex: number) {
  const { data: question, error: fetchError } = await supabase
    .from('questions')
    .select('votes')
    .eq('id', questionId)
    .single();

  if (fetchError) throw fetchError;

  const newVotes = [...question.votes];
  newVotes[optionIndex]++;

  const { error: updateError } = await supabase
    .from('questions')
    .update({ votes: newVotes })
    .eq('id', questionId);

  if (updateError) throw updateError;
}

export async function hasUserVoted(userId: string, questionId: number) {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .single();

  if (error && error.code !== 'PGRST116') return false;
  return !!data;
}
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getVotingState() {
  const { data, error } = await supabase
    .from('voting_state')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateVotingState(state: {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
}) {
  const { error } = await supabase
    .from('voting_state')
    .upsert({ id: 1, ...state });
  
  if (error) throw error;
}

export async function registerVote(optionIndex: number) {
  const { data: currentState, error: fetchError } = await supabase
    .from('voting_state')
    .select('votes')
    .single();

  if (fetchError) throw fetchError;

  const newVotes = [...currentState.votes];
  newVotes[optionIndex]++;

  const { error: updateError } = await supabase
    .from('voting_state')
    .update({ votes: newVotes })
    .eq('id', 1);

  if (updateError) throw updateError;
}
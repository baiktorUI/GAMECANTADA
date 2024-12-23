import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Vote, VotingSession } from '../types';

export function useVotingSession() {
  const [session, setSession] = useState<VotingSession | null>(null);
  const [options, setOptions] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Get or create session
    const initSession = async () => {
      let { data: sessions } = await supabase
        .from('voting_sessions')
        .select('*')
        .limit(1)
        .single();

      if (!sessions) {
        const { data: newSession } = await supabase
          .from('voting_sessions')
          .insert([{}])
          .select()
          .single();
        sessions = newSession;

        // Create default options
        await supabase.from('voting_options').insert([
          { session_id: sessions.id, name: 'Option 1' },
          { session_id: sessions.id, name: 'Option 2' },
          { session_id: sessions.id, name: 'Option 3' },
        ]);
      }

      setSession(sessions);

      // Subscribe to session changes
      const sessionSubscription = supabase
        .channel('session-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'voting_sessions' },
          (payload) => {
            setSession(payload.new as VotingSession);
          }
        )
        .subscribe();

      return () => {
        sessionSubscription.unsubscribe();
      };
    };

    initSession();
  }, []);

  useEffect(() => {
    if (!session) return;

    // Get options and subscribe to changes
    const loadOptions = async () => {
      const { data } = await supabase
        .from('voting_options')
        .select('*')
        .order('created_at');

      if (data) {
        setOptions(data);
      }

      const optionsSubscription = supabase
        .channel('options-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'voting_options' },
          (payload) => {
            setOptions((current) =>
              current.map((option) =>
                option.id === payload.new.id ? payload.new : option
              )
            );
          }
        )
        .subscribe();

      return () => {
        optionsSubscription.unsubscribe();
      };
    };

    loadOptions();
  }, [session]);

  const toggleVoting = async () => {
    if (!session) return;

    await supabase
      .from('voting_sessions')
      .update({ is_active: !session.is_active })
      .eq('id', session.id);

    if (session.is_active) {
      // Reset votes when stopping
      await supabase
        .from('voting_options')
        .update({ votes: 0 })
        .eq('session_id', session.id);
      setHasVoted(false);
    }
  };

  const handleVote = async (optionId: string) => {
    if (!session?.is_active || hasVoted) return;

    const { error } = await supabase.from('votes').insert([
      {
        option_id: optionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ]);

    if (!error) {
      setHasVoted(true);
    }
  };

  const handleNameChange = async (optionId: string, newName: string) => {
    if (!session || session.is_active) return;

    await supabase
      .from('voting_options')
      .update({ name: newName })
      .eq('id', optionId);
  };

  return {
    isVotingActive: session?.is_active ?? false,
    options,
    hasVoted,
    toggleVoting,
    handleVote,
    handleNameChange,
  };
}
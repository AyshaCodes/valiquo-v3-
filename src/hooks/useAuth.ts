import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as AppUser } from '../types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setState({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            prenom: meta?.prenom ?? '',
            nom: meta?.nom ?? '',
            ville: meta?.ville ?? '',
          },
          session,
          loading: false,
        });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setState({
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            prenom: meta?.prenom ?? '',
            nom: meta?.nom ?? '',
            ville: meta?.ville ?? '',
          },
          session,
          loading: false,
        });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signOut };
}

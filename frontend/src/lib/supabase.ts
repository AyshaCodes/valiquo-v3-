// src/lib/supabase.ts

export const supabase = {
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simule l'état initial : utilisateur non connecté
      callback('SIGNED_OUT', null);
      // Retourne un objet avec une fonction unsubscribe
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      };
    },
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  }),
};
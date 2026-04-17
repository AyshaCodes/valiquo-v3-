// src/lib/supabase.ts (Mock complet)
export const supabase = {
  auth: {
    // Méthodes de base
    signUp: async () => ({ data: null, error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    
    // ⭐ Méthodes manquantes ajoutées ici
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Appelle le callback immédiatement avec une session nulle
      callback('INITIAL_SESSION', null);
      // Retourne un objet avec une fonction d'unsubscribe factice
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    }
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null })
      })
    })
  })
};
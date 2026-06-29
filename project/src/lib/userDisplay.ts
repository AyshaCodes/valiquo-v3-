import type { User } from '../types/auth';

export function getUserFirstName(user: User | null | undefined): string {
  return user?.first_name ?? user?.name?.split(' ')[0] ?? 'Utilisateur';
}

export function getUserInitial(user: User | null | undefined): string {
  return (user?.first_name?.[0] ?? user?.name?.[0] ?? 'U').toUpperCase();
}

export function getUserDisplayName(user: User | null | undefined): string {
  return user?.name ?? 'Utilisateur';
}

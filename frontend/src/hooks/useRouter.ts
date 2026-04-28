import { useState, useEffect, useCallback } from 'react';
import type { Page } from '../types';

function getPage(): Page {
  const hash = window.location.hash.replace('#/', '').replace('#', '').split('?')[0];
  const valid: Page[] = ['home', 'scan', 'login', 'register', 'dashboard'];
  return valid.includes(hash as Page) ? (hash as Page) : 'home';
}

export function useRouter() {
  const [page, setPage] = useState<Page>(getPage);

  useEffect(() => {
    const handler = () => setPage(getPage());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((to: Page) => {
    window.location.hash = `#/${to}`;
    setPage(to);
  }, []);

  return { page, navigate };
}

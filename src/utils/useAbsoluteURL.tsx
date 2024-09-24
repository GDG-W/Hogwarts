import { usePathname, useSearchParams } from 'next/navigation';

export function useAbsoluteURL() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (typeof window === 'undefined') {
    return null; // We're on the server side
  }

  const { origin } = window.location;
  const query = searchParams.toString();
  return `${origin}${pathname}${query ? `?${query}` : ''}`;
}

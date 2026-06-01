import { useLangStore } from '@/store/useLangStore';
import { dictionaries, type Dict } from './dict';

/** Current-language dictionary. Re-renders consumers when the language changes. */
export function useT(): Dict {
  return useLangStore((s) => dictionaries[s.lang]);
}

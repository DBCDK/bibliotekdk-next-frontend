import useSWR from "swr";
let globalState = {};

/**
 * Custom hook for managing global state using SWR.
 * Changes are broadcasted to all components that use the same key
 */
export function useGlobalState({ key, initial }) {
  const { data, mutate } = useSWR(key, () => globalState[key], {
    fallbackData: initial,
  });

  function setState(val) {
    globalState[key] = val;
    mutate();
  }

  return [data, setState];
}
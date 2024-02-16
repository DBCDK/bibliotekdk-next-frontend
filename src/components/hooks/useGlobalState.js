import useSWR from "swr";
let globalState = {};
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

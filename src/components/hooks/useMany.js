import throttle from "lodash/throttle";
import { useEffect, useMemo } from "react";
import { setGlobalState, useGlobalState } from "./useGlobalState";

let allReq = {};
let allRes = {};

const throttledSetGlobalState = throttle(setGlobalState, 500, {
  trailing: true,
  leading: true,
});

export function UseManyProvider() {
  const [didChange] = useGlobalState({
    key: "notifyProvider",
    initial: {},
  });

  const renderMe = useMemo(() => {
    return Object.entries(allReq).map(([key, el]) => {
      const { entry, useCustomHook, useManyKey } = el;
      return (
        <DummyHookComponent
          key={key}
          parametersString={key}
          parameters={entry}
          responseMap={allRes}
          useCustomHook={useCustomHook}
          forceRender={() => throttledSetGlobalState(useManyKey, Date.now())}
        />
      );
    });
  }, [didChange]);

  return <>{renderMe}</>;
}
/**
 * This is sort of like a Promise.all, but for hooks.
 * It is tricky to make this work, and still adhere to the rules of hooks,
 * where they cannot be invoked from within a loop
 *
 */
export function useMany(useManyKey, parametersArray, useCustomHook) {
  useManyKey = `notifyObserver-${useManyKey}}`;

  const [didChange] = useGlobalState({ key: useManyKey, initial: {} });

  useEffect(() => {
    let changed = false;
    parametersArray?.forEach((entry) => {
      const entryKey = `${useManyKey}${JSON.stringify(entry)}`;
      if (!allReq[entryKey]) {
        allReq[entryKey] = { entry, useCustomHook, useManyKey, counter: 0 };
        changed = true;
      }
      allReq[entryKey].counter++;
    });
    if (changed) {
      throttledSetGlobalState("notifyProvider", Date.now());
    }

    return () => {
      parametersArray?.forEach((entry) => {
        const entryKey = `${useManyKey}${JSON.stringify(entry)}`;
        allReq[entryKey].counter--;
        if (allReq[entryKey].counter === 0) {
          // if entry is not being used by other useMany hooks, we delete it
          delete allReq[entryKey];
        }
      });
    };
  }, [parametersArray]);

  const result = useMemo(() => {
    return parametersArray?.map(
      (key) => allRes[`${useManyKey}${JSON.stringify(key)}`]
    );
  }, [didChange, parametersArray]);
  return {
    result,
  };
}

/**
 * A React component, that will use the hook
 * and send the hooks response back to the main useMany hook
 */
function DummyHookComponent({
  parameters,
  useCustomHook,
  forceRender,
  responseMap = {},
  parametersString,
}) {
  const res = useCustomHook(parameters || {});
  // When hook response changes, we add
  useEffect(() => {
    responseMap[parametersString] = res;
    forceRender();
  }, [JSON.stringify(res)]);
  return null;
}

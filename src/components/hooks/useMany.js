import throttle from "lodash/throttle";
import { useState, useEffect, useRef, useMemo } from "react";

/**
 * This is sort of like a Promise.all, but for hooks.
 * It is tricky to make this work, and still adhere to the rules of hooks,
 * where they cannot be invoked from within a loop
 *
 */
export function useMany(parametersArray, useCustomHook) {
  const [_, forceRender] = useState();
  const forceRenderThrottled = throttle(forceRender, 500);

  // Holds the response for each hook
  const responseArray = useRef();

  const stringifiedParams = JSON.stringify(parametersArray);

  // Reset the response array when parameters array changes
  useMemo(() => {
    if (parametersArray?.length > 0) {
      responseArray.current = [...Array(parametersArray?.length)];
    } else {
      responseArray.current = [];
    }
  }, [stringifiedParams]);

  // A list of react components where each component
  // invokes the custom hook.
  const renderMe = useMemo(() => {
    const timestamp = Date.now();

    return parametersArray?.map((parameters, index) => (
      <DummyHookComponent
        key={`${JSON.stringify(parameters)}-${timestamp}`}
        index={index}
        parameters={parameters}
        responseArray={responseArray}
        useCustomHook={useCustomHook}
        forceRender={forceRenderThrottled}
      />
    ));
  }, [stringifiedParams]);

  return { renderMe, result: responseArray.current };
}

/**
 * A React component, that will use the hook
 * and send the hooks response back to the main useMany hook
 */
function DummyHookComponent({
  index,
  parameters,
  responseArray,
  useCustomHook,
  forceRender,
}) {
  const res = useCustomHook(parameters);

  // When hook response changes, we add
  useEffect(() => {
    const newRes = [...responseArray.current];
    newRes[index] = res;
    responseArray.current = newRes;
    forceRender({});
  }, [JSON.stringify(res)]);
  return null;
}

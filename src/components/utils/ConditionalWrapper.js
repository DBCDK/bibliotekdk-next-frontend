/*interface IConditionalWrapper {
  condition: boolean;
  wrapper: (children: JSX.Element) => JSX.Element;
  children: JSX.Element;
}*/

/**
 * Used for conditionally wrap a tag around a JSX.Element
 */

const ConditionalWrapper = ({ condition, wrapper, elseWrapper, children }) =>
  condition
    ? wrapper(children)
    : elseWrapper
    ? elseWrapper(children)
    : children;

export default ConditionalWrapper;

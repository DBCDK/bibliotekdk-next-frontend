/**
 * Used for conditionally wrap a tag around a React.ReactElement
 * Returns wrapper if condition is true, only children if false
 * - unless a elseWrapper is defined, which would then be returned instead of just children
 */

const ConditionalWrapper = ({ condition, wrapper, elseWrapper, children }) =>
  condition
    ? wrapper(children)
    : elseWrapper
    ? elseWrapper(children)
    : children;

export default ConditionalWrapper;

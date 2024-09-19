/**
 * Goes to previous modal page
 * If we are in single order flow, we have "order" modal in stack,
 * if we come from multiorder flow, we have "multiorder" modal in stack
 * @param {Object} modal
 */
export const goToPreviousModal = (modal) => {
  if (!modal) return;
  const modalIdx = modal.stack.findIndex(
    (m) =>
      m.id === "multiorder" || m.id === "order" || m.id === "ematerialfilter"
  );
  if (modalIdx > -1) modal.select(modalIdx);
};

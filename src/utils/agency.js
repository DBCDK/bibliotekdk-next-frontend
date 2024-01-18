/**
 * Function to check if an agencyId is a FFU library
 *
 * @param {string} agencyId
 * @returns boolean
 */

export function _isFFUAgency(branchId) {
  const LENGTH = 6;
  const list = ["4", "6", "8", "9"];
  return branchId?.length === LENGTH && list.includes(branchId?.charAt(0));
}

export function isFFUAgency(branch) {
  if (!branch?.agencyType) {
    return _isFFUAgency(branch?.branchId);
  }
  return !!(branch?.agencyType === "FORSKNINGSBIBLIOTEK");
}

export function getBranchFromAgencies(branchId, agencies) {
  let match = {};
  agencies?.forEach((agency) => {
    match = agency?.result?.find((branch) => branch.branchId === branchId);
  });
  return match;
}

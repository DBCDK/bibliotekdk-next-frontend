import { HiddenRoleFunctionEnum } from "@/lib/enums";

/**
 * Map a single person ({disploy{roles[{function, functioncode}]}}
 * @param person
 * @param hiddenRoles
 * @returns {React.JSX.Element}
 *  a string "disploy (function)" .. eg "ebbe fisk (instruktør)"
 */
export function parseFunction(
  person,
  hiddenRoles = Object.values(HiddenRoleFunctionEnum).map((role) => role.code)
) {
  const roles = person?.roles
    ?.filter((role) => !hiddenRoles.includes(role?.functionCode))
    ?.map((role) => role?.function?.singular || "");
  return roles?.length > 0 ? " (" + roles?.join(", ") + ") " : "";
}

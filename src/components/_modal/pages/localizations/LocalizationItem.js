import { useData } from "@/lib/api/api";
import * as branchFragments from "@/lib/api/branches.fragments";

export function LocalizationItem({ branch }) {
  return <div>fisk {branch.name}</div>;
}

export default function wrap({ branch, selectedMaterial }) {
  // @TODO .. what do we need here
  // .. we need detailed holdings to show expected delivery
  //const { data, isLoading } = useData(branchFragments.branchHoldings());

  return <LocalizationItem branch={branch} />;
}

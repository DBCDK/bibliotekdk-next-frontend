// components/Popover.js
import { useState } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
//import SearchIcon from "./icons/search";

const PopoverTrigger = () => {
    const{ showPopup, setShowPopup} = useAdvancedSearchContext();

console.log('showPopup',showPopup)
  return (
      <button onClick={()=>setShowPopup(!showPopup)}>Show Popover</button>

  );
};

export default PopoverTrigger;

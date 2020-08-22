import React, { useState } from "react";
import Work from "./Work";

export default {
  title: "Prototype:Work",
};

export const Doppler = () => {
  const [pid, setPid] = useState("870970-basis:51883322");
  return <Work pid={pid} onWorkClick={(pid) => setPid(pid)} />;
};

import { useState } from "react";
import Work from "../components/prototype/work/Work";

export default () => {
  const [pid, setPid] = useState("870970-basis:51883322");
  return (
    <div>
      Hello world!
      <Work pid={pid} onWorkClick={(pid) => setPid(pid)} />
    </div>
  );
};

// components/Popover.js
import { forwardRef, useState } from 'react';
import { Button, Popover } from 'react-bootstrap';
const MyPopover = forwardRef(({popoverVisible,setPopoverVisible,target}, ref) => (
<Popover
 ref={ref}
show={popoverVisible}
target={target}
placement="bottom"
onClose={() => setPopoverVisible(false)}
>
<Popover.Content>
  This is a Bootstrap popover!
</Popover.Content>
</Popover>



));
export default function Popover3() {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [target, setTarget] = useState(null);

  const handleButtonClick = (event) => {
    setPopoverVisible(!popoverVisible);
    setTarget(event.target);
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Show Popover</Button>
      <MyPopover popoverVisible={popoverVisible} setPopoverVisible={setPopoverVisible} target={target} />
    </div>
  );
};


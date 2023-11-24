import { OverlayTrigger, Popover, Button } from "react-bootstrap";

import { forwardRef } from "react";

const MyPopover = forwardRef((props, ref) => (
  <Popover ref={ref}>
    <Popover.Title as="h3">GeeksforGeeks</Popover.Title>
    <Popover.Content>Greetings from GeeksforGeeks</Popover.Content>
  </Popover>
));

export default function PopoverTest() {
  return (
    <OverlayTrigger placement="bottom" trigger="click" overlay={MyPopover}>
      <button variant="success">Open Popover</button>
    </OverlayTrigger>
  );
}

import Button from "./Button";

export default {
  title: "Prototype:Button",
};

export const buttonFilled = () => {
  return (
    <div>
      <div className="story-heading"> Primary buttons </div>

      <Button type="filled" size="large">
        Large
      </Button>

      <div className="x-space-2" />

      <Button type="filled" size="medium">
        Medium
      </Button>

      <div className="x-space-2" />

      <Button type="filled" size="small">
        Small
      </Button>

      <div className="story-heading"> Disabled primary buttons </div>

      <Button type="filled" size="large" disabled={true}>
        Large
      </Button>

      <div className="x-space-2" />

      <Button type="filled" size="medium" disabled={true}>
        Medium
      </Button>

      <div className="x-space-2" />

      <Button type="filled" size="small" disabled={true}>
        Small
      </Button>
    </div>
  );
};

export const buttonOutlined = () => {
  return (
    <div>
      <Button type="outlined" size="large">
        Large
      </Button>

      <div className="space-2" />

      <Button type="outlined" size="large" disabled={true}>
        Large
      </Button>

      <div className="space-2" />

      <Button type="outlined" size="medium">
        Medium
      </Button>

      <div className="space-2" />

      <Button type="outlined" size="small">
        Small
      </Button>
    </div>
  );
};

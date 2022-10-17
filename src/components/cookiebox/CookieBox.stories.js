import { CookieBox } from "./CookieBox";

const exportedObject = {
  title: "cookies/CookieBox",
};

export default exportedObject;

export function CookieBox_full() {
  return <CookieBox />;
}

export function CookieBox_small() {
  return <CookieBox size="small" />;
}

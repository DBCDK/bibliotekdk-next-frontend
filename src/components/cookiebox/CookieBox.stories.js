import { CookieBox } from "./CookieBox";

export default {
  title: "cookies/CookieBox",
};

export function CookieBox_full() {
  return <CookieBox />;
}

export function CookieBox_small() {
  return <CookieBox size="small" />;
}

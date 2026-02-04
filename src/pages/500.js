// pages/500.js
import React from "react";
import ErrorPage from "@/pages/fejl";

export default function Custom500() {
  return <ErrorPage statusCode={500} />;
}

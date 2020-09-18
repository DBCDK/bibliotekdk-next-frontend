import Breadcrumbs from "./Breadcrumbs";
import Skeleton from "../skeleton";
import { useEffect, useState } from "react";

export default {
  title: "Breadcrumbs",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function BreadcrumbPath() {
  const path = ["This", "is", "Some", "Relative", "Path"];

  return <Breadcrumbs path={path} />;
}

export function Loading() {
  return <Breadcrumbs skeleton={true} crumbs={5} />;
}

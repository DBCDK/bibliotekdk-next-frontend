import PropTypes from "prop-types";

import Input from "@/components/base/forms/input";

import styles from "./Filter.module.css";

export function Filter({ data }) {
  return (
    <div className={styles.filter}>
      <Input onChange={(value) => console.log(("input", { value }))} />
      <ul className={styles.items}>
        <li className={styles.item}>hest</li>
      </ul>
    </div>
  );
}

export function FilterSkeleton(props) {
  const data = [];

  return <Filter {...props} data={data} />;
}

export default function Wrap(props) {
  if (props.skeleton) {
    return <FilterSkeleton {...props} />;
  }
  return <Filter {...props} />;
}

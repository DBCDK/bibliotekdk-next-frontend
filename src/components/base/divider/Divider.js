import styles from "./Divider.module.css";
import { StoryTitle } from "../storybook";

/**
 * divider  - basically hr
 * @returns {JSX.Element}
 * @constructor
 */
export function Divider({}) {
  return (
    <React.Fragment>
      <StoryTitle>Divider</StoryTitle>
      <hr className={styles.divider} />
    </React.Fragment>
  );
}

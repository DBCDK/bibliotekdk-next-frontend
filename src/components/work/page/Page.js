import PropTypes from "prop-types";
import Recommendations from "../recommendations";
import Content from "../content";
import Description from "../description";
import Details from "../details";
import Overview from "../overview";
import Keywords from "../keywords";

/**
 * The work page React component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function WorkPage({ workId, onTypeChange, type = "Bog" }) {
  return (
    <main>
      <Overview workId={workId} onTypeChange={onTypeChange} type={type} />
      <Details workId={workId} type={type} />
      <Description workId={workId} type={type} />
      <Content workId={workId} type={type} />
      <Recommendations workId={workId} />
      <Keywords workId={workId} type={type} />
    </main>
  );
}

WorkPage.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
};

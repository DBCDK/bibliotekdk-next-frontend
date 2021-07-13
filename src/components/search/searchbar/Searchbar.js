import { Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import { openMobileSuggester } from "@/components/header/suggester/Suggester";
import Translate from "@/components/base/translate";
import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Link from "@/components/base/link";

import styles from "./Searchbar.module.css";
import { MobileList } from "@/components/base/select/Select";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {obj} props
 * @param {string} props.className
 *
 * @returns {component}
 */
export default function Searchbar({ query }) {
  const router = useRouter();

  /**** Filter materials start **/
  const materialFilters = [
    { value: "all", label: "all_materials" },
    { value: "literature", label: "books" },
    { value: "article", label: "articles" },
    { value: "movie", label: "film" },
    { value: "game", label: "games" },
    { value: "music", label: "music" },
    { value: "sheetmusic", label: "nodes" },
  ];
  // check if materialtype is set in query parameters
  const matparam = router && router.query.materialtype;
  let index = 0;
  if (matparam) {
    index = materialFilters.findIndex(function (element, indx) {
      return element.value === matparam;
    });
  }
  index = index === -1 ? 0 : index;
  const selectedMaterial = materialFilters[index];
  // select function passsed to select list (@see components/base/select)
  // simply push to router - the useData hook in /find page will register the change
  // and update the result
  const onOptionClicked = (idx) => {
    router &&
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          materialtype: idx !== 0 ? materialFilters[idx].value : "",
        },
      });
  };
  /**** Filter materials end**/

  return (
    <div className={styles.wrap}>
      <Section
        title={false}
        bgColor={"var(--concrete)"}
        className={styles.section}
      >
        <Row>
          <Col xs={12} md={{ span: 8, offset: 2 }}>
            <Row>
              <Col xs={12}>
                <FakeSearchInput query={query} />
                <div>
                  <MobileList
                    options={materialFilters}
                    selectedMaterial={selectedMaterial}
                    onOptionClicked={onOptionClicked}
                  />
                </div>
              </Col>
              {/* REMOVE for now - do not show if it does not work - TODO enable when time comes
              <Col xs={12} className={styles.filter}>
                <span
                  className={styles.button}
                  onClick={() => {
                    if (router) {
                      router.push({
                        pathname: router.pathname,
                        query: { ...router.query, modal: "filter" },
                      });
                    }
                  }}
                >
                  <Link onClick={(e) => e.preventDefault()}>
                    <Text type="text3">
                      {Translate({ context: "search", label: "filters" })}
                    </Text>
                  </Link>

                  <Icon size={2} src="chevron.svg" alt="" />
                </span>
              </Col>
              */}
            </Row>
          </Col>
        </Row>
      </Section>
    </div>
  );
}

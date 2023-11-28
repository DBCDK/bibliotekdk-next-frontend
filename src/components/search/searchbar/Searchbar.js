import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useModal } from "@/components/_modal";
import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";
import Section from "@/components/base/section";
import styles from "./Searchbar.module.css";
import { MobileMaterialSelect } from "@/components/search/select";
import React from "react";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {string} q
 *
 * @returns {React.JSX.Element}
 */
export default function Searchbar({ q }) {
  // modal
  const modal = useModal();

  return (
    <div className={styles.wrap}>
      <Section
        title={false}
        backgroundColor={"var(--concrete)"}
        className={styles.section}
      >
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={12}>
                <FakeSearchInput q={q} />
                <div>
                  <MobileMaterialSelect
                    onFilterClick={() => modal.push("filter", { q })}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Section>
    </div>
  );
}

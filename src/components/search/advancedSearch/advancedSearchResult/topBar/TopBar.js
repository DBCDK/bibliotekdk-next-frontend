import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

/**
 *
 * Returns query in a human readable way.
 */
export function FormatedQuery() {
  const { cqlFromUrl, fieldSearchFromUrl } = useAdvancedSearchContext();

  const { inputFields, dropdownSearchIndices } = fieldSearchFromUrl;

  if (!!cqlFromUrl) {
    return cqlFromUrl;
  }

  //TODO: do this in context instead
  const filteredDropdownSearchIndices = dropdownSearchIndices.filter(
    (dropdown) => dropdown.value?.length > 0
  );
  return (
    <div className={styles.formatedQueryContainer}>
      {inputFields.map((field, index) => {
        const isEmpty = field?.value?.length === 0;
              //if first item no
        //filter for empty
        if (isEmpty) {
          return null;
        }
        return (
          <div key={index} className={styles.formatedQueryItem}>
            {field.prefixLogicalOperator && (
              <Text>
                {Translate({
                  context: "search",
                  label: `advanced-dropdown-${field.prefixLogicalOperator}`,
                })}
              </Text>
            )}
            <Text type="text4" tag="span">
              {Translate({
                context: "search",
                label: `advanced-dropdown-${field.searchIndex}`,
              })}
              :
            </Text>

            <Text>{`"${field.value}"`}</Text>
          </div>
        );
      })}
      {filteredDropdownSearchIndices?.map((dropdownItem, index) => {
        const isLastItem = index === filteredDropdownSearchIndices.length - 1;
        const isEmpty = dropdownItem?.value?.length === 0;

        if (isEmpty) {
          return null;
        }
        return (
          <div key={index} className={styles.formatedQueryItem}>
            <Text type="text4">
              {Translate({
                context: "advanced_search_dropdown",
                label: dropdownItem.searchIndex,
              })}
              :
            </Text>
            <Text>{dropdownItem?.value?.join(", ")}</Text>
            {!isLastItem && (
              <Text>
                {Translate({
                  context: "search",
                  label: `advanced-dropdown-AND`,
                })}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default function TopBar({}) {
  const { setShowPopover } = useAdvancedSearchContext();
  return (
    <div className={styles.container}>
      <Container fluid>
        <Row>
          <Col xs={12} lg={2}>
            <Text type="text4">
              {Translate({ context: "search", label: "yourSearch" })}
            </Text>
          </Col>
          <Col xs={12} lg={{ offset: 1, span: true }}>
            <FormatedQuery />
          </Col>

          <Col xs={12} lg={2}>
            <Link
              onClick={() => {
                setShowPopover(true);
              }}
              border={{
                top: false,
                bottom: {
                  keepVisible: true,
                },
              }}
            >
              <Text type="text3" tag="span">
                {Translate({ context: "search", label: "editSearch" })}
              </Text>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import isEmpty from "lodash/isEmpty";

/**
 *
 * Returns query in a human readable way.
 */
export function FormatedQuery() {
  const { cqlFromUrl, fieldSearchFromUrl } = useAdvancedSearchContext();

  const { inputFields, dropdownSearchIndices } = fieldSearchFromUrl;

  if (!!cqlFromUrl) {
    return <Text type="text2">{cqlFromUrl}</Text>;
  }

  const fieldsearch = {
    inputFields,
    dropdownSearchIndices,
  };

  return FormatFieldSearchIndexes({ fieldsearch });
}

export function FormatFieldSearchIndexes({ fieldsearch }) {
  //TODO: do this in context instead
  const filteredDropdownSearchIndices =
    fieldsearch?.dropdownSearchIndices?.filter(
      (dropdown) => !isEmpty(dropdown.value)
    );
  const filteredInputFields = fieldsearch?.inputFields?.filter(
    (field) => !isEmpty(field.value)
  );

  console.log(filteredDropdownSearchIndices, "FILTERED");

  return (
    <div className={styles.formatedQueryContainer}>
      <FormatFieldInput
        inputFields={filteredInputFields}
        showAndOperator={filteredDropdownSearchIndices?.length > 0}
      />
      <FormatDropdowns
        dropdowns={filteredDropdownSearchIndices}
        showAndOperator={filteredInputFields?.length > 0}
      />
    </div>
  );
}

function FormatFieldInput({ inputFields }) {
  const mappedfields = inputFields?.map((field, index) => {
    const isEmpty = field?.value?.length === 0;
    if (isEmpty) {
      return null;
    }
    return (
      <>
        {field.prefixLogicalOperator && index !== 0 && (
          <Text type="text2">
            {Translate({
              context: "search",
              label: `advanced-dropdown-${field.prefixLogicalOperator}`,
            })}
          </Text>
        )}
        <Text type="text1" className={styles.searchIndexText}>
          {Translate({
            context: "search",
            label: `advanced-dropdown-${field.searchIndex}`,
          })}
          :
        </Text>

        <Text type="text2">{`"${field.value}"`}</Text>
      </>
    );
  });
  return mappedfields;
}

function FormatDropdowns({ dropdowns, showAndOperator }) {
  const mapped = dropdowns?.map((dropdownItem, index) => {
    const isLastItem = index === dropdowns.length - 1;
    const isEmpty = dropdownItem?.value?.length === 0;

    if (isEmpty) {
      return null;
    }
    return (
      <>
        {index === 0 && showAndOperator && (
          <Text type="text2">
            {Translate({
              context: "search",
              label: `advanced-dropdown-AND`,
            })}
          </Text>
        )}
        <Text type="text1" className={styles.searchIndexText}>
          {Translate({
            context: "advanced_search_dropdown",
            label: dropdownItem.searchIndex,
          })}
          :
        </Text>
        <Text type="text2">{dropdownItem?.value?.join(", ")}</Text>
        {!isLastItem && (
          <Text type="text2">
            {Translate({
              context: "search",
              label: `advanced-dropdown-AND`,
            })}
          </Text>
        )}
      </>
    );
  });
  return mapped;
}

export default function TopBar() {
  const { setShowPopover } = useAdvancedSearchContext();
  return (
    <div className={styles.container}>
      <Container fluid>
        <Row>
          <Col xs={12} lg={2}>
            <Text type="text1">
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

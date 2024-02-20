import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import isEmpty from "lodash/isEmpty";
import { formattersAndComparitors } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { getFacetsQuery } from "@/components/search/advancedSearch/utils";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

/**
 *
 * Returns query in a human readable way.
 */
export function FormattedQuery() {
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

  const { selectedFacets } = useFacets();

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
      <Text type="text1">{getFacetsQuery(selectedFacets)}</Text>
    </div>
  );
}

function FormatFieldInput({ inputFields }) {
  return inputFields?.map((field, index) => {
    const isEmpty = field?.value?.length === 0;
    if (isEmpty) {
      return null;
    }
    return (
      <>
        {field.prefixLogicalOperator && index !== 0 && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({
              context: "search",
              label: `advanced-dropdown-${field.prefixLogicalOperator}`,
            })}
          </Text>
        )}
        <Text type="text1">
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
}

function FormatDropdowns({ dropdowns, showAndOperator }) {
  return dropdowns?.map((dropdownItem, index) => {
    const { getSelectedPresentation } = formattersAndComparitors(
      dropdownItem.searchIndex
    );
    const isLastItem = index === dropdowns.length - 1;
    const isEmpty = dropdownItem?.value?.length === 0;

    if (isEmpty) {
      return null;
    }
    return (
      <>
        {index === 0 && showAndOperator && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({
              context: "search",
              label: `advanced-dropdown-AND`,
            })}
          </Text>
        )}
        <Text type="text1">
          {Translate({
            context: "advanced_search_dropdown",
            label: dropdownItem.searchIndex,
          })}
          :
        </Text>
        <Text type="text2">
          {dropdownItem?.value
            ?.map((val) => getSelectedPresentation(val.value))
            .join(", ")}
        </Text>
        {!isLastItem && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({
              context: "search",
              label: `advanced-dropdown-AND`,
            })}
          </Text>
        )}
      </>
    );
  });
}

export default function TopBar({ isLoading = false }) {
  const { setShowPopover } = useAdvancedSearchContext();
  return (
    <Link
      className={styles.container}
      onClick={() => {
        setShowPopover(true);
      }}
      border={false}
    >
      <Container fluid>
        <Row>
          <Col xs={12} lg={2} className={styles.your_search}>
            <Text type="text1" skeleton={isLoading}>
              {Translate({ context: "search", label: "yourSearch" })}
            </Text>
          </Col>
          <Col xs={12} lg={{ offset: 1, span: true }}>
            <FormattedQuery />
          </Col>

          <Col xs={12} lg={2} className={styles.edit_search}>
            <Text type="text3" tag="span" skeleton={isLoading}>
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
                {Translate({ context: "search", label: "editSearch" })}
              </Link>
            </Text>
          </Col>
        </Row>
      </Container>
    </Link>
  );
}

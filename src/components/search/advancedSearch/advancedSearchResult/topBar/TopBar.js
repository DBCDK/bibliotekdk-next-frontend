import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import isEmpty from "lodash/isEmpty";

export function FormatFieldSearchIndexes({ fieldsearch }) {
  return (
    <>
      <FormatFieldInput inputFields={fieldsearch.inputFields} />
      <FormatDropdowns dropdowns={fieldsearch.dropdownSearchIndices} />
    </>
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
        {field.prefixLogicalOperator && (
          <Text type="text4" className={styles.noWrap}>
            {Translate({
              context: "search",
              label: `advanced-dropdown-${field.prefixLogicalOperator}`,
            })}
          </Text>
        )}
        <Text type="text4" className={styles.noWrap}>
          {Translate({
            context: "search",
            label: `advanced-dropdown-${field.searchIndex}`,
          })}
          :
        </Text>

        <Text className={styles.noWrap}>{` "${field.value}" `}</Text>
      </>
    );
  });
  return mappedfields;
}

function FormatDropdowns({ dropdowns }) {
  const mapped = dropdowns?.map((dropdownItem, index) => {
    const isLastItem = index === dropdowns.length - 1;
    const isEmpty = dropdownItem?.value?.length === 0;

    if (isEmpty) {
      return null;
    }
    return (
      <>
        <Text type="text4" className={styles.noWrap}>
          {Translate({
            context: "advanced_search_dropdown",
            label: dropdownItem.searchIndex,
          })}
          :
        </Text>
        <Text className={styles.noWrap}>{dropdownItem?.value?.join(", ")}</Text>
        {!isLastItem && (
          <Text className={styles.noWrap}>
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
    (dropdown) => !isEmpty(dropdown.value)
  );
  const filteredInputFields = inputFields.filter(
    (field) => !isEmpty(field.value)
  );
  return (
    <div className={styles.formatedQueryContainer}>
      <div className={styles.formatedQueryItem}>
        <FormatFieldInput inputFields={filteredInputFields} />
      </div>
      <div className={styles.formatedQueryItem}>
        <FormatDropdowns dropdowns={filteredDropdownSearchIndices} />
      </div>
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

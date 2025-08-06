// TopBar.js
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
import useSavedSearches from "@/components/hooks/useSavedSearches";
import IconButton from "@/components/base/iconButton";
import { useModal } from "@/components/_modal";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

function FormattedQuery({ children }) {
  const { cqlFromUrl, fieldSearchFromUrl } = useAdvancedSearchContext();
  const { inputFields, dropdownSearchIndices, workType } =
    fieldSearchFromUrl || {};

  if (cqlFromUrl) {
    return (
      <div className={styles.formatedQueryContainer}>
        <Text type="text2">{cqlFromUrl}</Text>
        {children}
      </div>
    );
  }

  const fieldsearch = { inputFields, dropdownSearchIndices, workType };
  return (
    <FormatFieldSearchIndexes fieldsearch={fieldsearch}>
      {children}
    </FormatFieldSearchIndexes>
  );
}

function FormatFieldSearchIndexes({ fieldsearch, children }) {
  const filteredDropdownSearchIndices =
    fieldsearch?.dropdownSearchIndices?.filter((d) => !isEmpty(d.value));
  const filteredInputFields = fieldsearch?.inputFields?.filter(
    (f) => !isEmpty(f.value)
  );

  return (
    <div className={styles.formatedQueryContainer}>
      <FormatWorkType workType={fieldsearch?.workType} />
      <FormatFieldInput
        inputFields={filteredInputFields}
        showAndOperator={fieldsearch?.workType}
      />
      <FormatDropdowns
        dropdowns={filteredDropdownSearchIndices}
        showAndOperator={
          filteredInputFields?.length > 0 || fieldsearch?.workType
        }
      />
      {children}
    </div>
  );
}

function FormatFieldInput({ inputFields, showAndOperator }) {
  return inputFields?.map((field, index) => {
    if (!field?.value) return null;
    return (
      <>
        {index === 0 && showAndOperator && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({ context: "search", label: `advanced-dropdown-AND` })}
          </Text>
        )}
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
            label: `advanced-dropdown-${field?.label || field.searchIndex}`,
          })}
          :
        </Text>
        <Text type="text2">"{field.value}"</Text>
      </>
    );
  });
}

function FormatWorkType({ workType }) {
  if (!workType) return null;
  return (
    <>
      <Text type="text1">
        {Translate({ context: "advanced_search_worktypes", label: "category" })}
        :
      </Text>
      <Text type="text2">
        {Translate({ context: "advanced_search_worktypes", label: workType })}
      </Text>
    </>
  );
}

function FormatDropdowns({ dropdowns, showAndOperator }) {
  return dropdowns?.map((dropdownItem, index) => {
    if (!dropdownItem?.value) return null;

    const { getSelectedPresentation } = formattersAndComparitors(
      dropdownItem.searchIndex
    );
    const isLastItem = index === dropdowns.length - 1;

    return (
      <>
        {index === 0 && showAndOperator && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({ context: "search", label: `advanced-dropdown-AND` })}
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
          {dropdownItem.value
            .map((val, i) => {
              const value = getSelectedPresentation(val.value);
              return i === 0
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : value;
            })
            .join(", ")}
        </Text>
        {!isLastItem && (
          <Text type="text2" className={styles.operator_color}>
            {Translate({ context: "search", label: `advanced-dropdown-AND` })}
          </Text>
        )}
      </>
    );
  });
}

export default function TopBar({
  isLoading = false,
  className = "",
  searchHistoryObj,
}) {
  const modal = useModal();
  const { isAuthenticated } = useAuthentication();
  const { deleteSearches, useSavedSearchByCql } = useSavedSearches();

  const { savedObject, mutate } = useSavedSearchByCql({
    cql: searchHistoryObj.key,
  });
  const isSaved = !!savedObject?.id;

  const onSaveSearchClick = async (e) => {
    e.stopPropagation();
    if (isSaved) {
      await deleteSearches({ idsToDelete: [savedObject?.id] });
      mutate();
    } else {
      modal.push("saveSearch", { item: searchHistoryObj, onSaveDone: mutate });
    }
  };

  const onSaveSearchLogin = (e) => {
    e.stopPropagation();
    openLoginModal({ modal });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`${styles.topBar} ${className}`}>
      <Container fluid className={styles.container}>
        <Row>
          <Col xs={12} lg={2} className={styles.your_search}>
            <Text type="text1">
              {Translate({ context: "search", label: "yourSearch" })}
            </Text>
          </Col>

          <Col
            xs={12}
            lg={{ offset: 1, span: true }}
            className={styles.edit_search}
          >
            <FormattedQuery>
              <Link
                onClick={scrollToTop}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text
                  type="text3"
                  tag="span"
                  skeleton={isLoading}
                  className={styles.editSearchDesktop}
                >
                  {Translate({ context: "search", label: "edit" })}
                </Text>
              </Link>
            </FormattedQuery>
          </Col>

          <Col xs={12} lg={2} className={styles.saveSearchButton}>
            <div className={styles.flexSwitchMobile}>
              <Link
                onClick={scrollToTop}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text
                  type="text3"
                  tag="span"
                  skeleton={isLoading}
                  className={styles.editSearchMobile}
                >
                  {Translate({ context: "search", label: "editSearch" })}
                </Text>
              </Link>

              <IconButton
                className={styles.saveSearchPaddingTop}
                onClick={
                  isAuthenticated ? onSaveSearchClick : onSaveSearchLogin
                }
                icon={isSaved ? "heart_filled" : "heart"}
                keepUnderline
              >
                {Translate({ context: "search", label: "saveSearch" })}
              </IconButton>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

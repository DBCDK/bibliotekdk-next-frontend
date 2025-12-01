// TopBar.cleaned.js
import React, { useMemo, useCallback, Fragment } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { formattersAndComparitors } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { useRouter } from "next/router";
import SaveSearchBtn from "../../save";

// Small helper to shorten Translate calls
const t = (context, label) => Translate({ context, label });

// Generic check for non-empty values (string or array)
const hasValue = (v) => {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && String(v).trim() !== "";
};

function FormattedQuery(props) {
  const { cqlFromUrl, fieldSearchFromUrl } = useAdvancedSearchContext();
  const { inputFields, dropdownSearchIndices, workType } =
    fieldSearchFromUrl || {};

  const fieldsearch = useMemo(
    () => ({
      workType,
      inputFields: (inputFields || []).filter((f) => hasValue(f?.value)),
      dropdownSearchIndices: (dropdownSearchIndices || []).filter((d) =>
        hasValue(d?.value)
      ),
    }),
    [workType, inputFields, dropdownSearchIndices]
  );

  // Hvis CQL er udfyldt, vis det
  if (hasValue(cqlFromUrl)) {
    return (
      <div className={styles.formatedQueryContainer}>
        <Text type="text2">{cqlFromUrl}</Text>
      </div>
    );
  }

  return <FormatFieldSearchIndexes fieldsearch={fieldsearch} {...props} />;
}

export function FormatFieldSearchIndexes({ fieldsearch, isSimple }) {
  const showAndForDropdowns =
    (fieldsearch?.inputFields?.length ?? 0) > 0 ||
    hasValue(fieldsearch?.workType);

  return (
    <div className={styles.formatedQueryContainer}>
      <div className={styles.clampedText}>
        <FormatWorkType workType={fieldsearch?.workType} />
        <FormatFieldInput
          inputFields={fieldsearch?.inputFields}
          isSimple={isSimple}
          showAndOperator={hasValue(fieldsearch?.workType)}
        />
        <FormatDropdowns
          dropdowns={fieldsearch?.dropdownSearchIndices}
          showAndOperator={showAndForDropdowns}
        />
      </div>
    </div>
  );
}

function Operator({ label = "AND" }) {
  return (
    <Text type="text2" className={styles.operator_color}>
      {t("search", `advanced-dropdown-${label}`)}
    </Text>
  );
}

function FormatFieldInput({ inputFields = [], showAndOperator, isSimple }) {
  return inputFields.map((field, index) => {
    if (!hasValue(field?.value)) return null;
    const showLeadingAnd = index === 0 && showAndOperator;
    const showPrefixedOp =
      !showLeadingAnd && hasValue(field?.prefixLogicalOperator);

    return (
      <Fragment key={`fi-${field?.searchIndex || field?.label || index}`}>
        {showLeadingAnd && <Operator label="AND" />}
        {showPrefixedOp && <Operator label={field.prefixLogicalOperator} />}

        {!isSimple && (
          <Text type="text1">
            {t(
              "search",
              `advanced-dropdown-${field?.label || field?.searchIndex}`
            )}
            :
          </Text>
        )}
        <Text type="text2">{`"${field.value}"`}</Text>
      </Fragment>
    );
  });
}

function FormatWorkType({ workType }) {
  if (!hasValue(workType)) return null;
  return (
    <Fragment>
      <Text type="text1">{t("advanced_search_worktypes", "category")}:</Text>
      <Text type="text2">{t("advanced_search_worktypes", workType)}</Text>
    </Fragment>
  );
}

function FormatDropdowns({ dropdowns = [], showAndOperator }) {
  return dropdowns.map((dropdownItem, index) => {
    if (!hasValue(dropdownItem?.value)) return null;

    const { getSelectedPresentation } = formattersAndComparitors(
      dropdownItem.searchIndex
    );
    const isFirst = index === 0;
    const isLast = index === dropdowns.length - 1;

    // Format list of selected values with capitalization for the first
    const valuesText = (dropdownItem.value || [])
      .map((v, i) => {
        const value = getSelectedPresentation(v.value);
        if (!hasValue(value)) return "";
        return i === 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;
      })
      .filter(Boolean)
      .join(", ");

    if (!hasValue(valuesText)) return null;

    return (
      <Fragment key={`dd-${dropdownItem.searchIndex}-${index}`}>
        {isFirst && showAndOperator && <Operator label="AND" />}

        <Text type="text1">
          {t("advanced_search_dropdown", dropdownItem.searchIndex)}:
        </Text>
        <Text type="text2">{valuesText}</Text>

        {!isLast && <Operator label="AND" />}
      </Fragment>
    );
  });
}

export default function TopBar({ isLoading = false, className = "" }) {
  const router = useRouter();

  // Hide the entire TopBar if there are no query values at all
  const { cqlFromUrl, fieldSearchFromUrl } = useAdvancedSearchContext();

  const hasAnyValues = useMemo(() => {
    if (hasValue(cqlFromUrl)) return true;

    const {
      inputFields = [],
      dropdownSearchIndices = [],
      workType,
    } = fieldSearchFromUrl || {};

    if (hasValue(workType)) return true;
    if (inputFields.some((f) => hasValue(f?.value))) return true;
    if (dropdownSearchIndices.some((d) => hasValue(d?.value))) return true;
    return false;
  }, [cqlFromUrl, fieldSearchFromUrl]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const mode = router?.query?.mode || "simpel"; // default fallback

  const labelKey =
    { simpel: "simple", avanceret: "advanced", cql: "cql" }[mode] || "simple";

  const searchHeading = t("search", `topbar-${labelKey}-search`);

  if (!hasAnyValues) return null;

  return (
    <div className={`${styles.topBar} ${className}`}>
      <Container fluid className={styles.container}>
        <Row>
          <Col xs={12} lg={2} className={styles.your_search}>
            <Text type="text1">{searchHeading}</Text>
          </Col>

          <Col
            xs={12}
            lg={{ offset: 1, span: 7 }}
            className={styles.edit_search}
          >
            <FormattedQuery isSimple={mode === "simpel"} />
            <div className={styles.edit}>
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
                  {t("search", "edit")}
                </Text>
              </Link>
            </div>
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
                  {t("search", "editSearch")}
                </Text>
              </Link>

              <SaveSearchBtn />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

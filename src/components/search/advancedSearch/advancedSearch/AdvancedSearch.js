import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "@/components/base/button";
import DropdownInputs from "@/components/search/advancedSearch/dropdownInputs/DropdownInputs";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import IconButton from "@/components/base/iconButton/IconButton";
import { getHelpUrl } from "@/lib/utils";
import cx from "classnames";

/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch({ ariaExpanded, className }) {
  const router = useRouter();

  const {
    inputFields,
    dropdownSearchIndices,
    parsedCQL,
    setParsedCQL,
    cqlFromUrl,
    fieldSearchFromUrl,
    setShowPopover,
    showPopover,
    stateToString,
    resetObjectState,
  } = useAdvancedSearchContext();

  const [showCqlEditor, setShowCqlEditor] = useState(false);
  const textAreaRef = useRef(null);

  useEffect(() => {
    setShowCqlEditor(router?.query?.mode === "cql" || !!cqlFromUrl);
  }, [cqlFromUrl, router?.query?.mode]);

  //add raw cql query in url if showCqlEditor. Add state to url if fieldInputs
  const doAdvancedSearch = () => {
    if (showCqlEditor) {
      const cqlParsedFromUrl = fieldSearchFromUrl
        ? convertStateToCql(fieldSearchFromUrl)
        : cqlFromUrl;
      if (!cqlFromUrl && parsedCQL === cqlParsedFromUrl) {
        const query = { fieldSearch: stateToString };
        router.push({ pathname: "/avanceret", query });
      } else {
        const query = { cql: parsedCQL };
        router.push({ pathname: "/avanceret", query });
      }
    } else {
      const query = { fieldSearch: stateToString };
      router.push({ pathname: "/avanceret", query });
      //save in state
      const cql = convertStateToCql({ inputFields, dropdownSearchIndices });
      setParsedCQL(cql);
    }
    setShowPopover(false);
  };

  return (
    <div
      // We use areaExpanded for showing
      //   the className
      aria-expanded={ariaExpanded}
      className={cx(styles.background, className)}
    >
      {showPopover && (
        <Container fluid className={styles.container}>
          <Row className={styles.topContainer}>
            <Col md={{ offset: 3, span: 4 }} sm={12}>
              <Title type="title3">
                {Translate({ context: "search", label: "advancedSearch" })}
              </Title>
            </Col>
            <Col md={3} sm={12} className={styles.buttonContainer}>
              <Text type="text3" tag="span">
                <Link
                  dataCy="edit-in-cql"
                  onClick={() => {
                    setShowCqlEditor(!showCqlEditor);
                  }}
                  border={{
                    top: false,
                    bottom: {
                      keepVisible: true,
                    },
                  }}
                >
                  {Translate({
                    context: "search",
                    label: showCqlEditor
                      ? "showInputFields"
                      : "editInCqlEditor",
                  })}
                </Link>
              </Text>

              <Text type="text3" tag="span">
                <Link
                  onClick={() => setTimeout(() => setShowPopover(false), 100)}
                  href="/avanceret/soegehistorik"
                  border={{
                    top: false,
                    bottom: {
                      keepVisible: true,
                    },
                  }}
                >
                  {Translate({
                    context: "search",
                    label: "searchHistory",
                  })}
                </Link>
              </Text>
            </Col>

            <Col md={2} sm={12} className={styles.closeContainer}>
              <IconButton
                data-cy="advanced-search-close-button"
                icon="close"
                onClick={() => setShowPopover(false)}
                keepUnderline={true}
              >
                {Translate({ context: "general", label: "close" })}
              </IconButton>
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={12}>
              {/**Insert material type select here */}
            </Col>
            {showCqlEditor ? (
              <Col md={7} sm={12}>
                <CqlTextArea
                  textAreaRef={textAreaRef}
                  doAdvancedSearch={doAdvancedSearch}
                />
              </Col>
            ) : (
              <Col md={9} sm={12}>
                <>
                  <TextInputs doAdvancedSearch={doAdvancedSearch} />
                  <DropdownInputs />
                </>
              </Col>
            )}
          </Row>
          <Row className={styles.buttonRow}>
            <Col
              className={styles.button_group}
              md={{ offset: 3, span: 5 }}
              sm={12}
            >
              <Button
                className={styles.button}
                size="medium"
                onClick={doAdvancedSearch}
              >
                {Translate({
                  context: "search",
                  label: "advancedSearch_button",
                })}
              </Button>
              <Text type="text3">
                <Link
                  dataCy="advanced-search-clear-search"
                  border={{ bottom: { keepVisible: true } }}
                  onClick={() => {
                    resetObjectState();
                    router.push({
                      pathname: router.pathname,
                      ...(showCqlEditor && { query: { mode: "cql" } }),
                    });
                  }}
                >
                  {Translate({ context: "search", label: "clearSearch" })}
                </Link>
              </Text>
              <Text type="text3" tag="span" className={styles.helpLink}>
                <Link
                  href={getHelpUrl("soegning-baade-enkel-og-avanceret", "179")}
                  border={{
                    top: false,
                    bottom: {
                      keepVisible: true,
                    },
                  }}
                  target="_blank"
                >
                  {Translate({ context: "search", label: "helpAndGuidance" })}
                </Link>
              </Text>
            </Col>

            <Col md={4} sm={12} className={styles.helpLink}></Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

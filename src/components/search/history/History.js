import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

import styles from "./History.module.css";
import Translate from "@/components/base/translate";
import useSearchHistory from "@/components/hooks/useSearchHistory";
import { IconLink as LinkArrow } from "@/components/base/iconlink/IconLink";
import { useRouter } from "next/router";

// items limit
const LIMIT = 5;

// History-komponent
export function History({ items, router, clearValues }) {
  const showMore = items?.length > LIMIT;
  items = items?.slice(0, LIMIT);
  const sizes = { xs: 12, md: 10, lg: 11, xl: 9 };

  if (!items?.length) {
    return (
      <>
        <Row>
          <Col {...sizes} className={styles.itemsheader}>
            <Text type="text1">
              {Translate({
                context: "improved-search",
                label: "history-latest",
              })}
            </Text>
          </Col>
        </Row>
        <Row>
          <Col {...sizes}>
            <Text type="text3" tag="span">
              {Translate({
                context: "improved-search",
                label: "history-empty-message",
              })}
            </Text>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Row>
        <Col {...sizes} className={styles.itemsheader}>
          <Text type="text1">
            {Translate({ context: "improved-search", label: "history-latest" })}
          </Text>
          <div>
            <Link
              border={{ bottom: { keepVisible: true } }}
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              <Text type="text3" tag="span">
                {Translate({
                  context: "improved-search",
                  label: "clear-history",
                })}
              </Text>
            </Link>
          </div>
        </Col>
      </Row>
      {items?.map((value, index) => (
        <Row key={index}>
          <Col {...sizes}>
            <div className={styles.item}>
              <Link
                onClick={() => {
                  value?.goToItemUrl();
                }}
              >
                <Text tag="span" type="text2" lines={1} clamp={true}>
                  {value?.translations?.searchValue}
                </Text>
              </Link>

              <Text tag="span" type="text4">
                {value?.translations?.type}
              </Text>
            </div>
          </Col>
        </Row>
      ))}
      {showMore && (
        <LinkArrow
          iconPlacement="right"
          iconOrientation={180}
          border={{ bottom: { keepVisible: true }, top: false }}
          onClick={() => {
            router.push("/find/historik/seneste");
          }}
          className={styles.showmore}
        >
          <Text lines={1} tag="span">
            {Translate({
              context: "manifestation_content",
              label: "see_all",
            })}{" "}
          </Text>
        </LinkArrow>
      )}
    </>
  );
}

// Wrapper-komponent der håndterer navigation
export default function Wrap() {
  const router = useRouter();
  const { storedValue, clearValues } = useSearchHistory();

  return (
    <History items={storedValue} router={router} clearValues={clearValues} />
  );
}

import Text from "@/components/base/text";
import styles from "./FakeSearchInput.module.css";
import { openMobileSuggester } from "@/components/header/suggester/Suggester";
import Translate from "@/components/base/translate";
import ClearSvg from "@/public/icons/close.svg";
import { useRouter } from "next/router";
import Icon from "@/components/base/icon";
import useQ from "@/components/hooks/useQ";

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
export default function FakeSearchInput({ className, showButton = true }) {
  const router = useRouter();
  const { q, setQ } = useQ();
  const hasQuery = !!q?.all;
  const hasQueryClass = hasQuery ? styles.hasQuery : "";

  const qAll = q?.all;

  // Class for clear/cross button
  const clearVisibleClass = hasQuery ? styles.visible : "";

  return (
    <div
      className={`${styles.container} ${className} ${hasQueryClass}`}
      onClick={() => openMobileSuggester(router)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          openMobileSuggester(router);
        }
      }}
      tabIndex="0"
    >
      <div className={styles.fakeinput} data-cy="fake-search-input">
        <Text type="text2" className={styles.placeholder}>
          {hasQuery
            ? qAll
            : Translate({
                context: "suggester",
                label: "placeholder",
              })}
        </Text>
        <Text type="text2" className={styles.placeholderxs}>
          {hasQuery
            ? qAll
            : Translate({
                context: "suggester",
                label: "placeholderMobile",
              })}
        </Text>
        <span
          data-cy="fake-search-input-clear"
          className={`${styles.clear} ${clearVisibleClass}`}
          onClick={(e) => {
            e.stopPropagation();
            setQ({ ...q, all: "" });
          }}
        >
          <Icon size={{ w: "auto", h: 2 }} alt="">
            <ClearSvg />
          </Icon>
        </span>
      </div>
      {showButton && (
        <div className={styles.fakebutton} data-cy="fake-search-input-button">
          <Text type="text2">
            {Translate({
              context: "suggester",
              label: "search",
            })}
          </Text>
        </div>
      )}
    </div>
  );
}

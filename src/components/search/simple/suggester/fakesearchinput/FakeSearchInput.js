import Text from "@/components/base/text";
import styles from "./FakeSearchInput.module.css";
import {
  getPlaceholder,
  openMobileSuggester,
} from "@/components/search/simple/suggester/Suggester";
import Translate from "@/components/base/translate";
import ClearSvg from "@/public/icons/close.svg";
import { useRouter } from "next/router";
import Icon from "@/components/base/icon";
import useQ from "@/components/hooks/useQ";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { SuggestTypeEnum } from "@/lib/enums";
import useFilters from "@/components/hooks/useFilters";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {Object} props
 * @param {string} props.className
 *
 * @returns {React.JSX.Element}
 */
export default function FakeSearchInput({ className, showButton = true }) {
  const router = useRouter();
  const { q, setQ } = useQ();
  const filters = useFilters();

  const hasQuery = !!q?.all;
  const hasQueryClass = hasQuery ? styles.hasQuery : "";

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  const qAll = q?.all;

  // Class for clear/cross button
  const clearVisibleClass = hasQuery ? styles.visible : "";

  const { workTypes } = filters.getQuery();

  const selectedMaterial = workTypes[0] || SuggestTypeEnum.ALL;

  const placeholder = getPlaceholder(isMobileSize, selectedMaterial);

  return (
    <div
      className={`${styles.container} ${className} ${hasQueryClass}`}
      tabIndex="0"
    >
      <div
        className={styles.fakeinput}
        data-cy="fake-search-input"
        onClick={() => openMobileSuggester(router)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            openMobileSuggester(router);
          }
        }}
      >
        <Text type="text2" className={styles.placeholder}>
          {hasQuery ? qAll : placeholder}
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

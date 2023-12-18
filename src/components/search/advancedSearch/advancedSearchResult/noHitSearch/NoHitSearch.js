import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import styles from "./NoHitSearch.module.css";

export function NoHitSearch() {
  return (
    <div className={styles.no_hits}>
      <Text type="text1">
        {Translate({
          context: "advanced_search_result",
          label: "no_hits__title",
        })}
      </Text>
      <Text type="text2" className={styles.no_hits__description}>
        {Translate({
          context: "advanced_search_result",
          label: "no_hits__description",
        })}
        <ul>
          {[1, 2, 3, 4].map((item) => {
            return (
              <li key={item} className={styles.no_hits__list_item}>
                {Translate({
                  context: "advanced_search_result",
                  label: `no_hits__description__list_item_${item}`,
                })}
              </li>
            );
          })}
        </ul>
      </Text>
      <Text type="text2" className={styles.no_hits__help_text}>
        {Translate({
          context: "advanced_search_result",
          label: "no_hits__help_text",
        })}
        <Link
          target="_blank"
          border={{ bottom: { keepVisible: true } }}
          href={Translate({
            context: "advanced_search_result",
            label: "no_hits__help_link_url",
          })}
        >
          {Translate({
            context: "advanced_search_result",
            label: "no_hits__help_link_text",
          })}
        </Link>
      </Text>
    </div>
  );
}

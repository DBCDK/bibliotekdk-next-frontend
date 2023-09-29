/**
 * @file - component to show a message when there are no matches for search on libraries
 */
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";

export function NoAgenciesSearch({ className }) {
  return (
    <div className={className ? className : ""}>
      <Text type="text3">
        {Translate({
          context: "holdings",
          label: "text_no_localizations",
        })}
      </Text>
    </div>
  );
}

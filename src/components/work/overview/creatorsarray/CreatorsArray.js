import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { extractCreatorsPrioritiseCorporation } from "@/lib/utils";
import { getAdvancedUrl } from "@/components/search/advancedSearch/utils";

export function CreatorsArray({ creators: creatorsBeforeFilter, skeleton }) {
  const creators = extractCreatorsPrioritiseCorporation(creatorsBeforeFilter);

  // make an object for advanced search to handle
  const advancedSearchInput = (creator) => ({
    value: creator,
    prefixLogicalOperator: null,
    searchIndex: "term.function",
  });

  return (
    creators?.map((creator, index) => {
      const urlInput = advancedSearchInput(creator.display);
      const url = getAdvancedUrl({ inputField: urlInput });
      return (
        <span key={`${creator.display}-${index}`}>
          <Link
            disabled={skeleton}
            href={url}
            border={{ top: false, bottom: { keepVisible: true } }}
          >
            <Text type="text3" tag="span" skeleton={skeleton} lines={1}>
              {creator.display}
            </Text>
          </Link>
          {creators?.length > index + 1 ? ", " : ""}
        </span>
      );
    }) || null
  );
}

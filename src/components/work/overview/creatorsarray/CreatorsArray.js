import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { extractCreatorsPrioritiseCorporation } from "@/lib/utils";

export function CreatorsArray({ creators: creatorsBeforeFilter, skeleton }) {
  const searchOnUrl = "/find?q.creator=";
  const creators = extractCreatorsPrioritiseCorporation(creatorsBeforeFilter);

  return (
    creators?.map((creator, index) => {
      return (
        <span key={`${creator.display}-${index}`}>
          <Link
            disabled={skeleton}
            href={`${searchOnUrl}${creator.display}`}
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

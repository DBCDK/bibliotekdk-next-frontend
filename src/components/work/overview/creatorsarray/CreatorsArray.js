import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { Fragment } from "react";

export function CreatorsArray({ creators, skeleton }) {
  const searchOnUrl = "/find?q.creator=";

  if (creators?.length < 1) {
    return null;
  }
  return (
    <Text type="text3" skeleton={skeleton} lines={1}>
      {creators?.map((creator, index) => {
        return (
          <Fragment key={`${creator.display}-${index}`}>
            <Link
              disabled={skeleton}
              href={`${searchOnUrl}${creator.display}`}
              border={{ top: false, bottom: { keepVisible: true } }}
            >
              {creator.display}
            </Link>
            {creators?.length > index + 1 ? ", " : ""}
          </Fragment>
        );
      })}
    </Text>
  );
}

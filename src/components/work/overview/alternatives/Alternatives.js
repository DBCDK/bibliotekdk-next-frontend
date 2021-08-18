import { useRouter } from "next/router";

import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";

export default function AlternativeOptions() {
  const router = useRouter();
  const context = { context: "alternative-options" };

  return (
    <Link
      border={{ bottom: { keepVisible: true } }}
      onClick={() => {
        if (router) {
          router.push({
            pathname: router.pathname,
            query: { ...router.query, modal: "options" },
          });
        }
      }}
    >
      <Text>Andre bestillingsmuligheder (2)</Text>
    </Link>
  );
}

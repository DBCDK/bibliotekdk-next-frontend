import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";
import { cyKey } from "@/utils/trim";

export function MoreOptionsLink({ onSearchClick, className = "", children }) {
  return (
    <Text
      type="text3"
      tag="span"
      className={className}
      dataCy={cyKey({ name: children, prefix: "text" })}
    >
      <Link
        onClick={() => onSearchClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onSearchClick();
          }
        }}
        border={{ bottom: { keepVisible: true } }}
      >
        {children}
      </Link>
    </Text>
  );
}

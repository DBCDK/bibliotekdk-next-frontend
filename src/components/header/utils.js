import Link from "@/components/base/link";
import Text from "@/components/base/text/Text";

export function MoreOptionsLink({ onSearchClick, className = "", children }) {
  return (
    <span className={className}>
      <Link
        onClick={() => onSearchClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onSearchClick();
          }
        }}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text3" tag="span">
          {children}
        </Text>
      </Link>
    </span>
  );
}

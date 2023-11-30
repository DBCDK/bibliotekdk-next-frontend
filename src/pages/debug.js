/**
 * @file A page for setting up debug settings
 */

import Checkbox from "@/components/base/forms/checkbox";
import Section from "@/components/base/section";
import Text from "@/components/base/text";

import useTestUser from "@/components/hooks/useTestUser";
import Header from "@/components/header/Header";

export default function Debug() {
  const { enabled, setEnabled } = useTestUser();

  return (
    <>
      <Header />
      <Section
        space={{ top: 100, bottom: 100 }}
        title="Debug indstillinger"
        divider={false}
      >
        <Text type="text3" tag="label">
          Aktiver testbrugere{" "}
          <Checkbox
            checked={enabled}
            onChange={(checked) => {
              setEnabled(checked);
            }}
          />
        </Text>
      </Section>
    </>
  );
}

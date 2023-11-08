/**
 * @file A page for setting up debug settings
 */
import { useEffect, useState } from "react";

import Checkbox from "@/components/base/forms/checkbox";
import Section from "@/components/base/section";
import Text from "@/components/base/text";

import {
  enableFbiApiTestUsers,
  fbiApiTestUsersEnabled,
} from "@dbcdk/login-nextjs/client";

export default function Debug() {
  const [testUserEnabled, setTestUsersEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTestUsersEnabled(fbiApiTestUsersEnabled());
    setReady(true);
  }, []);

  return (
    <Section
      space={{ top: 100, bottom: 100 }}
      title="Debug indstillinger"
      divider={false}
    >
      <Text type="text3" tag="label">
        Aktiver testbrugere{" "}
        <Checkbox
          checked={testUserEnabled}
          onChange={(checked) => {
            if (!ready) {
              return;
            }
            setTestUsersEnabled(checked);
            enableFbiApiTestUsers(checked);
          }}
        />
      </Text>
    </Section>
  );
}

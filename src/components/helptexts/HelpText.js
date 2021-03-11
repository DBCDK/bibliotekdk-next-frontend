import { useData } from "@/lib/api/api";
import { publishedHelptexts, helpText } from "@/lib/api/helptexts.fragments.js";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

export function getPublishedHelpTexts() {
  const { isLoading, data } = useData(publishedHelptexts());
  return { isLoading, data };
}

export function HelpText({ helptext }) {
  if (helptext.title && helptext.body) {
    return (
      <React.Fragment>
        <Title type="title4">{helptext.title}</Title>
        <Text type="text2" lines={30}>
          <span dangerouslySetInnerHTML={{ __html: helptext.body.value }} />
        </Text>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

function helpTextById(allHelpTexts, helpTxtId) {
  return allHelpTexts.find(({ nid }) => parseInt(helpTxtId, "10") === nid);
}

export default function Wrapper({ helpTextID }) {
  console.log(helpTextID, "INTITAL");

  const { isLoading, data } = helpText(helpTextID);
  console.log(data, "DATA");
  if (!data) {
    // @TODO skeleton
    return null;
  }

  console.log(data, "DATA");

  const allHelpTexts = data.nodeQuery.entities;
  const aHelpText = helpTextById(allHelpTexts, helpTextID);

  return <HelpText helptext={aHelpText} />;
}

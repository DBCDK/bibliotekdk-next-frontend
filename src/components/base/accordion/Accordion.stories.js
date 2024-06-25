import { StoryTitle, StoryDescription } from "@/storybook";

import Accordion, { Item } from "./Accordion";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Cover from "@/components/base/cover";

const exportedObject = {
  title: "Base/Accordion",
};

export default exportedObject;

/**
 * Accordion - "collapsible table"
 *
 */

export function Default() {
  const data = [
    {
      title: "Har mit bibliotek bogen???",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Pellentesque placerat facilisis commodo. Aenean ligula metus, sodales et augue eget, porttitor gravida arcu.",
    },
    {
      title:
        "Hvorfor ser jeg et mindre antal poster end det, der står i antal hits?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
    },
    {
      title: "Hvordan søger jeg specifikt på fx. mp3-lydbøger?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
    },
    {
      title: "Hvordan ser jeg de nyeste resultater først?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
    },
    {
      title: "Hvordan fornyer jeg et lån?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
    },
  ];

  return (
    <div>
      <StoryTitle>Accordion</StoryTitle>
      <StoryDescription>
        Sections can be expanded to show more information. Typically used for
        FAQ on websites.
      </StoryDescription>
      <div style={{ maxWidth: "1000px" }}>
        <Accordion data={data} />
      </div>
    </div>
  );
}

export function PreExpanded() {
  const data = [
    {
      title: "Har mit bibliotek bogen?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Pellentesque placerat facilisis commodo. Aenean ligula metus, sodales et augue eget, porttitor gravida arcu.",
    },
    {
      title:
        "Hvorfor ser jeg et mindre antal poster end det, der står i antal hits?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor.",
    },
    {
      title: "Hvordan søger jeg specifikt på fx. mp3-lydbøger?",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem.",
    },
  ];

  return (
    <div>
      <StoryTitle>Pre-expanded</StoryTitle>
      <StoryDescription>
        {`A section can be mounted open as default by using the \"defaultActiveKey\"
        prop and set the key for the section you want to pre-open (e.g.
        defaultActiveKey=\"1\")`}
      </StoryDescription>
      <div style={{ maxWidth: "1000px" }}>
        <Accordion data={data} defaultActiveKey="1" />
      </div>
    </div>
  );
}

export function CustomContent() {
  const data = [
    {
      title: "Text as string",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac malesuada tortor. Curabitur quis diam sapien. Sed vel massa metus. Suspendisse feugiat scelerisque commodo. Sed scelerisque pharetra nisi vel sagittis. Ut id pellentesque sem. Pellentesque placerat facilisis commodo. Aenean ligula metus, sodales et augue eget, porttitor gravida arcu.",
    },
    {
      title: "Text and link as components",
      content: (
        <div style={{ padding: "16px" }}>
          <Text type="text1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            placerat sodales risus ac suscipit. Integer aliquam lacus enim, sit
            amet pharetra diam tempor eu. Etiam vel augue eros. Donec ac
            malesuada tortor. Curabitur quis diam sapien.
          </Text>
          <Link>link</Link>
        </div>
      ),
    },
    {
      title: "Cover image component",
      content: (
        <div style={{ padding: "16px" }}>
          <Cover
            src="https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=25775481&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=f36e2a71599c57976cb4"
            size="thumbnail"
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <StoryTitle>Custom Content</StoryTitle>
      <StoryDescription>
        Custom content can be passed to the Accordion component. Import the Item
        component from the Accordion and pass strings or components as children.
      </StoryDescription>
      <div style={{ maxWidth: "1000px" }}>
        <Accordion>
          {data.map((d, i) => (
            <Item
              title={d.title}
              key={`${d.title}_${i}`}
              eventKey={i.toString()}
            >
              {d.content}
            </Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

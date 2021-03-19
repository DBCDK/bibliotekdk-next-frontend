import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";
import { publishedHelptexts } from "@/lib/api/helptexts.fragments";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

import { helpTextParseMenu } from "../utils.js";
import { encodeString } from "@/lib/utils";

import styles from "./Sections.module.css";

/**
 * The Sections page React component
 *
 * @param {obj} props
 * @param {obj} props.className
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Sections({ className, data, skeleton }) {
  // Parse helptexts
  const menus = helpTextParseMenu(data);

  return (
    <div>
      <Section
        className={`${styles.sections} ${className}`}
        title={<Icon size={{ w: 6, h: "auto" }} src={"ornament1.svg"} />}
        titleDivider={false}
        contentDivider={false}
      >
        <Title type="title3">
          {Translate({ context: "help", label: "all-pages" })}
        </Title>
      </Section>

      {Object.keys(menus).map((s, i) => {
        const links = menus[s];

        return (
          <Section
            className={`${className} ${styles.section}`}
            title={
              <Title type="title4" skeleton={skeleton}>
                {s}
              </Title>
            }
            key={`${s}_${i}`}
          >
            {links.map((l, i) => {
              return (
                <div className={styles.links} key={`${l.title}_${i}`}>
                  <Link
                    href={`/hjaelp/${encodeString(l.title)}/${l.id}`}
                    border={{ bottom: !skeleton }}
                  >
                    <Text type="text1" skeleton={skeleton} lines={3}>
                      {l.title}
                    </Text>
                  </Link>
                </div>
              );
            })}
          </Section>
        );
      })}
    </div>
  );
}

Sections.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export function SectionsSkeleton(props) {
  const data = [
    {
      nid: 1,
      title: "Some dummy text title 1",
      fieldHelpTextGroup: "Group 1",
    },
    {
      nid: 2,
      title: "Some dummy text title 2",
      fieldHelpTextGroup: "Group 2",
    },
    {
      nid: 3,
      title: "Some dummy text title 7",
      fieldHelpTextGroup: "Group 3",
    },
    {
      nid: 4,
      title: "Some dummy text title 4",
      fieldHelpTextGroup: "Group 4",
    },
  ];

  return (
    <Sections
      {...props}
      data={data}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

export default function Wrap(props) {
  // real data goes here ...
  const { isLoading, data } = useData(publishedHelptexts());

  if (!data || !data.nodeQuery || !data.nodeQuery.entities || data.error) {
    // @TODO skeleton
    return <SectionsSkeleton {...props} />;
  }

  const allHelpTexts = data.nodeQuery.entities;

  return <Sections {...props} data={allHelpTexts} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

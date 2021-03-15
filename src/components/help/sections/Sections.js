import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Title from "@/components/base/title";
import Text from "@/components/base/text";

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
export function Sections({ className, data }) {
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

      {data.map((s, i) => {
        return (
          <Section
            className={`${className} ${styles.section}`}
            title={s.title}
            key={`${s.title}_${i}`}
          >
            {s.links.map((l, i) => {
              return (
                <div className={styles.links} key={`${l.title}_${i}`}>
                  <Link href={l.href}>
                    <Text type="text1">{l.title}</Text>
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

export default function Wrap(props) {
  // real data goes here ...

  // temp. dummy
  const data = [
    {
      title: "Some title 1",
      links: [
        { title: "Some page 1", href: "/hjaelp" },
        { title: "Some page 2", href: "/hjaelp" },
        { title: "Some page 3", href: "/hjaelp" },
        { title: "Some page 4", href: "/hjaelp" },
      ],
    },
    {
      title: "Some title 2",
      links: [
        { title: "Some page 1", href: "/hjaelp" },
        { title: "Some page 2", href: "/hjaelp" },
        { title: "Some page 3", href: "/hjaelp" },
        { title: "Some page 4", href: "/hjaelp" },
      ],
    },
    {
      title: "Some title 3",
      links: [
        { title: "Some page 1", href: "/hjaelp" },
        { title: "Some page 2", href: "/hjaelp" },
        { title: "Some page 3", href: "/hjaelp" },
        { title: "Some page 4", href: "/hjaelp" },
      ],
    },
    {
      title: "Some title 4",
      links: [
        { title: "Some page 1", href: "/hjaelp" },
        { title: "Some page 2", href: "/hjaelp" },
        { title: "Some page 3", href: "/hjaelp" },
        { title: "Some page 4", href: "/hjaelp" },
      ],
    },
  ];

  return <Sections {...props} data={data} />;
}

Wrap.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
};

import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import merge from "lodash/merge";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Button from "@/components/base/button";
import Cover from "@/components/base/cover";
import Tag from "@/components/base/forms/tag";
import Bookmark from "@/components/base/bookmark";
import Breadcrumbs from "@/components/base/breadcrumbs";
import Translate from "@/components/base/translate";

import styles from "./Overview.module.css";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Overview({
  title = "...",
  creators = [{ name: "..." }],
  path = [],
  materialTypes = [],
  type,
  onTypeChange = () => {},
  className = "",
  skeleton = false,
}) {
  // Translate Context
  const context = { context: "overview" };

  // Save copy of all materialTypes (Temporary)
  const allMaterialTypes = materialTypes;

  // Creates MaterialTypes as an index
  const materialTypesMap = {};
  materialTypes.forEach((m) => {
    materialTypesMap[m.materialType] = m;
  });

  // Either use type from props, or from local state
  const selectedMaterial = materialTypesMap[type] || materialTypes[0] || false;

  // Handle slectedMaterial
  function handleSelectedMaterial(material) {
    // Update query param callback
    if (type !== material.materialType) {
      onTypeChange({ type: material.materialType });
    }
  }

  return (
    <div className={`${styles.background} ${className}`}>
      <Container>
        <Row className={`${styles.overview}`}>
          <Col xs={12} lg={3} className={styles.breadcrumbs}>
            <Breadcrumbs path={path} skeleton={skeleton} crumbs={4} />
          </Col>

          <Col
            xs={12}
            md={{ span: 4, order: 3 }}
            lg={3}
            className={styles.cover}
          >
            <Cover
              src={
                (selectedMaterial.cover && selectedMaterial.cover.detail) ||
                allMaterialTypes
              }
              skeleton={!selectedMaterial.cover}
              size={["200px", "300px"]}
            >
              <Bookmark skeleton={skeleton} title={title} />
            </Cover>
          </Col>

          <Col xs={12} md={{ order: 2 }} className={`${styles.about}`}>
            <Row>
              <Col xs={12}>
                <Title type="title3" skeleton={skeleton}>
                  {title}
                </Title>
              </Col>
              <Col xs={12} className={styles.ornament}>
                <Icon
                  size={{ w: 7, h: "auto" }}
                  src={"ornament1.svg"}
                  skeleton={skeleton}
                />
              </Col>
              <Col xs={12}>
                <Text
                  type="text3"
                  className={styles.creators}
                  skeleton={skeleton}
                  lines={1}
                >
                  {creators.map((c, i) =>
                    creators.length > i + 1 ? c.name + ", " : c.name
                  )}
                </Text>
              </Col>

              <Col xs={12} className={styles.materials}>
                {materialTypes.map((material) => {
                  //  Sets isSelected flag if button should be selected
                  const isSelected = material.pid === selectedMaterial.pid;

                  return (
                    <Tag
                      key={material.materialType}
                      selected={isSelected}
                      onClick={() => handleSelectedMaterial(material)}
                      skeleton={skeleton}
                    >
                      {material.materialType}
                    </Tag>
                  );
                })}
              </Col>
              <Col xs={12} sm={9} xl={7} className={styles.basket}>
                <Button skeleton={skeleton}>
                  {Translate({ ...context, label: "addToCart" })}
                </Button>
              </Col>
              <Col xs={12} className={styles.info}>
                <Text type="text3" skeleton={skeleton} lines={2}>
                  {Translate({ ...context, label: "addToCart-line1" })}
                </Text>
                <Text type="text3" skeleton={skeleton} lines={0}>
                  {Translate({ ...context, label: "addToCart-line2" })}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

/**
 * Skeleton/Loading version of component
 *
 * @param {Object} props Component props
 * @param {boolean} props.isSlow Is it unexpectingly slow to load?
 */
export function OverviewSkeleton(props) {
  // Default materialTypes (For skeleton use)
  const defaultTypes = [
    {
      materialType: "Bog",
      cover: {
        detail: null,
      },
    },
    {
      materialType: "Ebog",
      cover: {
        detail: null,
      },
    },
    {
      materialType: "Lydbog (net)",
      cover: {
        detail: null,
      },
    },
  ];

  return (
    <div>
      <Overview
        {...props}
        materialTypes={defaultTypes}
        className={styles.skeleton}
        skeleton={true}
      />
    </div>
  );
}

/**
 * Returns error
 */
export function OverviewError() {
  return (
    <div>
      <h1>Der skete en fejl</h1>
    </div>
  );
}

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap({ workId, type, onTypeChange }) {
  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.basic({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  if (isLoading) {
    return <OverviewSkeleton isSlow={isSlow} />;
  }
  if (error) {
    return <OverviewError />;
  }

  const merged = merge({}, covers.data, data);

  return <Overview {...merged.work} type={type} onTypeChange={onTypeChange} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
};

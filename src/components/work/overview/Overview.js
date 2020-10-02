/**
 * @file
 * This is an example component showing
 * how to fetch data from the API
 *
 * Should be removed when we have real components
 * doing the same thing
 */

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Title from "../../base/title";
import Text from "../../base/text";
import Icon from "../../base/icon";
import Button from "../../base/button";
import Cover from "../../base/cover";
import Tag from "../../base/forms/tag";
import Bookmark from "../../base/bookmark";
import Breadcrumbs from "../../base/breadcrumbs";

import dummy_workDataApi from "../dummy.workDataApi.js";

import styles from "./Overview.module.css";

/**
 * Example component, showing basic info
 *
 * @param {Object} props Component props
 * @param {string} props.title Material title
 * @param {string} props.abstract Material abstract
 */
export function Overview({
  title = "...",
  creators = ["..."],
  path = [],
  materialTypes = [],
  className = "",
  skeleton = false,
}) {
  // Save copy of all materialTypes (Temporary)
  const allMaterialTypes = materialTypes;
  //  Temporary accepted materialTypes
  const acceptedTypes = ["Bog", "Ebog", "Lydbog (net)"];
  // Temporary filter materials
  // outcomment this func. to see all available materialTypes
  materialTypes = materialTypes.filter((type) =>
    acceptedTypes.includes(type.materialType)
  );

  // Creates MaterialTypes as an index
  const materialTypesMap = {};
  materialTypes.forEach((m) => {
    materialTypesMap[materialTypes] = m;
  });

  // Router
  const router = useRouter();

  // Set selected material - default as the first material in the materialTypes array
  const [selectedMaterial, setSelectedMaterial] = useState(
    materialTypesMap[router && router.query.type] || materialTypes[0] || false
  );

  // Only when component mounts
  useEffect(() => {
    if (selectedMaterial) {
      handleSelectedMaterial(selectedMaterial);
    }
  }, []);

  // Handle slectedMaterial
  function handleSelectedMaterial(material) {
    // Sets SelectedMaterial in state
    setSelectedMaterial(material);

    if (router) {
      // Push material type param to url
      const query = { type: material.materialType };
      router.push(
        { pathname: router.pathname, query },
        {
          pathname: router.asPath.replace(/\?.*/, ""),
          query,
        }
      );
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
              src={selectedMaterial.cover.detail || allMaterialTypes}
              skeleton={skeleton}
            >
              <Bookmark skeleton={skeleton} />
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
                <Icon size={6} src={"ornament1.svg"} skeleton={skeleton} />
              </Col>
              <Col xs={12}>
                <Text
                  type="text3"
                  className={styles.creators}
                  skeleton={skeleton}
                  lines={1}
                >
                  {creators.map((c, i) =>
                    creators.length > i + 1 ? c + ", " : c
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
                <Button skeleton={skeleton}>Læg i lånekurv</Button>
              </Col>
              <Col xs={12} className={styles.info}>
                <Text type="text3" skeleton={skeleton} lines={2}>
                  Fysiske materialer leveres til dit lokale bibliotek
                </Text>
                <Text type="text3" skeleton={skeleton} lines={0}>
                  Digitale materialer bliver du sendt videre til
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
 * Example skeleton component
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
 * Example error component
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
 * data and displaying the right variant of the Example component
 *
 * @param {Object} props Component props
 * @param {string} props.workId Material work id
 */
function Wrap({ workId, skeleton }) {
  const isLoading = skeleton;
  const isSlow = false;
  const error = false;
  const data = dummy_workDataApi({ workId });

  if (isLoading) {
    return <OverviewSkeleton isSlow={isSlow} />;
  }
  if (error) {
    return <OverviewError />;
  }

  return <Overview {...data.work} />;
}

// Export wrap as the default
export default Wrap;

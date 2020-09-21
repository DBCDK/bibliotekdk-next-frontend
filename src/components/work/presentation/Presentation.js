/**
 * @file
 * This is an example component showing
 * how to fetch data from the API
 *
 * Should be removed when we have real components
 * doing the same thing
 */

import { useState } from "react";
import Grid from "@material-ui/core/Grid";

import Title from "../../base/title";
import Text from "../../base/text";
import Icon from "../../base/icon";
import Button from "../../base/button";
import Cover from "../../base/cover";
import Tag from "../../base/forms/tag";
import Bookmark from "../../base/bookmark";
import Breadcrumbs from "../../base/breadcrumbs";

import { useData } from "../../../lib/api";

import styles from "./Presentation.module.css";

/**
 * This function will create a query object
 *
 * @param {Object} variables
 * @param {string} variables.workId
 *
 * @return {Object} a query object
 */
function query({ workId }) {
  return {
    // delay: 1000, // for debugging
    query: `query ($workId: String!) {
    manifestation(pid: $workId) {
      title
      abstract
    }
  }
  `,
    variables: { workId },
    slowThreshold: 3000,
  };
}

/**
 * Example component, showing basic info
 *
 * @param {Object} props Component props
 * @param {string} props.title Material title
 * @param {string} props.abstract Material abstract
 */
export function Presentation({
  title = "Doppler",
  creators = ["Erlend Loe"],
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

  // Set selected material - default as the first material in the materialTypes array
  const [selectedMaterial, setSelectedMaterial] = useState(
    materialTypes[0] || false
  );

  return (
    <div className={`${styles.background} ${className}`}>
      <Grid container className={`container gutter ${styles.presentation}`}>
        <Grid item xs={12} md={3} className={styles.breadcrumbs}>
          <Breadcrumbs path={path} skeleton={skeleton} />
        </Grid>
        <Grid container item xs={12} md direction="row-reverse">
          <Grid item xs={12} sm={4} className={styles.cover}>
            <Cover
              src={
                (selectedMaterial && selectedMaterial.cover.detail) ||
                allMaterialTypes
              }
              skeleton={skeleton}
            >
              <Bookmark skeleton={skeleton} />
            </Cover>
          </Grid>
          <Grid item xs={12} sm>
            <Title type="title3" skeleton={skeleton}>
              {title}
            </Title>

            <Icon
              size={6}
              src={"ornament1.svg"}
              className={styles.ornament}
              skeleton={skeleton}
            />

            <Text type="text3" className={styles.creators} skeleton={skeleton}>
              {creators.map((c, i) => (creators.length > i + 1 ? c + ", " : c))}
            </Text>

            <Grid className={styles.actions}>
              <Grid item xs={12} className={styles.materials}>
                {materialTypes.map((material) => {
                  //  Sets isSelected flag if button should be selected
                  const isSelected = material.pid === selectedMaterial.pid;

                  return (
                    <Tag
                      key={material.materialType}
                      selected={isSelected}
                      onClick={() => setSelectedMaterial(material)}
                      skeleton={skeleton}
                    >
                      {material.materialType}
                    </Tag>
                  );
                })}
              </Grid>
              <Grid className={styles.basket} item xs={12} sm={9} md={8} la={5}>
                <Button skeleton={skeleton}>Læg i lånekurv</Button>
              </Grid>
              <Grid className={styles.info} item xs={12}>
                <Text type="text3" skeleton={skeleton} lines={2}>
                  Fysiske materialer leveres til dit lokale bibliotek
                </Text>
                <Text type="text3" skeleton={skeleton} lines={0}>
                  Digitale materialer bliver du sendt videre til
                </Text>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

/**
 * Example skeleton component
 *
 * @param {Object} props Component props
 * @param {boolean} props.isSlow Is it unexpectingly slow to load?
 */
export function PresentationSkeleton(props) {
  return (
    <div>
      <Presentation {...props} className={styles.skeleton} skeleton={true} />
    </div>
  );
}

/**
 * Example error component
 */
export function PresentationError() {
  return (
    <div>
      <h1>Der skete en fejl</h1>
    </div>
  );
}

/**
 * Container is a react component responsible for loading
 * data and displaying the right variant of the Example component
 *
 * @param {Object} props Component props
 * @param {string} props.workId Material work id
 */
function Container({ workId, skeleton }) {
  // use the useData hook to fetch data
  // const { data, isLoading, isSlow, error } = useData(query({ workId }));

  const isLoading = skeleton;
  const isSlow = false;
  const error = false;
  const data = {
    work: {
      path: ["Bøger", "Fiktion", "skønlitteratur", "roman"],
      title: "Klodernes kamp",
      creators: ["h g wells"],
      materialTypes: [
        {
          materialType: "Bog",
          pid: "870970-basis:06442870",
          cover: {
            detail: null,
          },
        },
        {
          materialType: "Bog stor skrift",
          pid: "870970-basis:54926391",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54926391&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7966902ee80cd277d0e8",
          },
        },
        {
          materialType: "Ebog",
          pid: "870970-basis:52849985",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=52849985&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=7e911def9923337c6605",
          },
        },
        {
          materialType: "Lydbog (bånd)",
          pid: "870970-basis:04843819",
          cover: {
            detail: null,
          },
        },
        {
          materialType: "Lydbog (cd-mp3)",
          pid: "870970-basis:54687117",
          cover: {
            detail: null,
          },
        },
        {
          materialType: "Lydbog (net)",
          pid: "870970-basis:54627890",
          cover: {
            detail:
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=54627890&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=2a9e3e64e43b94aafe62",
          },
        },
        {
          materialType: "Punktskrift",
          pid: "874310-katalog:DBB0106054",
          cover: {
            detail: null,
          },
        },
      ],
    },
  };

  if (isLoading) {
    return <PresentationSkeleton isSlow={isSlow} />;
  }
  if (error) {
    return <PresentationError />;
  }

  return <Presentation {...data.work} />;
}

// Attach query to container to expose the query to some page
Container.query = query;

// Export container as the default
export default Container;

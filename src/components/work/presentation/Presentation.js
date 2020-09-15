/**
 * @file
 * This is an example component showing
 * how to fetch data from the API
 *
 * Should be removed when we have real components
 * doing the same thing
 */

import { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";

import Title from "../../base/title";
import Text from "../../base/text";
import Icon from "../../base/icon";
import Button from "../../base/button";
import Cover from "../../base/cover";

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
export function Presentation({ title, creators, path, materialTypes }) {
  //  Temporary accepted materialTypes
  const acceptedTypes = ["Bog", "Ebog", "Lydbog (net)"];
  // Temporary filter materials
  materialTypes = materialTypes.filter((type) =>
    acceptedTypes.includes(type.materialType)
  );

  // Set selected material - default as the first material in the materialTypes array
  const [selectedMaterial, setSelectedMaterial] = useState(materialTypes[0]);

  useEffect(() => {
    // setMaterial(material), 4500);
  }, [selectedMaterial]);

  return (
    <Grid container className={styles.presentation}>
      <Grid item xs={12} sm={3} className={styles.breadcrumbs}>
        <Text type="text3">
          {path.map((c, i) => (path.length > i + 1 ? c + " / " : c))}
        </Text>
      </Grid>
      <Grid container item xs={12} sm direction="row-reverse">
        <Grid item xs={12} sm={3}>
          <Cover src={selectedMaterial.cover.detail} />
        </Grid>
        <Grid item xs={12} sm>
          <Title type="title3">{title}</Title>
          <Icon size={6} src={"ornament1.svg"} className={styles.ornament} />
          <Text type="text3" className={styles.creators}>
            {creators.map((c, i) => (creators.length > i + 1 ? c + ", " : c))}
          </Text>
          <Grid container className={styles.actions}>
            <Grid item xs={12} className={styles.materials}>
              {materialTypes.map((material) => {
                console.log(selectedMaterial.pid + " - " + material.pid);

                // Adds an active class if its the selectedMaterial
                const isActive = material.pid === selectedMaterial.pid;

                const activeClass = isActive ? styles.activeMaterial : "";

                return (
                  <Button
                    key={material.materialType}
                    className={activeClass}
                    type="outlined"
                    size="small"
                    onClick={() => setSelectedMaterial(material)}
                  >
                    <Icon
                      size={3}
                      bgColor="var(--blue)"
                      src={"checkmark.svg"}
                    />

                    {material.materialType}
                  </Button>
                );
              })}
            </Grid>
            <Grid className={styles.basket} item xs={12}>
              <Button size="large">Læg i lånekurv</Button>
            </Grid>
            <Grid className={styles.info} item xs={12}>
              <Text type="text3">
                Fysiske materialer leveres til dit lokale bibliotek
              </Text>
              <Text type="text3">
                Digitale materialer bliver du sendt videre til
              </Text>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/**
 * Example skeleton component
 *
 * @param {Object} props Component props
 * @param {boolean} props.isSlow Is it unexpectingly slow to load?
 */
export function PresentationSkeleton({ isSlow }) {
  return (
    <div>
      <h1>{isSlow ? "Indlæser - gaaaab" : "Indlæser"}</h1>
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
function Container({ workId }) {
  // use the useData hook to fetch data
  // const { data, isLoading, isSlow, error } = useData(query({ workId }));

  const isLoading = false;
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

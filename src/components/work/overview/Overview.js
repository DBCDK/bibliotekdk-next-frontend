import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import Icon from "@/components/base/icon";
import AlternativeOptions from "./alternatives";
import LocalizationsLink from "./localizationslink";
import WorkGroupingsOverview from "./workgroupingsoverview";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import ReservationButtonWrapper from "@/components/work/reservationbutton/ReservationButton";
import styles from "./Overview.module.css";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { useEffect, useMemo } from "react";
import { MaterialTypeSwitcher } from "@/components/work/overview/materialtypeswitcher/MaterialTypeSwitcher";
import { CreatorsArray } from "@/components/work/overview/creatorsarray/CreatorsArray";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import CoverCarousel from "@/components/work/overview/covercarousel/CoverCarousel";
import {
  RenderLanguageAddition,
  RenderTitlesWithoutLanguage,
} from "@/components/work/overview/titlerenderer/TitleRenderer";
import Title from "@/components/base/title/Title";
import { useRouter } from "next/router";
import Breadcrumbs from "@/components/work/overview/breadcrumbs/Breadcrumbs";
import BookmarkDropdown from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";
import isEmpty from "lodash/isEmpty";

function useInitMaterialType(
  uniqueMaterialTypes,
  inUniqueMaterialTypes,
  type,
  onTypeChange,
  workId,
  router
) {
  useEffect(() => {
    if (
      uniqueMaterialTypes &&
      uniqueMaterialTypes?.[0] !== type &&
      (isEmpty(type) || !inUniqueMaterialTypes(type))
    ) {
      onTypeChange({
        type: uniqueMaterialTypes?.[0],
      });
    }
  }, [workId, router.query]);
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function Overview({
  work,
  workId,
  type = [],
  onTypeChange = () => {},
  className = "",
  skeleton = false,
}) {
  const manifestations = work?.manifestations?.mostRelevant;
  const router = useRouter();

  const { uniqueMaterialTypes, inUniqueMaterialTypes, flatPidsByType } =
    useMemo(() => {
      return manifestationMaterialTypeFactory(manifestations);
    }, [work, manifestations]);

  useInitMaterialType(
    uniqueMaterialTypes,
    inUniqueMaterialTypes,
    type,
    onTypeChange,
    workId,
    router
  );

  // OBS: We load allPids for CoverCarousel, to ensure smooth change of MaterialType
  const allPids = useMemo(
    () => manifestations?.map((manifestation) => manifestation?.pid),
    [manifestations]
  );
  const selectedPids = useMemo(() => flatPidsByType(type), [type]);

  return (
    <section className={`${styles.background} ${className}`}>
      <Container fluid>
        <Row className={`${styles.overview}`}>
          {/* Breadcrumbs */}
          <Col xs={12} xl={3} className={styles.breadcrumbs}>
            <Breadcrumbs workId={workId} />
          </Col>

          {/* Cover and MaterialInformation */}
          <Col xs={12} xl={9} className={styles.cover_and_materialInformation}>
            {/* Cover */}
            <Col xs={{ order: 1 }} md={{ order: 2 }} className={styles.cover}>
              <CoverCarousel
                allPids={allPids}
                selectedPids={selectedPids}
                workTitles={work?.titles}
              />
            </Col>

            {/* MaterialInformation */}
            <Col
              xs={{ order: 2 }}
              md={{ order: 1 }}
              className={`${styles.about}`}
            >
              <Col xs={12}>
                <Title
                  tag="h1"
                  type="title3"
                  skeleton={skeleton}
                  dataCy="title-overview"
                >
                  <RenderTitlesWithoutLanguage
                    work={work}
                    subtitleType="title5"
                    className={styles.subtitle}
                  />
                  <RenderLanguageAddition work={work} />
                </Title>
              </Col>
              <Col xs={12}>
                <WorkGroupingsOverview workId={workId} />
              </Col>
              <Col xs={12} className={styles.ornament}>
                <Icon
                  size={{ w: 7, h: "auto" }}
                  src={"ornament1.svg"}
                  skeleton={skeleton}
                  alt=""
                />
              </Col>
              <Col xs={12}>
                <CreatorsArray creators={work?.creators} />
              </Col>
              <Col xs={12} className={styles.materials}>
                <MaterialTypeSwitcher
                  uniqueMaterialTypes={uniqueMaterialTypes}
                  skeleton={skeleton}
                  onTypeChange={onTypeChange}
                  type={type}
                />
              </Col>
              <Col xs={12} sm={9} xl={7} className={styles.basket}>
                <ReservationButtonWrapper
                  workId={workId}
                  selectedPids={selectedPids}
                />
                <BookmarkDropdown
                  materialId={workId}
                  workId={workId}
                  materialTypes={uniqueMaterialTypes}
                  title={work?.titles?.sort}
                  className={styles.svgscale}
                  editions={work?.manifestations?.mostRelevant}
                />
              </Col>

              <OrderButtonTextBelow
                selectedPids={selectedPids}
                skeleton={skeleton}
              />
              <AlternativeOptions workId={workId} selectedPids={selectedPids} />
              {type?.[0] !== "tidsskrift" && (
                <Col xs={12} className={styles.info}>
                  <LocalizationsLink selectedPids={selectedPids} />
                </Col>
              )}
            </Col>
          </Col>
        </Row>
      </Container>
    </section>
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
      cover: { detail: null },
    },
    {
      materialType: "E-bog",
      cover: { detail: null },
    },
    {
      materialType: "Lydbog (net)",
      cover: { detail: null },
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
 * @param {string} workId Component props
 * @param {string} type
 * @param {function} onTypeChange
 * @param login
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ workId, type, onTypeChange, login }) {
  const fbiWork = useData(workFragments.overviewWork({ workId }));

  if (fbiWork.isLoading) {
    return <OverviewSkeleton isSlow={fbiWork.isSlow} />;
  }

  if (fbiWork.error) {
    return <OverviewError />;
  }

  return (
    <Overview
      work={fbiWork.data.work}
      workId={workId}
      type={type}
      onTypeChange={onTypeChange}
      login={login}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  user: PropTypes.object,
  login: PropTypes.func,
};

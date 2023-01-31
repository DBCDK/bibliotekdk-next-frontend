import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Cover from "@/components/base/cover";
import Bookmark from "@/components/base/bookmark";
import AlternativeOptions from "./alternatives";
import LocalizationsLink from "./localizationslink";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";
import useUser from "@/components/hooks/useUser";
import styles from "./Overview.module.css";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { useEffect, useMemo } from "react";
import { MaterialTypeSwitcher } from "@/components/work/overview/materialtypeswitcher/MaterialTypeSwitcher";
import { CreatorsArray } from "@/components/work/overview/creatorsarray/CreatorsArray";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

function useInitMaterialType(
  uniqueMaterialTypes,
  inUniqueMaterialTypes,
  type,
  onTypeChange
) {
  useEffect(() => {
    if (
      uniqueMaterialTypes &&
      uniqueMaterialTypes?.[0] !== type &&
      (type === "" || type === [] || !inUniqueMaterialTypes(type))
    ) {
      onTypeChange({
        type: uniqueMaterialTypes?.[0],
      });
    }
  }, []);
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
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

  const {
    uniqueMaterialTypes,
    inUniqueMaterialTypes,
    flatPidsByType,
    manifestationsEnrichedWithDefaultFrontpage,
  } = useMemo(() => {
    return manifestationMaterialTypeFactory(manifestations);
  }, [work, manifestations]);

  useInitMaterialType(
    uniqueMaterialTypes,
    inUniqueMaterialTypes,
    type,
    onTypeChange
  );

  const selectedPids = useMemo(() => flatPidsByType(type), [type]);

  const selectedMaterial = useMemo(
    () => manifestationsEnrichedWithDefaultFrontpage(type),
    [type]
  );

  return (
    <div className={`${styles.background} ${className}`}>
      <Container fluid>
        <Row className={`${styles.overview}`}>
          <Col xs={12} lg={3} className={styles.breadcrumbs} />
          <Col
            xs={12}
            lg={3}
            md={{ span: 4, order: 3 }}
            className={styles.cover}
          >
            <Row>
              <Cover
                src={selectedMaterial?.cover?.detail || work?.materialTypes}
                skeleton={skeleton || !selectedMaterial.cover}
                size="large"
              >
                <Bookmark title={work?.titles?.full?.[0]} />
              </Cover>
            </Row>
          </Col>

          <Col xs={12} md={{ order: 2 }} className={`${styles.about}`}>
            <Row>
              <Col xs={12}>
                <Title
                  type="title3"
                  skeleton={skeleton}
                  data-cy={"title-overview"}
                >
                  {work?.titles?.full[0]}
                </Title>
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
                <ReservationButton
                  workId={workId}
                  selectedPids={selectedPids}
                />
              </Col>
              <OrderButtonTextBelow
                workId={workId}
                selectedPids={selectedPids}
                skeleton={skeleton}
              />
              <AlternativeOptions workId={workId} selectedPids={selectedPids} />
              <Col xs={12} className={styles.info}>
                <LocalizationsLink selectedPids={selectedPids} />
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
 * @returns {JSX.Element}
 */
export default function Wrap({ workId, type, onTypeChange, login }) {
  const user = useUser();

  const fbiWork = useData(workFragments.overviewWork({ workId }));

  if (fbiWork.isLoading) {
    return <OverviewSkeleton isSlow={fbiWork.isSlow} />;
  }

  if (fbiWork.error || fbiWork.error) {
    return <OverviewError />;
  }

  return (
    <Overview
      work={fbiWork.data.work}
      workId={workId}
      type={type}
      onTypeChange={onTypeChange}
      login={login}
      user={user}
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

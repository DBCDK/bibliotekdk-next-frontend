import Router from "next/router";

import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import merge from "lodash/merge";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Cover from "@/components/base/cover";
import Tag from "@/components/base/forms/tag";
import Bookmark from "@/components/base/bookmark";
import Breadcrumbs from "@/components/base/breadcrumbs";
import Translate, { hasTranslation } from "@/components/base/translate";
import AlternativeOptions from "./alternatives";

import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Link from "@/components/base/link";

import OrderButton from "@/components/work/reservationbutton/ReservationButton";

import useUser from "@/components/hooks/useUser";

import styles from "./Overview.module.css";

import { ButtonTxt } from "@/components/work/reservationbutton/ReservationButton";

// Translate Context
const context = { context: "overview" };

/**
 * infomedia url is specific for this gui - set an url on the online access object
 * @param onlineAccess
 * @return {*}
 */
function addToOnlinAccess(onlineAccess, title) {
  const addi = onlineAccess?.map((access) => {
    if (access.infomediaId) {
      access.url = `/infomedia/${title}/work-of:${access.pid}`;
    }
    // @TODO should the text on the button differ ??
    // like access.buttonTxt = "fisk

    return access;
  });

  return addi;
}

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
  onOnlineAccess = () => {},
  login = () => {},
  openOrderModal = () => {},
  user = {},
  className = "",
  skeleton = false,
  workTypes,
}) {
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

  const searchOnUrl = "/find?q=";

  if (selectedMaterial?.manifestations?.[0].onlineAccess) {
    const enrichedOnline = addToOnlinAccess(
      selectedMaterial.manifestations[0].onlineAccess
    );
    selectedMaterial.manifestations[0].onlineAccess = enrichedOnline;
  }
  const onlineAccess = selectedMaterial?.manifestations?.[0].onlineAccess;

  const workType = workTypes?.[0] || "fallback";
  const workTypeTranslated = hasTranslation({
    context: "workTypeDistinctForm",
    label: workType,
  })
    ? Translate({
        context: "workTypeDistinctForm",
        label: workType,
      })
    : Translate({
        context: "workTypeDistinctForm",
        label: "fallback",
      });

  // BETA-1 .. disable breadcrumb links
  const breadcrumbsdisabled = true;

  return (
    <div className={`${styles.background} ${className}`}>
      <Container fluid>
        <Row className={`${styles.overview}`}>
          <Col xs={12} lg={3} className={styles.breadcrumbs}>
            {/*
            BETA-1 - removed breadcrumbs
            <Breadcrumbs
              path={path}
              skeleton={skeleton}
              crumbs={4}
              disabled={breadcrumbsdisabled}
            />
            */}
          </Col>

          <Col
            xs={12}
            md={{ span: 4, order: 3 }}
            lg={3}
            className={styles.cover}
          >
            <Row>
              <Cover
                src={
                  (selectedMaterial.cover && selectedMaterial.cover.detail) ||
                  allMaterialTypes
                }
                skeleton={skeleton || !selectedMaterial.cover}
                size="large"
              >
                <Bookmark
                  skeleton={skeleton || !selectedMaterial.cover}
                  title={title}
                />
              </Cover>
            </Row>
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
                  alt=""
                />
              </Col>
              <Col xs={12}>
                {creators.map((c, i) => {
                  return (
                    <span key={`${c.name}-${i}`}>
                      <Link
                        children={c.name}
                        href={`${searchOnUrl}${c.name}`}
                        border={{ top: false, bottom: { keepVisible: true } }}
                      >
                        <Text
                          type="text3"
                          className={styles.creators}
                          skeleton={skeleton}
                          lines={1}
                        >
                          {c.name}
                        </Text>
                      </Link>
                      {creators.length > i + 1 ? ", " : ""}
                    </span>
                  );
                })}
              </Col>

              <Col xs={12} className={styles.materials}>
                {materialTypes.map((material) => {
                  //  Sets isSelected flag if button should be selected
                  const isSelected =
                    material.materialType === selectedMaterial.materialType;

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
                <OrderButton
                  selectedMaterial={selectedMaterial}
                  user={user}
                  onOnlineAccess={onOnlineAccess}
                  login={login}
                  openOrderModal={openOrderModal}
                  workTypeTranslated={workTypeTranslated}
                  title={title}
                />
              </Col>
              <Col xs={12} className={styles.info}>
                <ButtonTxt
                  selectedMaterial={selectedMaterial}
                  skeleton={skeleton}
                />
              </Col>
              <Col xs={12} className={styles.info}>
                <AlternativeOptions onlineAccess={onlineAccess} />
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
export default function Wrap(props) {
  const { workId, type, onTypeChange, onOnlineAccess, login, openOrderModal } =
    props;

  const user = useUser();

  // use the useData hook to fetch data
  const { data, isLoading, isSlow, error } = useData(
    workFragments.basic({ workId })
  );

  const { data: detailsData, error: detailsError } = useData(
    workFragments.details({ workId })
  );

  const covers = useData(workFragments.covers({ workId }));

  if (isLoading) {
    return <OverviewSkeleton isSlow={isSlow} />;
  }

  if (error || detailsError) {
    return <OverviewError />;
  }

  const merged = merge({}, covers.data, data, detailsData);

  return (
    <Overview
      {...merged.work}
      type={type}
      onTypeChange={onTypeChange}
      onOnlineAccess={onOnlineAccess}
      login={login}
      openOrderModal={openOrderModal}
      user={user}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
  onOnlineAccess: PropTypes.func,
  openOrderModal: PropTypes.func,
  user: PropTypes.object,
  login: PropTypes.func,
};

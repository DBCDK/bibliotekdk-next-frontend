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
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import Link from "@/components/base/link";

import useUser from "@/components/hooks/useUser";

import includes from "lodash/includes";
// Translate Context
const context = { context: "overview" };

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

  return (
    <div className={`${styles.background} ${className}`}>
      <Container fluid>
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
                <OrderButton
                  selectedMaterial={selectedMaterial}
                  user={user}
                  onlineAccess={onOnlineAccess}
                  login={login}
                  openOrderModal={openOrderModal}
                />
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
 * Seperat function for orderbutton
 * Check what kind of material (eg. online, not avialable etc)
 * and present appropiate button
 *
 * @param selectedMaterial
 * @param skeleton
 * @param funcs
 * @return {JSX.Element}
 * @constructor
 */
export function OrderButton({
  selectedMaterial,
  onlineAccess,
  login,
  openOrderModal,
  user,
}) {
  /*
   onlineAccess={onOnlineAccess}
                  login={login}
                  openOrderModal={openOrderModal}
   */

  // The loan button is skeleton until we know if selected
  // material is physical or online
  let buttonSkeleton = typeof selectedMaterial.onlineAccess === "undefined";

  /* order button acts on following scenarios:
  1. material is accessible online (no user login) -> go to online url
  2. user is not logged in -> go to login
  3. material is available for logged in library -> prepare order button with parameters
  4. material is not avialable -> disable
   */

  if (selectedMaterial.onlineAccess) {
    return (
      <Button
        className={styles.externalLink}
        skeleton={buttonSkeleton}
        onClick={() => onlineAccess(selectedMaterial.onlineAccess[0]?.url)}
      >
        <Icon src={"external.svg"} skeleton={buttonSkeleton} />
        {Translate({
          ...context,
          label:
            selectedMaterial.materialType === "Ebog"
              ? "onlineAccessEbook"
              : selectedMaterial.materialType.includes("Lydbog")
              ? "onlineAccessAudiobook"
              : "onlineAccessUnknown",
        })}
      </Button>
    );
  }
  // is user logged in
  if (!user.isAuthenticated) {
    // login button
    return (
      <Button
        skeleton={buttonSkeleton}
        onClick={() => login()}
        data_cy="button-order-overview"
      >
        {Translate({ ...context, label: "Order (not logged in)" })}
      </Button>
    );
  }

  // user is logged in - check availability
  const pid = selectedMaterial.pid;
  const materialType = selectedMaterial.materialType;
  const { data, isLoading, isSlow, error } = useData(
    manifestationFragments.availability({ pid })
  );

  let available = false;
  if (isLoading) {
    buttonSkeleton = true;
  } else {
    available = checkAvailability({ error, data, materialType });
  }

  // finished loading - materail can not be ordered - disable buttons
  if (!isLoading && !available) {
    // disabled button
    return (
      <Button
        skeleton={buttonSkeleton}
        disabled={true}
        className={styles.disabledbutton}
        data_cy="button-order-overview"
      >
        {Translate({ context: "overview", label: "Order-disabled" })}
      </Button>
    );
  }
  // all is well - material can be ordered - order button
  return (
    <Button
      skeleton={buttonSkeleton}
      onClick={() => openOrderModal(pid)}
      data_cy="button-order-overview"
    >
      {Translate({ context: "general", label: "bestil" })}
    </Button>
  );
}

function checkAvailability({ error, data, materialType }) {
  if (error && !process.env.STORYBOOK_ACTIVE) {
    log(error, `availability check failed with error: ${error}`);
    return false;
  }
  // for now we only support ordering books
  const supportedMaterialTypes = ["Bog"];
  if (!includes(supportedMaterialTypes, materialType)) {
    return false;
  }

  // check availability response
  // @TODO check with nanna or rikke to verify
  return (
    data &&
    data.manifestation &&
    data.manifestation.availability &&
    data.manifestation.availability.orderPossible
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
  const {
    workId,
    type,
    onTypeChange,
    onOnlineAccess,
    login,
    openOrderModal,
  } = props;

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

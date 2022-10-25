import { useModal } from "@/components/_modal";
import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import merge from "lodash/merge";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Cover from "@/components/base/cover";
import Tag from "@/components/base/forms/tag";
import Bookmark from "@/components/base/bookmark";
import Translate from "@/components/base/translate";
import AlternativeOptions from "./alternatives";
import LocalizationsLink from "./localizationslink";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Link from "@/components/base/link";
import { OrderButton } from "@/components/work/reservationbutton/ReservationButton";
import useUser from "@/components/hooks/useUser";
import styles from "./Overview.module.css";
import { OrderButtonTextBelow } from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";

function selectMaterialBasedOnType(materialTypes, type) {
  // Creates MaterialTypes as an index
  const materialTypesMap = {};
  materialTypes?.forEach((m) => {
    materialTypesMap[m.materialType] = m;
  });

  return materialTypesMap[type] || materialTypes?.[0] || false;
}

function CreatorsArray(creators, skeleton) {
  const searchOnUrl = "/find?q.creator=";
  return creators?.map((creator, index) => {
    return (
      <span key={`${creator.name}-${index}`}>
        <Link
          disabled={skeleton}
          href={`${searchOnUrl}${creator.name}`}
          border={{ top: false, bottom: { keepVisible: true } }}
        >
          <Text
            type="text3"
            className={styles.creators}
            skeleton={skeleton}
            lines={1}
          >
            {creator.name}
          </Text>
        </Link>
        {creators?.length > index + 1 ? ", " : ""}
      </span>
    );
  });
}

function MaterialTypeArray(
  materialTypes,
  selectedMaterial,
  skeleton,
  onTypeChange,
  type
) {
  // Handle selectedMaterial
  function handleSelectedMaterial(material, type) {
    // Update query param callback
    if (type !== material.materialType) {
      onTypeChange({ type: material.materialType });
    }
  }

  return materialTypes?.map((material) => {
    //  Sets isSelected flag if button should be selected
    return (
      <Tag
        key={material.materialType}
        selected={material.materialType === selectedMaterial.materialType}
        onClick={() => handleSelectedMaterial(material, type)}
        skeleton={skeleton}
      >
        {material.materialType}
      </Tag>
    );
  });
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
  type,
  onTypeChange = () => {},
  onOnlineAccess = () => {},
  openOrderModal = () => {},
  className = "",
  skeleton = false,
}) {
  // Either use type from props, or from local state
  const selectedMaterial = selectMaterialBasedOnType(work?.materialTypes, type);

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
                <Bookmark
                  skeleton={skeleton || !selectedMaterial.cover}
                  title={work?.title}
                />
              </Cover>
            </Row>
          </Col>

          <Col xs={12} md={{ order: 2 }} className={`${styles.about}`}>
            <Row>
              <Col xs={12}>
                <Title type="title3" skeleton={skeleton}>
                  {work?.fullTitle}
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
              <Col xs={12}>{CreatorsArray(work?.creators)}</Col>
              <Col xs={12} className={styles.materials}>
                {MaterialTypeArray(
                  work?.materialTypes,
                  selectedMaterial,
                  skeleton,
                  onTypeChange,
                  type
                )}
              </Col>
              <Col xs={12} sm={9} xl={7} className={styles.basket}>
                <OrderButton
                  workId={workId}
                  chosenMaterialType={type}
                  onOnlineAccess={onOnlineAccess}
                  openOrderModal={openOrderModal}
                />
              </Col>
              <Col xs={12} className={styles.info}>
                <OrderButtonTextBelow
                  workId={workId}
                  type={type}
                  skeleton={skeleton}
                />
              </Col>
              <Col xs={12} className={styles.info}>
                <AlternativeOptions selectedMaterial={selectedMaterial} />
              </Col>
              <Col xs={12} className={styles.info}>
                <LocalizationsLink
                  selectedMaterial={selectedMaterial}
                  workId={workId}
                />
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
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId, type, onTypeChange, onOnlineAccess, login } = props;
  const user = useUser();
  const modal = useModal();

  // use the useData hook to fetch data
  const basic = useData(workFragments.basic({ workId }));
  const details = useData(workFragments.details({ workId }));
  const covers = useData(workFragments.covers({ workId }));

  if (basic.isLoading) {
    return <OverviewSkeleton isSlow={basic.isSlow} />;
  }

  if (basic.error || details.error) {
    return <OverviewError />;
  }

  const merged = merge({}, covers.data, basic.data, details.data);

  function handleOpenOrderModal(pid, modal, workId, type) {
    modal.push("order", {
      title: Translate({ context: "modal", label: "title-order" }),
      pid,
      workId,
      type,
    });
  }

  return (
    <Overview
      work={merged.work}
      type={type}
      onTypeChange={onTypeChange}
      onOnlineAccess={onOnlineAccess}
      login={login}
      openOrderModal={(pid) => handleOpenOrderModal(pid, modal, workId, type)}
      user={user}
      workId={workId}
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

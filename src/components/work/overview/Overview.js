import { Container, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import merge from "lodash/merge";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import Cover from "@/components/base/cover";
import Tag from "@/components/base/forms/tag";
import Bookmark from "@/components/base/bookmark";
import AlternativeOptions from "./alternatives";
import LocalizationsLink from "./localizationslink";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import Link from "@/components/base/link";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";
import useUser from "@/components/hooks/useUser";
import styles from "./Overview.module.css";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { useGetPidsFromWorkIdAndType } from "@/components/hooks/useWorkAndSelectedPids";

function selectMaterialBasedOnType_TempUsingAlfaApi(materialTypes, type) {
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
  selectedPids,
  type,
  onTypeChange = () => {},
  className = "",
  skeleton = false,
}) {
  const validMaterialTypes = work?.materialTypes.map(
    (materialType) => materialType.materialType
  );

  if (type === null || !validMaterialTypes?.includes(type)) {
    onTypeChange({ type: work?.materialTypes?.[0]?.materialType });
  }

  // Either use type from props, or from local state
  const selectedMaterial = selectMaterialBasedOnType_TempUsingAlfaApi(
    work?.materialTypes,
    type
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
              <Col xs={12} className={styles.info}>
                <AlternativeOptions selectedMaterial={selectedMaterial} />
              </Col>
              <Col xs={12} className={styles.info}>
                <LocalizationsLink
                  workId={workId}
                  selectedPids={selectedPids}
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
  const { workId, type, onTypeChange, login } = props;
  const user = useUser();

  // use the useData hook to fetch data
  const buttonTxt = useData(workFragments.buttonTxt_TempForAlfaApi({ workId }));
  const details = useData(workFragments.details({ workId }));
  const covers = useData(workFragments.covers({ workId }));
  const merged = merge({}, covers.data, buttonTxt.data, details.data);

  const selectedPids = useGetPidsFromWorkIdAndType(workId, type);

  if (buttonTxt.isLoading) {
    return <OverviewSkeleton isSlow={buttonTxt.isSlow} />;
  }

  if (buttonTxt.error || details.error) {
    return <OverviewError />;
  }

  return (
    <Overview
      work={merged.work}
      workId={workId}
      selectedPids={selectedPids}
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
  type: PropTypes.string,
  onTypeChange: PropTypes.func,
  onOnlineAccess: PropTypes.func,
  user: PropTypes.object,
  login: PropTypes.func,
};

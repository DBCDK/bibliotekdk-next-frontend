import useBookmarks, {
  populateBookmarks,
} from "@/components/hooks/useBookmarks";
import styles from "./Bookmark.module.css";
import { Col, Container, Row } from "react-bootstrap";
import Title from "@/components/base/title";
import Text from "@/components/base/title";
import Button from "@/components/base/button";
import MaterialRow from "../materialRow/MaterialRow";
import { useWorkFromSelectedPids } from "@/components/hooks/useWorkAndSelectedPids";
import { pidsToWorks } from "@/lib/api/work.fragments";
import IconButton from "@/components/base/iconButton";

const BookmarkPage = () => {
  const { bookmarks } = useBookmarks();
  const { data } = populateBookmarks(bookmarks);

  console.log(data);
  return (
    <Container className={styles.cleanContainer}>
      <Row>
        <Col xs={12}>
          <Title tag="h1" type="title3" className={styles.title}>
            Huskeliste
          </Title>
          <Text tag="small" type="small" className={styles.smallLabel}>
            {bookmarks?.length} materialer
          </Text>
          <div className={styles.buttonControls}>
            <div role="checkbox" className={styles.selectAllButton}>
              Vælg alle
            </div>
            <Button size="small" disabled className={styles.orderButton}>
              Bestil
            </Button>
            <Button
              size="small"
              type="secondary"
              disabled
              className={styles.referenceButton}
            >
              Referencer
            </Button>
            <IconButton disabled className={styles.removeButton}>
              Fjern
            </IconButton>
          </div>
          {data?.works?.map((bookmark) => (
            <MaterialRow
              hasCheckbox
              title={bookmark?.titles?.main[0] || ""}
              creator={bookmark?.creators[0]?.display}
              materialType={
                bookmark?.manifestations?.bestRepresentation?.materialTypes[0]
                  ?.specific
              }
              image={
                bookmark?.manifestations?.bestRepresentation?.cover?.thumbnail
              }
              id={bookmark?.workId}
              creationYear="2000"
              type="BOOKMARK"
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default BookmarkPage;

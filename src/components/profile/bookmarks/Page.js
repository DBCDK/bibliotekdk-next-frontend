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
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";

const BookmarkPage = () => {
  const { bookmarks: bookmarkCookies } = useBookmarks();
  const { data } = populateBookmarks(bookmarkCookies);
  const bookmarks = data?.works.filter((n) => n); // Fix so long we recieve null from populate
  const [checkboxList, setCheckboxList] = useState();
  // bookmarks?.map((bookmark) => ({ id: bookmark.workId, isSelected: false }))

  useEffect(() => {
    const bookmarks = data?.works.filter((n) => n);
    setCheckboxList(
      bookmarks?.map((bookmark) => ({ id: bookmark.workId, isSelected: false }))
    );
  }, [data]);

  const onSelectAll = () => {
    console.log(checkboxList.filter((e) => e.isSelected === false).length > 0);
    const hasUnselectedElements =
      checkboxList.filter((e) => e.isSelected === false).length > 0;
    if (hasUnselectedElements)
      setCheckboxList(checkboxList.map((el) => ({ ...el, isSelected: true })));
    else
      setCheckboxList(checkboxList.map((el) => ({ ...el, isSelected: false })));
  };

  console.log(bookmarks, checkboxList);
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
            <div
              role="checkbox"
              className={styles.selectAllButton}
              onClick={onSelectAll}
            >
              <Checkbox
                checked={
                  checkboxList?.filter((e) => e.isSelected === false).length ===
                  0
                }
                id="bookmarkpage-select-all"
                aria-labelledby="bookmarkpage-select-all-label"
                tabIndex="-1"
                readOnly
              />
              <label id="bookmarkpage-select-all-label">Vælg alle</label>
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
          <div>
            {checkboxList &&
              bookmarks?.map((bookmark, idx) => (
                <MaterialRow
                  key={`bookmark-list-${idx}`}
                  hasCheckbox
                  title={bookmark?.titles?.main[0] || ""}
                  creator={bookmark?.creators[0]?.display}
                  materialType={
                    bookmark?.manifestations?.bestRepresentation
                      ?.materialTypes[0]?.specific
                  }
                  image={
                    bookmark?.manifestations?.bestRepresentation?.cover
                      ?.thumbnail
                  }
                  id={bookmark?.workId}
                  creationYear="2000"
                  type="BOOKMARK"
                  isSelected={checkboxList[idx]?.isSelected}
                  onSelect={() =>
                    setCheckboxList(
                      [...checkboxList].map((el, i) => {
                        if (i !== idx) return el;
                        else
                          return {
                            id: el.id,
                            isSelected: !el.isSelected,
                          };
                      })
                    )
                  }
                />
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookmarkPage;

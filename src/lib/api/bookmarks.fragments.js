import {
  creatorsFragment,
  materialTypesFragment,
} from "@/lib/api/fragments.utils";

const bookmarkCoverFragment = `
fragment bookmarkCover on Manifestation {
  cover { detail: detail_207 origin thumbnail }
  materialTypes { materialTypeSpecific { code } }
}`;

const bookmarkManifestationFragment = `
fragment bookmarkManifestation on Manifestation {
  pid
  titles { main full }
  creators { ...creatorsFragment }
  workTypes
  access {
    __typename
    ... on DigitalArticleService { issn }
  }
  cover { detail: detail_207 origin thumbnail }
  publisher
  edition { publicationYear { display } edition }
  materialTypes { ...materialTypesFragment }
  ownerWork {
    workId
    workTypes
    titles { main full }
    creators { ...creatorsFragment }
    workYear { display }
  }
}`;

export const fetchAll = ({
  sortBy = "createdAt",
  offset = 0,
  limit = 25,
  workId,
  countOnly = false,
  withMaterial = false,
  profile,
} = {}) => {
  return {
    profile,
    query: `
    query patronBookmarks(
      $sortBy: OrderBookmarksByEnum
      $offset: Int
      $limit: PaginationLimitScalar
      $filter: BookmarkFilterInput
      $countOnly: Boolean!
      $withMaterial: Boolean!
    ) {
      patron {
        bookmarks(orderBy: $sortBy, offset: $offset, limit: $limit, filter: $filter) {
          status
          hitcount
          items @skip(if: $countOnly) {
            id
            materialId
            createdAt
            selection {
              materialTypes {
                general
                specific
              }
            }
            material @include(if: $withMaterial) {
              work {
                workId
                titles { main full }
                creators { ...creatorsFragment }
                manifestations {
                  mostRelevant { ...bookmarkManifestation }
                }
              }
              manifestation {
                ...bookmarkManifestation
                ownerWork {
                  manifestations { mostRelevant { ...bookmarkCover } }
                }
              }
              manifestations { ...bookmarkManifestation }
            }
            snapshot {
              workId
              pid
              title
              creator
              materialTypes {
                materialTypeGeneral { code display }
                materialTypeSpecific { code display }
              }
            }
          }
        }
      }
    }
    ${bookmarkManifestationFragment}
    ${bookmarkCoverFragment}
    ${creatorsFragment}
    ${materialTypesFragment}
    `,
    variables: {
      sortBy: sortBy === "title" ? "TITLE_ASC" : "CREATEDAT_DESC",
      offset,
      limit,
      filter: workId ? { workId } : undefined,
      countOnly,
      withMaterial,
    },
  };
};

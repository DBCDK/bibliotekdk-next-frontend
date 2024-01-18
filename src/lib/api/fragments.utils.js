export const creatorsFragment = `fragment creatorsFragment on Creator {
  ... on Corporation {
    __typename
    display
    nameSort
    roles {
      function {
        plural
        singular
      }
      functionCode
    }
  }
  ... on Person {
    __typename
    display
    nameSort
    roles {
      function {
        plural
        singular
      }
      functionCode
    }
  }
}`;

const creatorsFragmentForAccessFactory = `fragment creatorsFragmentForAccessFactory on Creator {
  ... on Corporation {
    __typename
    display
    nameSort
    roles {
      functionCode
      function {
        plural
        singular
      }
    }
  }
  ... on Person {
    __typename
    display
    nameSort
    roles {
      functionCode
      function {
        plural
        singular
      }
    }
  }
}`;

export const materialTypesFragment = `fragment materialTypesFragment on MaterialType {
  materialTypeGeneral {
    code
    display
  }
  materialTypeSpecific {
    code
    display
  }
}`;

export const manifestationDetailsForAccessFactory = `fragment manifestationDetailsForAccessFactory on Manifestation {
  pid
  ownerWork {
    workId
  }
  titles {
    main
    full
  }
  edition {
    publicationYear {
      display
    }
  }
  creators {
    ...creatorsFragmentForAccessFactory
  }
  hostPublication {
    issue
  }
  materialTypes {
    materialTypeGeneral {
      code
      display
    }
    materialTypeSpecific {
      code
      display
    }
  }
  workTypes
}
${creatorsFragmentForAccessFactory}`;
export const seriesFragment = `fragment seriesFragment on Series {
  title
  readThisFirst
  readThisWhenever
  description
  mainLanguages
  seriesWorkTypes: workTypes
  numberInSeries {
    display
  }
}`;
export const universeFragment = `fragment universeFragment on Universe {
  title
  alternativeTitles
  description
  key
}`;
export const coverFragment = `fragment coverFragment on Manifestation {
  cover {
    detail
    thumbnail
    origin
  }
}`; // Use this fragments in queries that provide data
// to the WorkSlider
export const workSliderFragment = `fragment workSliderFragment on Work {
  workId
  workTypes
  abstract
  fictionNonfiction {
    display
    code
  }
  titles {
    main
    full
  }
  materialTypes {
    materialTypeGeneral {
      code
      display
    }
    materialTypeSpecific {
      code
      display
    }
  }
  manifestations {
    mostRelevant {
      materialTypes {
        materialTypeGeneral {
          code
          display
        }
        materialTypeSpecific {
          code
          display
        }
      }
      cover {
        detail
        origin
      }
    }
  }
}`;

export const workTitleFragment = `fragment workTitleFragment on Work {
  titles {
    main
    full
  }
}`;

export const manifestationTitleFragment = `fragment manifestationTitleFragment on Manifestation {
  titles {
    main
    full
  }
}`;

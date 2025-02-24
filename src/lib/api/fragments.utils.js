export const creatorsFragment = `fragment creatorsFragment on CreatorInterface {
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

const creatorsFragmentForAccessFactory = `fragment creatorsFragmentForAccessFactory on CreatorInterface {
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

export const tvSeriesFragment = `fragment tvSeriesFragment on TvSeries{
              title
              episode {
                display
                numbers
              }
              volume {
								numbers
								display
							}
              season {
                display
                numbers
              }
              episodeTitles
              disc {
                display
                numbers
              }
              episode {
                display
                numbers
              }
              danishLaunchTitle            
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
    original
    tvSeries {
      ...tvSeriesFragment
    }   
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
${tvSeriesFragment}
${creatorsFragmentForAccessFactory}`;

export const seriesFragment = `fragment seriesFragment on Series {
  title
  identifyingAddition
  readThisFirst
  readThisWhenever
  description
  mainLanguages
  seriesWorkTypes: workTypes
  seriesId
  traceId
  numberInSeries
}`;
export const universeFragment = `fragment universeFragment on Universe {
  title
  alternativeTitles
  description
  key
  universeId
  traceId
}`;
export const coverFragment = `fragment coverFragment on Manifestation {
  cover {
    detail: detail_207
    thumbnail
    origin
  }
}`; // Use this fragments in queries that provide data
// to the WorkSlider
export const workSliderFragment = `fragment workSliderFragment on Work {
  workId
  workTypes
  abstract
  traceId
  fictionNonfiction {
    display
    code
  }
  titles {
    main
    full
		tvSeries {
      ...tvSeriesFragment
    }   
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
        detail: detail_207
        origin
      }
    }
  }
}${tvSeriesFragment}`;

// This should be FAST to fetch, used for caching basic work data
// Retrieve this in search/recommend etc results, and reuse on material page
export const cacheWorkFragment = `fragment cacheWorkFragment on Work {
  traceId
  workId
  series {
    title
    numberInSeries  
  }
  mainLanguages {
    isoCode
    display
  }
  manifestations {
    mostRelevant{
      publisher
      pid
      cover {
        detail: detail_207
        origin
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
      edition {
        publicationYear {
          display
        }
        edition
      }
    }            
  }
  titles {
    main
    full
    parallel
    sort
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

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

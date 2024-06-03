/**
 * updates the users consent to storing their data in userData api for more than 30 days
 *
 * @param {Object} params
 * @param {boolean} params.persistUserData
 */

export function setPersistUserDataValue({ persistUserData, userDataMutation }) {
  const q = {
    query: `
      mutation setPersistUserDataValue($persistUserData: Boolean!) {
        users{
        setPersistUserDataValue(persistUserData: $persistUserData) {
         success
         errorMessage
        }
      }
      } 
      `,
    variables: {
      persistUserData,
    },
  };

  userDataMutation.post(q);
}

/**
 * Deletes user from userdata service. All added FFU libraries will also be deleted
 *
 */

export function deleteUser({ userDataMutation }) {
  const q = {
    query: `
    mutation{
      users{
        deleteUserFromUserDataService{
          success
        }
      }
    }
      `,
  };

  return userDataMutation.post(q);
}

/**
 * Adds user to userdata service if user dosen't exists.
 *
 */

export function addUserToUserData({ userDataMutation }) {
  const q = {
    query: `
    mutation{
      users{
        addUserToUserDataService{
          success
        }
      }
      
    }
      `,
  };

  return userDataMutation.post(q);
}

/**
 * add an advanced search search in userdata
 *
 */

export function addSavedSearch({ searchObject }) {
  const q = {
    query: `
      mutation addSavedSearch($searchObject:  String!) {
        users{
          addSavedSearch(searchObject: $searchObject) {
            searchObject
            id
            createdAt
        }
      }
      } 
      `,
    variables: {
      searchObject: JSON.stringify(searchObject),
    },
  };

  return q;
}

/**
 * update an advanced search search in userdata.
 *
 */

export function updateSavedSearch({ searchObject }) {
  console.log("updateSavedSearch.searchObject", searchObject);
  if (!searchObject.id) {
    return null;
  }
  const q = {
    query: `
      mutation updateSavedSearch($searchObject: String!, $savedSearchId: Int!) {
        users{
          updateSavedSearch(searchObject: $searchObject, savedSearchId: $savedSearchId) {
            message
        }
      }
      } 
      `,
    variables: {
      searchObject: JSON.stringify(searchObject),
      savedSearchId: searchObject.id,
    },
  };

  return q;
  // await userDataMutation.post(q);
}

/**
 * Delete multiple advanced searches from userdata. Deletes by savedSearch id
 *
 */

export function deleteSavedSearches({ idsToDelete }) {
  if (!Array.isArray(idsToDelete)) {
    return null;
  }
  const q = {
    query: `
      mutation deleteSavedSearches($savedSearchIds:  [Int!]!) {
        users{
          deleteSavedSearches(savedSearchIds: $savedSearchIds) {
            idsDeletedCount
            message
        }
      }
      } 
      `,
    variables: {
      savedSearchIds: idsToDelete,
    },
  };

  // const res = await userDataMutation.post(q);
  return q;
}

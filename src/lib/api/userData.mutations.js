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

export async function addSavedSearch({ searchObject, userDataMutation }) {
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

  await userDataMutation.post(q);
}

/**
 * update an advanced search search in userdata.
 *
 */

export async function updateSavedSearch({ searchObject, userDataMutation }) {
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

  await userDataMutation.post(q);
}

/**
 * Delete multiple advanced searches from userdata. Deletes by savedSearch id
 *
 */

export async function deleteSavedSearches({ idsToDelete, userDataMutation }) {
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

  await userDataMutation.post(q);
}

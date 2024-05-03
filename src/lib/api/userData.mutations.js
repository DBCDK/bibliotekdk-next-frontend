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
  console.log("searchObject", searchObject);
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

  const res = await userDataMutation.post(q);
  console.log("res", res);
}

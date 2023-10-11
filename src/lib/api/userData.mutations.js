/**
 * updates the users consent to storing their data in userData api for more than 30 days
 *
 * @param {object} params
 * @param {boolean} params.persistUserData
 */

export function setPersistUserDataValue({ persistUserData, userDataMutation }) {
  const q = {
    query: `
      mutation setPersistUserDataValue($persistUserData: Boolean!) {
        setPersistUserDataValue(persistUserData: $persistUserData) {
         success
         errorMessage
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

  userDataMutation.post(q);
}

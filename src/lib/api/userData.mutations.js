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

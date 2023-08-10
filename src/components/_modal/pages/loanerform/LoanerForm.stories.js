import { LoanerForm } from "./LoanerForm";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";

const exportedObject = {
  title: "modal/Order/LoanerForm",
};

export default exportedObject;

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormNoLogin() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: false,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          orderPolicy: {
            orderPossible: true,
          },
          userParameters: [
            {
              userParameterType: "cpr",
              parameterRequired: true,
            },
            {
              userParameterType: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "barcode",
              parameterRequired: true,
            },
            {
              userParameterType: "cardno",
              parameterRequired: true,
            },
            {
              userParameterType: "pincode",
              parameterRequired: true,
            },
            {
              userParameterType: "customId",
              parameterRequired: true,
            },
            {
              userParameterType: "userDateOfBirth",
              parameterRequired: true,
            },
            {
              userParameterType: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "userAddress",
              parameterRequired: true,
            },
            {
              userParameterType: "userMail",
              parameterRequired: true,
            },
            {
              userParameterType: "userTelephone",
              parameterRequired: true,
            },
          ],
          pickupAllowed: true,
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

export function ShowLoanerFormDigitalAccess() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: true,
          },
          digitalAccess: true,
        }}
        context={{ mode: LOGIN_MODE.SUBSCRIPTION }}
        onSubmit={(data) => {
          console.log(data);
        }}
        digitalCopyAccess={true}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormWithLogin() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: true,
          },
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormWithLoginSubmitting() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: true,
          },
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
        submitting={true}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormWithOrderPolicyFalse() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: false,
          },
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormPurposeOrder() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: true,
          },
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
        context={{ mode: LOGIN_MODE.ORDER_PHYSICAL }}
      />
    </div>
  );
}

export function ShowLoanerFormPurposeSubscription() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        branch={{
          borrowerCheck: true,
          name: "DBCTestBibliotek",
          agencyName: "DBC-Testbiblioteksvæsen",
          agencyId: "790900",
          userParameters: [],
          pickupAllowed: true,
          orderPolicy: {
            orderPossible: true,
          },
        }}
        onSubmit={(data) => {
          console.log(data);
        }}
        context={{ mode: LOGIN_MODE.SUBSCRIPTION }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormSkeleton() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm skeleton={true} />
    </div>
  );
}

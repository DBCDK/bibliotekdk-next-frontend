import { LoanerForm } from "./LoanerForm";
import { useState } from "react";

const exportedObject = {
  title: "modal/LoanerForm",
};

export default exportedObject;

/**
 * Returns Loaner Form
 *
 */
export function ShowLoanerFormAllFields() {
  const [storeLoanerInfo, setStoreLoanerInfo] = useState(false);
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        storeLoanerInfo={storeLoanerInfo}
        setStoreLoanerInfo={setStoreLoanerInfo}
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

/**
 * Returns Loaner Form
 */
export function ShowLoanerFormShort() {
  const [storeLoanerInfo, setStoreLoanerInfo] = useState(false);

  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        storeLoanerInfo={storeLoanerInfo}
        setStoreLoanerInfo={setStoreLoanerInfo}
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
          userParameters: [
            {
              userParameterType: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "userMail",
              parameterRequired: true,
            },
          ],
        }}
        initial={{}}
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </div>
  );
}

/**
 * Returns Loaner Form
 */
export function ShowLoanerFormShortNoMail() {
  const [storeLoanerInfo, setStoreLoanerInfo] = useState(false);

  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm
        storeLoanerInfo={storeLoanerInfo}
        setStoreLoanerInfo={setStoreLoanerInfo}
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
          userParameters: [
            {
              userParameterType: "userId",
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
          ],
        }}
        initial={{}}
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
export function ShowLoanerFormSkeleton() {
  return (
    <div style={{ maxWidth: 450 }}>
      <LoanerForm skeleton={true} />
    </div>
  );
}

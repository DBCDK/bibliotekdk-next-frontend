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
              userParameterType: "CPR",
              userParameterName: "cpr",
              parameterRequired: true,
            },
            {
              userParameterType: "USERID",
              userParameterName: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "BARCODE",
              userParameterName: "barcode",
              parameterRequired: true,
            },
            {
              userParameterType: "CARDNO",
              userParameterName: "cardno",
              parameterRequired: true,
            },
            {
              userParameterType: "PINCODE",
              userParameterName: "pincode",
              parameterRequired: true,
            },
            {
              userParameterType: "CUSTOMID",
              userParameterName: "customId",
              parameterRequired: true,
            },
            {
              userParameterType: "USERDATEOFBIRTH",
              userParameterName: "userDateOfBirth",
              parameterRequired: true,
            },
            {
              userParameterType: "USERNAME",
              userParameterName: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "USERADDRESS",
              userParameterName: "userAddress",
              parameterRequired: true,
            },
            {
              userParameterType: "USERMAIL",
              userParameterName: "userMail",
              parameterRequired: true,
            },
            {
              userParameterType: "USERTELEPHONE",
              userParameterName: "userTelephone",
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
              userParameterType: "USERID",
              userParameterName: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "USERNAME",
              userParameterName: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "USERMAIL",
              userParameterName: "userMail",
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
              userParameterType: "USERID",
              userParameterName: "userId",
              parameterRequired: true,
            },
            {
              userParameterType: "USERNAME",
              userParameterName: "userName",
              parameterRequired: true,
            },
            {
              userParameterType: "USERADDRESS",
              userParameterName: "userAddress",
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

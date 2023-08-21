import { useState, useEffect } from "react";
import Receipt from "./";
import Modal, { useModal } from "@/components/_modal";

const exportedObject = {
  title: "Modal/Receipt",
};

export default exportedObject;

// dummy context for receipt
const context = {
  pid: "870970-basis:47210577",
  pickupBranch: {
    agencyName: "DBC-Testbiblioteksvæsen",
    agencyId: "790900",
    name: "DBCTestBibliotek",
    city: "Testby-test",
    postalAddress: "B. Adresse",
    postalCode: "1234",
    branchId: "790900",
    openingHours:
      "VIP 4.9: Åbningstider<br>\r\nmandag<br>\r\ntirsdag<br>\r\nonsdag<br>\r\ntorsdag<br>\r\nfredag<br>\r\nlørdag",
    borrowerCheck: true,
    orderPolicy: {
      orderPossible: true,
      orderPossibleReason: "NOT_OWNED_ILL_LOC",
      lookUpUrl: null,
    },
    userParameters: [
      {
        userParameterType: "userId",
        parameterRequired: true,
      },
    ],
    pickupAllowed: true,
    userStatusUrl: "http://www.danbib.dk/vip_lånerstatus",
  },
};

export function FailingOrder() {
  const { index, update, setStack } = useModal();
  const [order, setOrder] = useState({ isLoading: true });

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "receipt", context, active: true }]);

    if (order.isLoading) {
      setTimeout(() => {
        setOrder({
          isLoading: false,
          data: {
            submitOrder: {
              status: "not_owned_ILL_loc",
              orderId: 1041538443,
              ok: false,
            },
          },
        });
      }, 2000);
    }
  }, []);

  //   update context
  useEffect(() => {
    if (!order.isLoading && order.data) {
      update(index(), { order });
    }
  }, [order]);

  return (
    <Modal.Container>
      <Modal.Page id="receipt" component={Receipt} />
    </Modal.Container>
  );
}

export function Default() {
  const { index, update, setStack } = useModal();
  const [order, setOrder] = useState({ isLoading: true });

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "receipt", context, active: true }]);

    if (order.isLoading) {
      setTimeout(() => {
        setOrder({
          isLoading: false,
          data: {
            submitOrder: {
              status: "not_owned_ILL_loc",
              orderId: "1041538443",
              ok: true,
            },
          },
        });
      }, 2000);
    }
  }, []);

  //   update context
  useEffect(() => {
    if (!order.isLoading && order.data) {
      update(index(), { order });
    }
  }, [order]);

  return (
    <Modal.Container>
      <Modal.Page id="receipt" component={Receipt} />
    </Modal.Container>
  );
}

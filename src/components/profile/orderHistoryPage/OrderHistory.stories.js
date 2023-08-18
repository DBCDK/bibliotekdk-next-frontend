import OrderHistory from "./Page";
import automock_utils from "@/lib/automock_utils.fixture";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { StoryTitle, StoryDescription } from "@/storybook";

const { ORDER_IDs } = automock_utils();
const mockedORderData = [[], [], []];
const exportedObject = {
  title: "profile/Order history",
};

export const HistoryPageStory = () => {
  console.log("ORDER_IDs", ORDER_IDs);
  return (
    <>
      <StoryTitle>Bestilingshistorik</StoryTitle>
      <StoryDescription>
        Viser de bestillinger der brugeren har foretaget gennem bibliotek.dk
      </StoryDescription>
      <Modal.Container>
        <Modal.Page
          id="orderHistoryDataConsent"
          component={Pages.OrderHistoryDataConsent}
        />
      </Modal.Container>
      <OrderHistory mockedData={mockedORderData} />
    </>
  );
};
HistoryPageStory.story = {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          orderStatus: () => [
            [
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047046103",
                pickupAgencyId: "790900",
                pid: "870970-basis:62740582",
                closed: false,
                creationDate: "2023-08-11T07:32:14.000+00:00",
                author: "Seeck, Max, f. 1985",
                title: "Zetterborg-sagen",
              },
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047046135",
                pickupAgencyId: "790900",
                pid: "870970-basis:50679055",
                closed: false,
                creationDate: "2023-08-11T07:36:09.000+00:00",
                author: "Lundsgaard, Anders",
                title: "Formula 2 : FORM som struktureret observationsmodel",
              },
              {
                autoForwardResult: "automated",
                placeOnHold: "responder_depending",
                orderId: "1047079898",
                pickupAgencyId: "820120",
                pid: "870970-basis:62937106",
                closed: true,
                creationDate: "2023-08-15T09:18:59.000+00:00",
                author: "Bech, Glenn, f. 1991-04-08",
                title: "Jeg anerkender ikke længere jeres autoritet : manifest",
              },
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047079962",
                pickupAgencyId: "790900",
                pid: "870970-basis:62853824",
                closed: false,
                creationDate: "2023-08-15T09:22:59.000+00:00",
                author: "Hietala, Jonna",
                title: "52 uger med sjaler",
              },
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047046103",
                pickupAgencyId: "790900",
                pid: "870970-basis:62740582",
                closed: false,
                creationDate: "2023-08-11T07:32:14.000+00:00",
                author: "Seeck, Max, f. 1985",
                title: "Zetterborg-sagen",
              },
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047046135",
                pickupAgencyId: "790900",
                pid: "870970-basis:50679055",
                closed: false,
                creationDate: "2023-08-11T07:36:09.000+00:00",
                author: "Lundsgaard, Anders",
                title: "Formula 2 : FORM som struktureret observationsmodel",
              },
              {
                autoForwardResult: "automated",
                placeOnHold: "responder_depending",
                orderId: "1047079898",
                pickupAgencyId: "820120",
                pid: "870970-basis:62937106",
                closed: true,
                creationDate: "2023-08-15T09:18:59.000+00:00",
                author: "Bech, Glenn, f. 1991-04-08",
                title: "Jeg anerkender ikke længere jeres autoritet : manifest",
              },
              {
                autoForwardResult: "non_automated",
                placeOnHold: "responder_depending",
                orderId: "1047079962",
                pickupAgencyId: "790900",
                pid: "870970-basis:62853824",
                closed: false,
                creationDate: "2023-08-15T09:22:59.000+00:00",
                author: "Hietala, Jonna",
                title: "52 uger med sjaler",
              },
            ],
          ],
        },
      },
    },
  },
};
export default exportedObject;

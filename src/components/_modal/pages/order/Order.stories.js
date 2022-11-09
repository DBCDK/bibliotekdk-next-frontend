import { useState } from "react";

import { StoryTitle, StoryDescription } from "@/storybook";

import Button from "@/components/base/button";
import { Order, OrderSkeleton } from "./Order.page.js";
import data from "./dummy.data";
import dummyData from "./dummy.data";
import Modal, { useModal } from "@/components/_modal";
import Pages from "@/components/_modal/pages";

const exportedObject = {
  title: "modal/Order",
};

export default exportedObject;

/**
 * Returns Modal
 *
 */
export function ToggleOrder() {
  // eslint-disable-next-line no-unused-vars
  const [_query, setQuery] = useState({ modal: null });

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Order template</StoryTitle>
      <StoryDescription>Toggle order component</StoryDescription>

      <Button
        type="secondary"
        size="small"
        onClick={() => setQuery({ modal: "order" })}
      >
        {"Toggle order"}
      </Button>

      {/*

      <Modal
        onClose={() => setQuery({ modal: null })}
        onLang={null}
        template={query.modal}
      >
        <Order
          work={work}
          user={user}
          pid={"some-pid"}
          order={order}
          query={query}
          onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
          onLayerClose={() => setQuery({ modal: "order" })}
          onSubmit={(pids, pickupBranch, email) => {
            alert(
              `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
            );
          }}
        />
      </Modal>

      */}
    </div>
  );
}

export function Default() {
  const [query, setQuery] = useState({ modal: "order" });

  const { user, order } = data;
  const pickupBranch = user.agency.result[0];

  const modifiedUser = { ...user, mail: "some@mail.dk" };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Default</StoryTitle>
      <StoryDescription>
        User has an email attached to the account
      </StoryDescription>

      <Order
        context={{ label: "title-order" }}
        initial={{
          pickupBranch: pickupBranch,
        }}
        pid="some-pid"
        work={dummyData.work}
        user={modifiedUser}
        authUser={modifiedUser}
        orderMutation={order}
        query={query}
        onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
        onLayerClose={() => setQuery({ modal: "order" })}
        onSubmit={(pids, pickupBranch, email) => {
          alert(
            `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
          );
        }}
      />
    </div>
  );
}

/**
 * Order template
 *
 */
export function Loading() {
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        Skeleton version of the order template
      </StoryDescription>
      <OrderSkeleton />
    </div>
  );
}

/**
 * Order template
 *
 */
export function NoEmail() {
  const [query, setQuery] = useState({ modal: "order" });

  const { user, order } = data;

  const pickupBranch = user.agency.result[0];
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Missing account email</StoryTitle>
      <StoryDescription>
        When user has no email attached to the account, they can enter one in
        the email field.
      </StoryDescription>

      <Order
        context={{ label: "title-order" }}
        initial={{
          pickupBranch: pickupBranch,
        }}
        pid="some-pid"
        work={dummyData.work}
        user={user}
        authUser={user}
        orderMutation={order}
        query={query}
        onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
        onLayerClose={() => setQuery({ modal: "order" })}
        onSubmit={(pids, pickupBranch, email) => {
          alert(
            `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
          );
        }}
      />
    </div>
  );
}

export function ManyPickupPoints() {
  const [query, setQuery] = useState({ modal: "order" });

  const { user, order } = data;

  // City main library
  const main = user.agency.result[0];

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Order Template</StoryTitle>
      <StoryDescription>
        If user has a long list of pickup points
      </StoryDescription>

      <Order
        context={{ label: "title-order" }}
        initial={{
          pickupBranch: main,
        }}
        pid="some-pid"
        work={dummyData.work}
        orderMutation={order}
        user={user}
        authUser={user}
        query={query}
        onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
        onLayerClose={() => setQuery({ modal: "order" })}
        onSubmit={(pids, pickupBranch, email) => {
          alert(
            `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
          );
        }}
      />
    </div>
  );
}

export function Ordering() {
  // const [query, setQuery] = useState({ modal: "order" });
  //
  // const { work, user, order } = data;
  //
  // const modifiedOrder = { ...order, isLoading: true };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Ordering</StoryTitle>
      <StoryDescription>
        {
          'Order in progress status (When user has clicked the "approve" button)'
        }
      </StoryDescription>

      {/*

      <Modal onClose={null} onLang={null} template={"order"}>
        <Order
          work={work}
          user={user}
          pid={"some-pid"}
          order={modifiedOrder}
          query={query}
          onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
          onLayerClose={() => setQuery({ modal: "order" })}
          onSubmit={(pids, pickupBranch, email) => {
            alert(
              `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
            );
          }}
        />
      </Modal>

      */}
    </div>
  );
}

export function Ordered() {
  // const [query, setQuery] = useState({ modal: "order" });
  //
  // const { work, user, order } = data;
  //
  // const modifiedOrder = {
  //   ...order,
  //   data: { submitOrder: { status: "ok", orsId: "some-ors-id" } },
  // };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Ordered</StoryTitle>
      <StoryDescription>
        When the order has successfully completed
      </StoryDescription>

      {/*

      <Modal onClose={null} onLang={null} template={"order"}>
        <Order
          work={work}
          user={user}
          pid={"some-pid"}
          order={modifiedOrder}
          query={query}
          onLayerChange={(layer) => setQuery({ modal: `order-${layer}` })}
          onLayerClose={() => setQuery({ modal: "order" })}
          onSubmit={(pids, pickupBranch, email) => {
            alert(
              `Ordering "${pids}" to branch id "${pickupBranch.branchId}" for user with email "${email}"`
            );
          }}
        />
      </Modal>

      */}
    </div>
  );
}

export function OrderPolicyFail() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  const modifiedUser = {
    ...user,
    agency: {
      result: [
        {
          agencyId: "715900",
          name: "Bibliografen Bagsværd",
          city: "Bagsværd",
          postalAddress: "Bagsværd Hovedgade 116",
          postalCode: "2880",
          branchId: "715902",
          openingHours:
            "man.-fre.:10-18, lør.:10-14. \r\nSelvbetjening: man.-fre.:18-21, lør.:14-21, søn- og helligdage 12-21. Lukket 24.12.",
          orderPolicy: {
            orderPossible: false,
            orderPossibleReason: "OWNED_OWN_CATALOGUE",
            lookUpUrl: "https://gladbib.dk/search/ting/45531031",
          },
          pickupAllowed: true,
        },
        {
          agencyId: "715900",
          name: "Gladsaxe Bibliotekerne, Hovedbiblioteket",
          city: "Søborg",
          postalAddress: "Søborg Hovedgade 220",
          postalCode: "2860",
          branchId: "715900",
          openingHours: "man-fre:10-19, lør.:10-14, søn.:(okt.-mar.)13-17",
          orderPolicy: {
            orderPossible: true,
            orderPossibleReason: "OWNED_ACCEPTED",
            lookUpUrl: "https://gladbib.dk/search/ting/45531031",
          },
          pickupAllowed: true,
        },
        {
          agencyId: "715900",
          name: "Dummy",
          city: "Søborg",
          postalAddress: "Søborg Hovedgade 220",
          postalCode: "2860",
          branchId: "715907",
          openingHours: "man-fre:10-19, lør.:10-14, søn.:(okt.-mar.)13-17",
          orderPolicy: null,
          pickupAllowed: false,
        },
      ],
    },
  };

  // City main library
  const main = modifiedUser.agency.result[0];

  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Order Template</StoryTitle>
      <StoryDescription>Order policy fail</StoryDescription>

      <Modal.Container>
        <Modal.Page id="pickup" component={Pages.Pickup} />
      </Modal.Container>

      <Order
        context={{ label: "title-order" }}
        initial={{
          pickupBranch: main,
        }}
        work={work}
        user={modifiedUser}
        authUser={modifiedUser}
        pid={"some-pid"}
        articleOrderMutation={order}
        orderMutation={order}
        query={query}
        onLayerChange={(query) => setQuery(query)}
        onLayerClose={() => setQuery({ modal: "order" })}
        onSubmit={(pids, pickupBranch) => {
          alert(`Ordering "${pids}" to branch id "${pickupBranch.branchId}".`);
        }}
        modal={modal}
      />
    </div>
  );
}

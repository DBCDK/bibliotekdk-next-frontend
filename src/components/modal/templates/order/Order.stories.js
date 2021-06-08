import { useState } from "react";

import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Button from "@/components/base/button";
import { Modal } from "@/components/modal";
import { Order, OrderSkeleton } from "./Order.template.js";
import data from "./dummy.data";

export default {
  title: "modal/Order",
};

/**
 * Returns Modal
 *
 */
export function ToggleOrder() {
  const [query, setQuery] = useState({ modal: null });

  const { work, user, order } = data;

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
    </div>
  );
}

export function Default() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  const modifiedUser = { ...user, mail: "some@mail.dk" };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Default</StoryTitle>
      <StoryDescription>
        User has an email attached to the account
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"order"}>
        <Order
          work={work}
          user={modifiedUser}
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

      <Modal onClose={null} onLang={null} template={"order"}>
        <OrderSkeleton />
      </Modal>
    </div>
  );
}

/**
 * Order template
 *
 */
export function NoEmail() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Missing account email</StoryTitle>
      <StoryDescription>
        When user has no email attached to the account, they can enter one in
        the email field.
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"order"}>
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
    </div>
  );
}

export function ManyPickupPoints() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  // City main library
  const main = user.agency.branches[0];

  // Auto generated long pickup list
  const list = Array.from(Array(25).keys()).map((l, i) => ({
    branchId: `${i + 1}`,
    name: `Filial ${i + 1}`,
    postalAddress: `Filialvej ${i + 1}`,
    postalCode: "1234",
    city: "Filialby",
    orderPolicy: {
      orderPossible: true,
      orderPossibleReason: "OWNED_ACCEPTED",
      lookUpUrl: "https://some-lookup-url",
    },
  }));

  const modifiedUser = {
    ...user,
    agency: { branches: [main, ...list] },
  };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Order Template</StoryTitle>
      <StoryDescription>
        If user has a long list of pickup points
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"order"}>
        <Order
          work={work}
          user={modifiedUser}
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
    </div>
  );
}

export function Ordering() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  const modifiedOrder = { ...order, isLoading: true };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Ordering</StoryTitle>
      <StoryDescription>
        Order in progress status (When user has clicked the "approve" button)
      </StoryDescription>

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
    </div>
  );
}

export function Ordered() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  const modifiedOrder = {
    ...order,
    data: { submitOrder: { status: "ok", orsId: "some-ors-id" } },
  };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Ordered</StoryTitle>
      <StoryDescription>
        When the order has successfully completed
      </StoryDescription>

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
    </div>
  );
}

export function OrderPolicyFail() {
  const [query, setQuery] = useState({ modal: "order" });

  const { work, user, order } = data;

  const modifiedUser = {
    ...user,
    agency: {
      branches: [
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
        },
      ],
    },
  };

  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Order Template</StoryTitle>
      <StoryDescription>
        If user has a long list of pickup points
      </StoryDescription>

      <Modal onClose={null} onLang={null} template={"order"}>
        <Order
          work={work}
          user={modifiedUser}
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
    </div>
  );
}

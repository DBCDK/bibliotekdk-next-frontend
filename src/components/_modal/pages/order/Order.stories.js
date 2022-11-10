import { StoryTitle, StoryDescription } from "@/storybook";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";

const exportedObject = {
  title: "modal/Order",
};

export default exportedObject;

/** ------------------------------------------------------- */
/** EditionComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function OrderPageComponentBuilder({ type = "Bog", storyNameOverride = null }) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Edition - {descriptionName}</StoryTitle>
      <StoryDescription>
        The Edition on the type: {descriptionName}
      </StoryDescription>
      <ReservationButton
        workId={"some-work-id"}
        selectedPids={["some-pid-0", "some-pid-1"]}
      />
      <Modal.Container>
        <Modal.Page id="order" component={Pages.Order} />
        {/*<Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />*/}
        {/*<Modal.Page id="pickup" component={Pages.Pickup} />*/}
        {/*<Modal.Page id="loanerform" component={Pages.Loanerform} />*/}
        <Modal.Page id="receipt" component={Pages.Receipt} />
        {/*<Modal.Page id="login" component={Pages.Login} />*/}
      </Modal.Container>
    </div>
  );
}

function OrderPageStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}Edition/work-of:870970-basis:${storyname}?modal=12312412`,
        query: query,
      },
    },
  };
}

function reservationButtonResolver(additionalResolver = {}) {
  return {
    // ReservationButton
    MaterialType: {
      specific: () => "Bog",
    },
    InterLibraryLoan: {
      loanIsPossible: () => true,
    },
    Access: {
      __resolveType: () => "InterLibraryLoan",
    },
    ...additionalResolver,
  };
}

function orderPageResolver(additionalArgs = {}, additionalResolver = {}) {
  return {
    // Order.Page
    Manifestation: {
      pid: () => additionalArgs.pid ?? "some-pid-0",
      publisher: () => additionalArgs.publisher ?? ["Sølvbakke"],
      creators: () => additionalArgs.creators ?? [{}],
      accessTypes: () => additionalArgs.accessTypes ?? ["fysisk"],
    },
    AccessType: {
      display: () => "fysisk",
    },
    ManifestationTitles: {
      full: () => additionalArgs.full ?? ["Hugo i Sølvskoven"],
    },
    Person: {
      display: () => "Linoleum Gummigulv",
    },
    PublicationYear: {
      display: () => "3001",
    },
    Edition: {
      edition: () => "109. udgave",
    },
    ...additionalResolver,
  };
}

function userResolver(additionalResolver = {}) {
  return {
    // USER:
    Branch: {
      name: () => "Bibliotekerne Sølvskoven",
      postalAddress: () => "Sølvskovvej 101",
      postalCode: () => "0090",
      city: () => "Træstubstrup",
      pickupAllowed: () => true,
      userParameters: () => [],
      branchId: () => "901902",
    },
    CheckOrderPolicy: {
      orderPossible: () => true,
    },
    ...additionalResolver,
  };
}

function mutationResolver(additionalResolver = {}) {
  return {
    // Mutation
    Mutation: {
      submitOrder: (args) => {
        const isValid = ["pids", "userParameters", "pickUpBranch"].every(
          (inputParam) => Object.keys(args.variables.input).includes(inputParam)
        );

        return {
          orderId: isValid ? "fiske-order-id" : "falsk-order-id",
        };
      },
    },
    SubmitOrder: {
      status: (args) => console.log("status: ", args),
      orderId: (args) => console.log("orderId: ", args),
    },
    ...additionalResolver,
  };
}

function baseResolvers(additionalResolvers = {}) {
  return {
    ...reservationButtonResolver(),
    ...orderPageResolver({ full: ["Hugo i Guldskoven"] }),
    ...userResolver(),
    ...mutationResolver(),
    ...additionalResolvers,
  };
}

function resolvers(storyname, additionalResolver = baseResolvers()) {
  return {
    ...OrderPageStoryBuilder(`${storyname}`, {
      ...additionalResolver,
    }),
  };
}

export function BogOrder() {
  return (
    <OrderPageComponentBuilder type={"Bog"} storyNameOverride={"BogOrder"} />
  );
}
BogOrder.story = {
  ...resolvers("BogOrder", {
    ...reservationButtonResolver(),
    ...orderPageResolver(),
    ...userResolver(),
    ...mutationResolver(),
  }),
};

// TODO: Overvej om tidligere stories er interessante
//  Måske vi hellere vil have nogle forskellige cases,
//  til når man trykker på OrderConfirmationButton-knappen...?
// export function ToggleOrder() {}
// export function Default() {}
// export function Loading() {}
// export function NoEmail() {}
// export function ManyPickupPoints() {}
// export function Ordering() {}
// export function Ordered() {}
// export function OrderPolicyFail() {}

// TODO: Implementer knap-cases:
// onArticleSubmit,
// onSubmit,
// fejlende udgaver,
// etc.

// TODO: Implementer visning af Order.page.
//  Dette bør gøres i del-komponenterne, men noter her:
// TODO: Edition
//  Done...?
// TODO: LocalizationsInformation.js cases:
// availableAsDigitalCopy || (!isAuthenticated && isDigitalCopy)
// (isLoadingBranches || pickupBranch)
// !isLoadingBranches && pickupBranch && !availableAsPhysicalCopy && !availableAsDigitalCopy
// TODO: OrdererInformation.js cases:
// (isLoadingBranches || name)
// (isLoadingBranches || (mail && lockedMessage && pickupBranch?.borrowerCheck))
// message
// (isLoadingBranches || (mail && lockedMessage && pickupBranch?.borrowerCheck)
// TODO: OrderConfirmation.js cases:
// actionMessage
// availableAsDigitalCopy
// !availableAsDigitalCopy && !availableAsPhysicalCopy
// isWorkLoading || isPickupBranchLoading

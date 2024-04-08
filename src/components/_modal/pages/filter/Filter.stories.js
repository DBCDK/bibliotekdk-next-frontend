import { useEffect } from "react";
import { StoryTitle, StoryDescription } from "@/storybook";

import FilterConnected, { Filter } from "./Filter.page";
import Modal, { useModal } from "@/components/_modal";

import useFilters from "@/components/hooks/useFilters";

import response from "./dummy.data";

const exportedObject = {
  title: "Modal/Filter",
};

export default exportedObject;

export function MobileFilter() {
  const { setStack } = useModal();

  const { filters, setFilters, setQuery } = useFilters();

  // data
  const data = response.data;

  // dummy context for filter
  const context = {};

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "filter", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page
        id="filter"
        component={Filter}
        // custom props
        data={data}
        selected={filters}
        onSelect={(selected) => setFilters({ ...filters, ...selected })}
        onSubmit={() => setQuery({ exclude: ["modal"] })}
        onClear={() => setFilters({})}
        origin="mobileFacets"
      />
    </Modal.Container>
  );
}

export function Connected() {
  const modal = useModal();
  return (
    <div>
      <StoryTitle>Filters</StoryTitle>
      <StoryDescription>
        Search filters open in a modal. Play around with it to see how it
        synchronizes with the url (on modal close).
      </StoryDescription>
      <button onClick={() => modal.push("filter")}>open filters</button>

      <Modal.Container>
        <Modal.Page id="filter" component={FilterConnected} />
      </Modal.Container>
    </div>
  );
}
Connected.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        SearchResponse: {
          // Base the hitcount on the selection of a specific subject
          hitcount: (args) =>
            args?.variables?.filters?.subjects?.includes("krimi") ? 8 : 20,

          // Return two facets
          facets: () => [...new Array(3).fill({})],
        },
        FacetResult: {
          // Return the names of the two facets
          name: ({ getNext }) => getNext(["subjects", "creators", "workTypes"]),

          // Let each facet have two values
          values: () => [...new Array(3).fill({})],
        },
        FacetValue: {
          term: ({ path, getNext }) =>
            path.includes("facets[0]")
              ? getNext(["krimi", "gys", "with, comma"])
              : getNext(["Hans Hansen", "Jens Jensen", "Ole Olesen"]),
          score: ({ getNext }) => getNext([8, 12, 2]),
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: { "q.all": "some query" },
    },
  },
};

export function Default() {
  const { setStack } = useModal();

  const { filters, setFilters, setQuery } = useFilters();

  // data
  const data = response.data;

  // dummy context for filter
  const context = {};

  // simulate order submit and callback
  useEffect(() => {
    setStack([{ id: "filter", context, active: true }]);
  }, []);

  return (
    <Modal.Container
      mock={{
        clear: () => alert("Luk"),
      }}
    >
      <Modal.Page
        id="filter"
        component={Filter}
        // custom props
        data={data}
        selected={filters}
        onSelect={(selected) => setFilters({ ...filters, ...selected })}
        onSubmit={() => setQuery({ exclude: ["modal"] })}
        onClear={() => setFilters({})}
      />
    </Modal.Container>
  );
}

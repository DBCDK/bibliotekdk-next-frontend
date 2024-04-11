import { StoryTitle, StoryDescription } from "@/storybook";

import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";

const exportedObject = {
  title: "AdvancedSearch/Combined search",
};

export function Default() {
  return (
    <div>
      <StoryTitle>CombinedSearch</StoryTitle>
      <StoryDescription>
        Combines multiple advanced search queries
      </StoryDescription>
      <div>
        <CombinedSearch queries={threeItems} />
      </div>
    </div>
  );
}

export function NoQueriesSelected() {
  return (
    <div>
      <StoryTitle>CombinedSearch</StoryTitle>
      <StoryDescription>If no queries are selected</StoryDescription>
      <div>
        <CombinedSearch />
      </div>
    </div>
  );
}
export function TooManySelectedQueries() {
  return (
    <div>
      <StoryTitle>CombinedSearch</StoryTitle>
      <StoryDescription>
        If user selectes more than the allowed number of queries to combine
      </StoryDescription>
      <div>
        <CombinedSearch queries={fiveItems} />
      </div>
    </div>
  );
}
const fiveItems = [
  {
    key: '(term.default="jul") AND ((phrase.generalmaterialtype="bøger"))',
    fieldSearch: {
      inputFields: [
        {
          value: "jul",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
      dropdownSearchIndices: [
        {
          searchIndex: "phrase.generalmaterialtype",
          value: [
            {
              value: "bøger",
              name: "bøger",
            },
          ],
        },
      ],
    },
    cql: '(term.default="jul") AND ((phrase.generalmaterialtype="bøger"))',
    selectedFacets: [],
    timestamp: "10.56",
    unixtimestamp: 1712739374712,
  },
  {
    key: '(term.default="amerikanske film")',
    fieldSearch: {
      inputFields: [
        {
          value: "amerikanske film",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
    },
    cql: '(term.default="amerikanske film")',
    selectedFacets: [],
  },
  {
    key: '(term.default="guitar")',
    fieldSearch: {
      inputFields: [
        {
          value: "guitar",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
    },
    cql: '(term.default="guitar")',
    selectedFacets: [],
  },
  {
    key: '(term.default="historie") AND ((phrase.generalmaterialtype="bøger"))',
    fieldSearch: {
      inputFields: [
        {
          value: "historie",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
      dropdownSearchIndices: [
        {
          searchIndex: "phrase.generalmaterialtype",
          value: [
            {
              value: "bøger",
              name: "bøger",
            },
          ],
        },
      ],
    },
    cql: '(term.default="historie") AND ((phrase.generalmaterialtype="bøger"))',
    selectedFacets: [],
  },
  {
    key: '(term.default="engelske film")',
    fieldSearch: {
      inputFields: [
        {
          value: "engelske film",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
    },
    cql: '(term.default="engelske film")',
    selectedFacets: [],
  },
];
const threeItems = [
  {
    key: '(term.default="amerikanske film")',
    fieldSearch: {
      inputFields: [
        {
          value: "amerikanske film",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
    },
    cql: '(term.default="amerikanske film")',
    selectedFacets: [],
  },
  {
    key: '(term.default="guitar")',
    fieldSearch: {
      inputFields: [
        {
          value: "guitar",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
    },
    cql: '(term.default="guitar")',
    selectedFacets: [],
  },
  {
    key: '(term.default="historie") AND ((phrase.generalmaterialtype="bøger"))',
    fieldSearch: {
      inputFields: [
        {
          value: "historie",
          prefixLogicalOperator: null,
          searchIndex: "term.default",
        },
      ],
      dropdownSearchIndices: [
        {
          searchIndex: "phrase.generalmaterialtype",
          value: [
            {
              value: "bøger",
              name: "bøger",
            },
          ],
        },
      ],
    },
    cql: '(term.default="historie") AND ((phrase.generalmaterialtype="bøger"))',
    selectedFacets: [],
  },
];
//[{"key":"(term.default=\"jul\") AND ((phrase.generalmaterialtype=\"bøger\"))","hitcount":9670,"fieldSearch":{"inputFields":[{"value":"jul","prefixLogicalOperator":null,"searchIndex":"term.default"}],"dropdownSearchIndices":[{"searchIndex":"phrase.generalmaterialtype","value":[{"value":"bøger","name":"bøger"}]}]},"cql":"(term.default=\"jul\") AND ((phrase.generalmaterialtype=\"bøger\"))","selectedFacets":[],"timestamp":"10.56","unixtimestamp":1712739374712},{"key":"(term.default=\"amerikanske film\")","hitcount":17640,"fieldSearch":{"inputFields":[{"value":"amerikanske film","prefixLogicalOperator":null,"searchIndex":"term.default"}]},"cql":"(term.default=\"amerikanske film\")","selectedFacets":[],"timestamp":"10.56","unixtimestamp":1712739363372},{"key":"(term.default=\"guitar\")","hitcount":46140,"fieldSearch":{"inputFields":[{"value":"guitar","prefixLogicalOperator":null,"searchIndex":"term.default"}]},"cql":"(term.default=\"guitar\")","selectedFacets":[],"timestamp":"10.55","unixtimestamp":1712739354486},{"key":"(term.default=\"engelske film\")","hitcount":20147,"fieldSearch":{"inputFields":[{"value":"engelske film","prefixLogicalOperator":null,"searchIndex":"term.default"}]},"cql":"(term.default=\"engelske film\")","selectedFacets":[],"timestamp":"10.55","unixtimestamp":1712739335809}];
export default exportedObject;

import Breadcrumbs, {
  Breadcrumbs as NamedBreadcrumbs,
} from "@/components/work/overview/breadcrumbs/Breadcrumbs";
import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/overview/Breadcrumbs",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

/** BreadcrumbsComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} breadcrumbsProps
 * @param {string} storyNameOverride
 */
function BreadcrumbsComponentBuilder({
  breadcrumbsProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Breadcrumbs - {descriptionName}</StoryTitle>
      <StoryDescription>
        The Breadcrumbs on the type: {descriptionName}
      </StoryDescription>
      <Breadcrumbs workId={breadcrumbsProps?.workId} />
    </div>
  );
}

export function BreadcrumbsAll3Present() {
  const breadcrumbsProps = {
    workId: "some-work-id-1",
  };

  return (
    <BreadcrumbsComponentBuilder
      breadcrumbsProps={breadcrumbsProps}
      storyNameOverride={"3 present"}
    />
  );
}
BreadcrumbsAll3Present.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function Breadcrumbs2presentNotGenreAndForm() {
  const breadcrumbsProps = {
    workId: "some-work-id-2",
  };

  return (
    <BreadcrumbsComponentBuilder
      breadcrumbsProps={breadcrumbsProps}
      storyNameOverride={"2 present - Not genreAndForm"}
    />
  );
}
Breadcrumbs2presentNotGenreAndForm.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
export function Breadcrumbs2presentNotFictionNonfiction() {
  const breadcrumbsProps = {
    workId: "some-work-id-3",
  };

  return (
    <BreadcrumbsComponentBuilder
      breadcrumbsProps={breadcrumbsProps}
      storyNameOverride={"2 present - Not fictionNonfiction"}
    />
  );
}
Breadcrumbs2presentNotFictionNonfiction.story = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
  }
);

export function BreadcrumbsNamed3elementsInArray() {
  const description = "Named - 3 elements in array";

  return (
    <div>
      <StoryTitle>Breadcrumbs - {description}</StoryTitle>
      <StoryDescription>
        The Breadcrumbs on the type: {description}
      </StoryDescription>
      <NamedBreadcrumbs>
        {["Bøger", "skønlitteratur", "roman"]}
      </NamedBreadcrumbs>
    </div>
  );
}

export function BreadcrumbsNamed2elementsInArray() {
  const description = "Named - 2 elements in array";

  return (
    <div>
      <StoryTitle>Breadcrumbs - {description}</StoryTitle>
      <StoryDescription>
        The Breadcrumbs on the type: {description}
      </StoryDescription>
      <NamedBreadcrumbs>{["Bøger", "skønlitteratur"]}</NamedBreadcrumbs>
    </div>
  );
}

export function BreadcrumbsNamed0elementsInArray() {
  const description = "Named - 0 elements in array";

  return (
    <div>
      <StoryTitle>Breadcrumbs - {description}</StoryTitle>
      <StoryDescription>
        The Breadcrumbs on the type: {description}
      </StoryDescription>
      <NamedBreadcrumbs>{[]}</NamedBreadcrumbs>
    </div>
  );
}

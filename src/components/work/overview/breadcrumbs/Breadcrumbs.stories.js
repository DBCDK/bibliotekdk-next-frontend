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
const BreadcrumbsAll3PresentStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
BreadcrumbsAll3Present.parameters = BreadcrumbsAll3PresentStory.parameters;
BreadcrumbsAll3Present.args = BreadcrumbsAll3PresentStory.args;
BreadcrumbsAll3Present.decorators = BreadcrumbsAll3PresentStory.decorators;
BreadcrumbsAll3Present.storyName =
  BreadcrumbsAll3PresentStory.name || BreadcrumbsAll3PresentStory.storyName;
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
const Breadcrumbs2presentNotGenreAndFormStory = merge(
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
Breadcrumbs2presentNotGenreAndForm.parameters =
  Breadcrumbs2presentNotGenreAndFormStory.parameters;
Breadcrumbs2presentNotGenreAndForm.args =
  Breadcrumbs2presentNotGenreAndFormStory.args;
Breadcrumbs2presentNotGenreAndForm.decorators =
  Breadcrumbs2presentNotGenreAndFormStory.decorators;
Breadcrumbs2presentNotGenreAndForm.storyName =
  Breadcrumbs2presentNotGenreAndFormStory.name ||
  Breadcrumbs2presentNotGenreAndFormStory.storyName;
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
const Breadcrumbs2presentNotFictionNonfictionStory = merge(
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
Breadcrumbs2presentNotFictionNonfiction.parameters =
  Breadcrumbs2presentNotFictionNonfictionStory.parameters;
Breadcrumbs2presentNotFictionNonfiction.args =
  Breadcrumbs2presentNotFictionNonfictionStory.args;
Breadcrumbs2presentNotFictionNonfiction.decorators =
  Breadcrumbs2presentNotFictionNonfictionStory.decorators;
Breadcrumbs2presentNotFictionNonfiction.storyName =
  Breadcrumbs2presentNotFictionNonfictionStory.name ||
  Breadcrumbs2presentNotFictionNonfictionStory.storyName;
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

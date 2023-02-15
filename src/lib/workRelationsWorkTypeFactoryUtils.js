import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import {
  flattenGroupedSortedManifestations,
  groupManifestations,
} from "@/lib/manifestationFactoryUtils";
import { RelationTypeEnum, WorkTypeEnum } from "@/lib/enums";
import uniq from "lodash/uniq";
import { pipe } from "@/lib/utils";

export function extractGoodCover(manifestations) {
  const covers = manifestations?.flatMap(
    (manifestation) => manifestation?.cover
  );

  const non_default_covers = covers?.filter(
    (cover) => cover.origin !== "default"
  );

  return non_default_covers?.length > 0
    ? non_default_covers?.[0]
    : covers?.[0] || [];
}

export function enrichArticleSeries(manifestations, parentWork) {
  const articleRelevant = manifestations.filter((manifestation) =>
    [RelationTypeEnum.CONTINUES.key, RelationTypeEnum.CONTINUEDIN.key].includes(
      manifestation?.relationType
    )
  );

  const continues = articleRelevant.filter(
    (manifestation) =>
      manifestation.relationType === RelationTypeEnum.CONTINUES.key
  );
  const continuedIn = articleRelevant.filter(
    (manifestation) =>
      manifestation.relationType === RelationTypeEnum.CONTINUEDIN.key
  );

  const parentRelationInput = {
    ...parentWork,
    relationType: "current",
    cover: extractGoodCover(parentWork?.manifestations?.mostRelevant),
  };

  return [...continues, ...[parentRelationInput], ...continuedIn].map(
    (manifestation) => {
      return manifestation;
      // TODO: Figure out if "partInSeries" can be given from JED
      // return { ...manifestation, partInSeries: `Del ${index + 1}` };
    }
  );
}

export function enrichMovie(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.ISADAPTATIONOF.key].includes(manifestation?.relationType)
  );
}

export function enrichDebateArticle(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.DISCUSSES.key, RelationTypeEnum.DISCUSSEDIN.key].includes(
      manifestation?.relationType
    )
  );
}

export function enrichLiterature(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.HASADAPTATION.key].includes(manifestation?.relationType)
  );
}

export function mapRelationTypes(manifestation) {
  return RelationTypeEnum[manifestation?.relationType?.toUpperCase()]?.workType;
}

export function enrichBySpecificWorkType(manifestations, work) {
  const relationTypes = uniq(manifestations.map(mapRelationTypes));

  const enrichMapper = {
    [WorkTypeEnum.ARTICLE]: () => enrichArticleSeries(manifestations, work),
    [WorkTypeEnum.MOVIE]: () => enrichMovie(manifestations),
    [WorkTypeEnum.DEBATEARTICLE]: () =>
      enrichDebateArticle(manifestations, work),
    [WorkTypeEnum.LITERATURE]: () => enrichLiterature(manifestations, work),
  };

  return relationTypes
    .map((relationType) => enrichMapper[relationType]?.())
    .filter(
      (manifestation) => manifestation && typeof manifestation !== "undefined"
    )
    .flat();
}

export function filterFieldsInElement(entry) {
  delete entry.ownerWork;
  delete entry.relations;

  return entry;
}

export function parseSingleRelation(manifestation, relationType) {
  return {
    ...manifestation,
    ...(relationType && { relationType: relationType }),
    ...(manifestation?.ownerWork?.workId && {
      workId: manifestation?.ownerWork?.workId,
    }),
  };
}

export function parseSingleManifestation(
  relationTypeArray,
  passedFunction = parseSingleRelation
) {
  return (
    relationTypeArray?.[1]?.map((manifestation) =>
      passedFunction(manifestation, relationTypeArray[0])
    ) || []
  );
}

function getAllWorksWithRelationTypeAndWorkId(work) {
  return (
    (work?.relations &&
      Object.entries(work?.relations)
        ?.map((relationTypeArray) =>
          parseSingleManifestation(relationTypeArray)
        )
        .flat()) ||
    []
  );
}

function getUniqWorkWithWorkId(manifestations) {
  return uniqWith(manifestations, (a, b) => isEqual(a.workId, b.workId));
}

export function parseRelations(work) {
  return pipe(work, [
    getAllWorksWithRelationTypeAndWorkId,
    getUniqWorkWithWorkId,
    (manifestations) => enrichBySpecificWorkType(manifestations, work),
    groupManifestations,
    flattenGroupedSortedManifestations,
    (manifestations) => manifestations.map(filterFieldsInElement),
  ]);
}

export function workRelationsWorkTypeFactory(work) {
  const parsedRelations = work && parseRelations(work);

  return {
    flatRelations: parsedRelations,
  };
}

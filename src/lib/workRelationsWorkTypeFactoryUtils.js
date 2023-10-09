import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import {
  flattenGroupedSortedManifestations,
  groupManifestations,
} from "@/lib/manifestationFactoryUtils";
import { RelationTypeEnum, WorkTypeEnum } from "@/lib/enums";
import uniq from "lodash/uniq";
import { chainFunctions, getWorkUrl } from "@/lib/utils";
import groupBy from "lodash/groupBy";
import merge from "lodash/merge";
import isEmpty from "lodash/isEmpty";

/**
 * Extract covers that are not default
 * @param manifestations
 * @returns {*|*[]}
 */
export function extractGoodCover(manifestations) {
  const covers = manifestations?.flatMap(
    (manifestation) => manifestation?.cover
  );

  const non_default_covers = covers?.filter(
    (cover) => cover?.origin !== "default"
  );

  return !isEmpty(non_default_covers)
    ? non_default_covers?.[0]
    : covers?.[0] || {};
}

/**
 * Enriches parent to follow thea same format as its relations
 * @param parentWork
 * @returns {(*&{relationType: string, cover: (*|*[]), generation: number, hostPublication: (*|{})})|{}}
 */
export function getParentRelationInput(parentWork) {
  if (!parentWork || isEmpty(parentWork)) {
    return {};
  }

  return {
    ...parentWork,
    relationType: "current",
    hostPublication:
      parentWork?.manifestations?.mostRelevant?.[0]?.hostPublication || {},
    cover: extractGoodCover(parentWork?.manifestations?.mostRelevant),
    generation: 0,
  };
}

/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function sortByDate(a, b) {
  const collator = Intl.Collator("da");

  return collator.compare(
    JSON.stringify(new Date(a?.hostPublication?.issue)),
    JSON.stringify(new Date(b?.hostPublication?.issue))
  );
}

/**
 * Used by {@link enrichArticleSeries} and {@link enrichDebateArticle} because the same logic is used
 * @param parentWork
 * @param articleRelevant
 * @returns {React.ReactElement | null}
 */
function enrichAnyArticleTypeSeries(parentWork, articleRelevant) {
  const parentRelationInput = getParentRelationInput(parentWork);

  const sortedManifestations = chainFunctions([getUniqWorkWithWorkId])([
    ...articleRelevant,
    ...[parentRelationInput],
  ]).sort(sortByDate);

  return sortedManifestations.map((manifestation) => {
    return manifestation;
    // TODO: Figure out if "partInSeries" can be given from JED
    // return { ...manifestation, partInSeries: `Del ${index + 1}` };
  });
}

/**
 * Article series needs to be enriched with data from ownerWork
 *  Article include relationType 'continues' and 'continuedIn'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @param parentWork
 * @returns {*[]}
 */
export function enrichArticleSeries(manifestations, parentWork) {
  const articleRelevant = manifestations.filter((manifestation) =>
    [RelationTypeEnum.CONTINUES.key, RelationTypeEnum.CONTINUEDIN.key].includes(
      manifestation?.relationType
    )
  );

  return enrichAnyArticleTypeSeries(parentWork, articleRelevant);
}

/**
 * Movies include relationTypes 'isAdaptationOf'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @returns {*[]}
 */
export function enrichMovie(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.ISADAPTATIONOF.key].includes(manifestation?.relationType)
  );
}

/**
 * DebateArticles include relationTypes 'discusses' and 'discussedIn'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @param parentWork
 * @returns {*[]}
 */
export function enrichDebateArticle(manifestations, parentWork) {
  const debateArticleRelevant = manifestations.filter((manifestation) =>
    [RelationTypeEnum.DISCUSSES.key, RelationTypeEnum.DISCUSSEDIN.key].includes(
      manifestation?.relationType
    )
  );

  return enrichAnyArticleTypeSeries(parentWork, debateArticleRelevant);
}

/**
 * Literature include relationTypes 'hasAdaptation'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @returns {*[]}
 */
export function enrichLiterature(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.HASADAPTATION.key].includes(manifestation?.relationType)
  );
}

/**
 * Returns a relationTypeEnum based on relationType of manifestation
 * @param manifestation
 * @returns {React.ReactElement | null}
 */
export function mapRelationWorkTypes(manifestation) {
  return RelationTypeEnum[manifestation?.relationType?.toUpperCase()]?.workType;
}

/**
 * Return a unique list of manifestations(Relations)
 *  enriched with relationType and linkToWork
 * @param manifestations
 * @param work
 * @returns {React.ReactElement | null}
 */
export function enrichBySpecificWorkType(manifestations, work) {
  const relationWorkTypes = uniq(manifestations.map(mapRelationWorkTypes));

  const enrichMapper = {
    [WorkTypeEnum.ARTICLE]: () => enrichArticleSeries(manifestations, work),
    [WorkTypeEnum.MOVIE]: () => enrichMovie(manifestations),
    [WorkTypeEnum.DEBATEARTICLE]: () =>
      enrichDebateArticle(manifestations, work),
    [WorkTypeEnum.LITERATURE]: () => enrichLiterature(manifestations),
  };

  return relationWorkTypes
    .map((relationWorkType) =>
      enrichMapper[relationWorkType]?.().map((manifestation) => {
        return {
          ...manifestation,
          relationWorkType: relationWorkType,
        };
      })
    )
    .filter(
      (manifestation) => manifestation && typeof manifestation !== "undefined"
    )
    .flat();
}

/**
 * Removes the ownerWork and relations of an object
 *  Used in {@link parseRelations}
 * @param entry
 * @returns {React.ReactElement | null}
 */
export function filterFieldsInElement(entry) {
  delete entry.ownerWork;
  delete entry.relations;
  delete entry.relationType;

  return entry;
}

/**
 * Parses a single Manifestation(relation) to have the
 *  fields needed by GUI
 * @param manifestation
 * @param relationType
 * @param generation
 * @returns {React.ReactElement | null}
 */
export function parseSingleRelation(manifestation, relationType, generation) {
  const workTitles = manifestation?.ownerWork?.titles;
  const workCreators = manifestation?.ownerWork?.creators;
  const workId = manifestation?.ownerWork?.workId;

  const linkToWork =
    workId &&
    workTitles?.full?.join(": ") &&
    workCreators?.[0]?.display &&
    getWorkUrl(
      workTitles?.full?.join(": "),
      workCreators,
      manifestation?.ownerWork?.workId
    );
  return {
    ...manifestation,
    ...(relationType && { relationType: relationType }),
    ...(workId && { workId: workId }),
    ...(linkToWork && { linkToWork: linkToWork }),
    ...(generation && { generation: generation }),
  };
}

/**
 * Parse manifestations in a single relation
 *  e.g. the 'continues'-relation can have
 *  3 manifestations
 * @param relationTypeArray
 * @param passedFunction
 * @returns {*|*[]}
 */
export function parseSingleRelationObject(
  relationTypeArray,
  passedFunction = (manifestation, relationType) =>
    parseSingleRelation(manifestation, relationType, 1)
) {
  return (
    relationTypeArray?.[1]?.map((manifestation) =>
      passedFunction(manifestation, relationTypeArray[0])
    ) || []
  );
}

/**
 * Centralise logic for creating relations as array
 * @param relations
 * @param parser
 * @returns {FlatArray<*, *>[]}
 */
export function getRelationsAsArray(
  relations,
  parser = (manifestation, relationType) =>
    parseSingleRelation(manifestation, relationType, 1)
) {
  return (
    relations &&
    Object.entries(relations)
      ?.map((relationTypeArray) =>
        parseSingleRelationObject(relationTypeArray, parser)
      )
      .flat()
  );
}

/**
 * Gives the flattened relations and parses them to
 *  provide them with e.g. relationType and ownerWork workId
 * @param relations
 * @returns {*[]}
 */
function getAllWorksWithRelationTypeAndWorkId(relations) {
  const relationsArray_generation_1 = getRelationsAsArray(relations);

  const relationArray_generation_1_merged =
    relationsArray_generation_1 &&
    merge(
      ...relationsArray_generation_1
        ?.map((relation) => relation?.ownerWork?.relations)
        .filter((rel) => typeof rel !== "undefined")
        .flat()
    );

  const relations_generation_2 = getRelationsAsArray(
    relationArray_generation_1_merged,
    (manifestation, relationType) =>
      parseSingleRelation(manifestation, relationType, 2)
  );

  return [
    ...(relationsArray_generation_1 ? relationsArray_generation_1 : []),
    ...(relations_generation_2 ? relations_generation_2 : []),
  ];
}

/**
 * Filter unique relations by workId and relationType
 *  TODO: Figure out if this is the business logic we need?!
 * @param manifestations
 * @returns {React.ReactElement | null}
 */
export function getUniqWorkWithWorkId(manifestations) {
  return uniqWith(
    // We sort by generation, to ensure that closest descendent is the one
    //  chosen by `uniqWith`
    manifestations.sort((a, b) => (a?.generation || 0) - b?.generation),
    (a, b) => isEqual(a.workId, b.workId)
  );
}

/**
 * Parses relations from a given work by
 *  workType and relationType. Uses some functions:
 *  - {@link getAllWorksWithRelationTypeAndWorkId}
 *  - {@link getUniqWorkWithWorkId}
 *  - {@link enrichBySpecificWorkType}
 *  - {@link groupManifestations}
 *  - {@link flattenGroupedSortedManifestations (from manifestationFactoryUtils}}
 *  - {@link filterFieldsInElement}
 * @param work
 * @returns {React.ReactElement | null}
 */
export function parseRelations(work) {
  return chainFunctions([
    (work) => getAllWorksWithRelationTypeAndWorkId(work?.relations),
    getUniqWorkWithWorkId,
    (manifestations) => enrichBySpecificWorkType(manifestations, work),
    groupManifestations,
    flattenGroupedSortedManifestations,
    (manifestations) => manifestations.map(filterFieldsInElement),
  ])(work);
}

/**
 * Returns the factory given work
 * - flatRelations derived from {@link parseRelations}
 * @param work
 * @returns {{groupedRelations, groupedByRelationWorkTypes, flatRelations: *}}
 */
export function workRelationsWorkTypeFactory(work) {
  const parsedRelations = work && parseRelations(work);

  return {
    groupedByRelationWorkTypes: groupBy(parsedRelations, "relationWorkType"),
    groupedRelations: groupBy(parsedRelations, "relationType"),
    flatRelations: parsedRelations,
  };
}

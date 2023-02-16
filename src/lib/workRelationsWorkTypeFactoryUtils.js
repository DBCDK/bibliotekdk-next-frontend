import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";
import {
  flattenGroupedSortedManifestations,
  groupManifestations,
} from "@/lib/manifestationFactoryUtils";
import { RelationTypeEnum, WorkTypeEnum } from "@/lib/enums";
import uniq from "lodash/uniq";
import { chainFunctions, encodeTitleCreator } from "@/lib/utils";

/**
 * Extract covers that are not default
 * @param manifestations
 * @return {*|*[]}
 */
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

/**
 * Article series needs to be enriched with data from ownerWork
 *  Article include relationType 'continues' and 'continuedIn'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @param parentWork
 * @return {*[]}
 */
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

/**
 * Movies include relationTypes 'isAdaptationOf'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @return {*[]}
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
 * @return {*[]}
 */
export function enrichDebateArticle(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.DISCUSSES.key, RelationTypeEnum.DISCUSSEDIN.key].includes(
      manifestation?.relationType
    )
  );
}

/**
 * Literature include relationTypes 'hasAdaptation'
 *  Used in {@link enrichBySpecificWorkType}
 * @param manifestations
 * @return {*[]}
 */
export function enrichLiterature(manifestations) {
  return manifestations.filter((manifestation) =>
    [RelationTypeEnum.HASADAPTATION.key].includes(manifestation?.relationType)
  );
}

/**
 * Returns a relationTypeEnum based on relationType of manifestation
 * @param manifestation
 * @return {*}
 */
export function mapRelationTypes(manifestation) {
  return RelationTypeEnum[manifestation?.relationType?.toUpperCase()]?.workType;
}

/**
 * Return a unique list of manifestations(Relations)
 *  enriched with relationType and linkToWork
 * @param manifestations
 * @param work
 * @return {*}
 */
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

/**
 * Removes the ownerWork and relations of an object
 *  Used in {@link parseRelations}
 * @param entry
 * @return {*}
 */
export function filterFieldsInElement(entry) {
  delete entry.ownerWork;
  delete entry.relations;

  return entry;
}

/**
 * Parses a single Manifestation(relation) to have the
 *  fields needed by GUI
 * @param manifestation
 * @param relationType
 * @return {*}
 */
export function parseSingleRelation(manifestation, relationType) {
  const workTitles = manifestation?.ownerWork?.titles;
  const workCreators = manifestation?.ownerWork?.creators;
  const workId = manifestation?.ownerWork?.workId;

  const linkToWork =
    workId &&
    workTitles?.full?.join(": ") &&
    workCreators?.[0]?.display &&
    `materiale/${encodeTitleCreator(
      workTitles?.full?.join(": "),
      workCreators?.[0]?.display
    )}/${manifestation?.ownerWork?.workId}`;

  return {
    ...manifestation,
    ...(relationType && { relationType: relationType }),
    ...(workId && { workId: workId }),
    ...(linkToWork && { linkToWork: linkToWork }),
  };
}

/**
 * Parse manifestations in a single relation
 *  e.g. the 'continues'-relation can have
 *  3 manifestations
 * @param relationTypeArray
 * @param passedFunction
 * @return {*|*[]}
 */
export function parseSingleRelationObject(
  relationTypeArray,
  passedFunction = parseSingleRelation
) {
  return (
    relationTypeArray?.[1]?.map((manifestation) =>
      passedFunction(manifestation, relationTypeArray[0])
    ) || []
  );
}

/**
 * Gives the flattened relations and parses them to
 *  provide them with e.g. relationType and ownerWork workId
 * @param work
 * @return {[{hej: number}]|[{hej: number}]|[{hej: number}]|*|FlatArray<*, *>[]|*[]}
 */
function getAllWorksWithRelationTypeAndWorkId(work) {
  return (
    (work?.relations &&
      Object.entries(work?.relations)
        ?.map((relationTypeArray) =>
          parseSingleRelationObject(relationTypeArray)
        )
        .flat()) ||
    []
  );
}

/**
 * Filter unique relations by workId and relationType
 *  TODO: Figure out if this is the business logic we need?!
 * @param manifestations
 * @return {*}
 */
function getUniqWorkWithWorkId(manifestations) {
  return uniqWith(
    manifestations,
    (a, b) =>
      isEqual(a.workId, b.workId) && isEqual(a.relationType, b.relationType)
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
 * @return {*}
 */
export function parseRelations(work) {
  return chainFunctions([
    getAllWorksWithRelationTypeAndWorkId,
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
 * @return {{flatRelations: *}}
 */
export function workRelationsWorkTypeFactory(work) {
  const parsedRelations = work && parseRelations(work);

  return {
    flatRelations: parsedRelations,
  };
}

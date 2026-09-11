/**
 * @file
 * Field registry for AI search v4.
 *
 * v4 deliberately offers the model a *smaller* set of indexes than v3:
 *
 *  - people are always `creatorcontributor`. The v3 split between `creator`
 *    (author/director) and `contributor` (actor/translator/narrator) forced
 *    the model to guess a role it usually cannot know from the prompt, and a
 *    wrong guess means zero hits. `creatorcontributor` matches both roles.
 *  - `issn` and `dk5` are gone. Users do not type ISSNs or DK5 codes in
 *    natural language, and the model occasionally mistook other numbers for
 *    them.
 *
 * Everything else is the v3 registry, reused as-is, so the compiler and the
 * controlled vocabulary behave exactly like they do in v3/v3.1/v3.2.
 */

import {
  EQ_OPS,
  FIELDS as BASE_FIELDS,
  FIELD_ALIASES as BASE_FIELD_ALIASES,
  KIND,
  RANGE_OPS,
  normalizeFieldName as baseNormalizeFieldName,
} from "../indexes";

/** Fields from the v3 registry that v4 does not expose. */
export const REMOVED_FIELDS = Object.freeze([
  "creator",
  "contributor",
  "issn",
  "dk5",
]);

/** Where a removed field's values go instead (used for the alias table). */
const REPLACEMENTS = Object.freeze({
  creator: "creatorcontributor",
  contributor: "creatorcontributor",
});

const removed = new Set(REMOVED_FIELDS);

/**
 * v4 field registry: the v3 registry minus REMOVED_FIELDS, with a
 * creatorcontributor description that covers every role.
 *
 * @type {Object<string, import("../indexes").FieldDef>}
 */
export const FIELDS = Object.freeze(
  Object.fromEntries(
    Object.entries(BASE_FIELDS)
      .filter(([name]) => !removed.has(name))
      .map(([name, def]) =>
        name === "creatorcontributor"
          ? [
              name,
              Object.freeze({
                ...def,
                doc: 'Any person or corporation involved in the material: author, artist, composer, director, actor, translator, narrator, illustrator ("af X", "by X", "med X"). The ONLY person field – never split creator and contributor. Write the name as the user wrote it; the server looks it up in the catalogue.',
                example: "kim leine",
              }),
            ]
          : [name, def]
      )
  )
);

export const FIELD_NAMES = Object.freeze(Object.keys(FIELDS));

/**
 * v4 alias table: the v3 aliases with every target that points at a removed
 * field redirected to its replacement, plus the removed field names
 * themselves as aliases (the model may still emit "creator").
 */
export const FIELD_ALIASES = Object.freeze({
  ...Object.fromEntries(
    Object.entries(BASE_FIELD_ALIASES)
      .map(([alias, target]) => [alias, REPLACEMENTS[target] ?? target])
      .filter(([, target]) => target in FIELDS)
  ),
  ...REPLACEMENTS,
  creators: "creatorcontributor",
  contributors: "creatorcontributor",
  person: "creatorcontributor",
  composer: "creatorcontributor",
  musician: "creatorcontributor",
});

/**
 * Normalizes a field name from the model against the v4 registry.
 *
 * @param {string} raw
 * @returns {string|null}
 */
export function normalizeFieldName(raw) {
  return baseNormalizeFieldName(raw, {
    fields: FIELDS,
    aliases: FIELD_ALIASES,
  });
}

export { EQ_OPS, KIND, RANGE_OPS };

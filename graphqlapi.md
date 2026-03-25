# bibliotekdkCms exposed schema

This is the schema shape exposed by this API under the `bibliotekdkCms` namespace. It reflects the allowlist in `src/schema/external/bibliotekdkCms.js` and applies the same namespacing convention as the gateway.

## Entry point

```graphql
type Query {
  bibliotekdkCms: BibliotekdkCms
}

type BibliotekdkCms {
  faq(documentId: ID!, status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean): BibliotekdkCmsFaq
  faqs(filters: BibliotekdkCmsFaqFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = [], status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean): [BibliotekdkCmsFaq]!
  article(documentId: ID!, status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean, locale: BibliotekdkCmsI18NLocaleCode): BibliotekdkCmsArticle
  articles(filters: BibliotekdkCmsArticleFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = [], status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean, locale: BibliotekdkCmsI18NLocaleCode): [BibliotekdkCmsArticle]!
  notification(documentId: ID!, status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean, locale: BibliotekdkCmsI18NLocaleCode): BibliotekdkCmsNotification
  notifications(filters: BibliotekdkCmsNotificationFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = [], status: BibliotekdkCmsPublicationStatus = PUBLISHED, hasPublishedVersion: Boolean, locale: BibliotekdkCmsI18NLocaleCode): [BibliotekdkCmsNotification]!
}

type BibliotekdkCmsArticle {
  documentId: ID!
  title: String!
  subheadline: String
  image: BibliotekdkCmsUploadFile
  body: String
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
  locale: String
  localizations_connection(filters: BibliotekdkCmsArticleFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): BibliotekdkCmsArticleRelationResponseCollection
  localizations(filters: BibliotekdkCmsArticleFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsArticle]!
}

input BibliotekdkCmsArticleFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  title: BibliotekdkCmsStringFilterInput
  subheadline: BibliotekdkCmsStringFilterInput
  body: BibliotekdkCmsStringFilterInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  locale: BibliotekdkCmsStringFilterInput
  localizations: BibliotekdkCmsArticleFiltersInput
  and: [BibliotekdkCmsArticleFiltersInput]
  or: [BibliotekdkCmsArticleFiltersInput]
  not: BibliotekdkCmsArticleFiltersInput
}

type BibliotekdkCmsArticleRelationResponseCollection {
  nodes: [BibliotekdkCmsArticle!]!
}

input BibliotekdkCmsBooleanFilterInput {
  and: [Boolean]
  or: [Boolean]
  not: BibliotekdkCmsBooleanFilterInput
  eq: Boolean
  eqi: Boolean
  ne: Boolean
  nei: Boolean
  startsWith: Boolean
  endsWith: Boolean
  contains: Boolean
  notContains: Boolean
  containsi: Boolean
  notContainsi: Boolean
  gt: Boolean
  gte: Boolean
  lt: Boolean
  lte: Boolean
  null: Boolean
  notNull: Boolean
  in: [Boolean]
  notIn: [Boolean]
  between: [Boolean]
}

type BibliotekdkCmsComponentTranslationsContext {
  id: ID!
  key: String
  labels(filters: BibliotekdkCmsComponentTranslationsLabelFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsComponentTranslationsLabel]
}

input BibliotekdkCmsComponentTranslationsContextFiltersInput {
  key: BibliotekdkCmsStringFilterInput
  labels: BibliotekdkCmsComponentTranslationsLabelFiltersInput
  and: [BibliotekdkCmsComponentTranslationsContextFiltersInput]
  or: [BibliotekdkCmsComponentTranslationsContextFiltersInput]
  not: BibliotekdkCmsComponentTranslationsContextFiltersInput
}

type BibliotekdkCmsComponentTranslationsLabel {
  id: ID!
  key: String
  da: String
  en: String
}

input BibliotekdkCmsComponentTranslationsLabelFiltersInput {
  key: BibliotekdkCmsStringFilterInput
  da: BibliotekdkCmsStringFilterInput
  en: BibliotekdkCmsStringFilterInput
  and: [BibliotekdkCmsComponentTranslationsLabelFiltersInput]
  or: [BibliotekdkCmsComponentTranslationsLabelFiltersInput]
  not: BibliotekdkCmsComponentTranslationsLabelFiltersInput
}

scalar BibliotekdkCmsDateTime

input BibliotekdkCmsDateTimeFilterInput {
  and: [BibliotekdkCmsDateTime]
  or: [BibliotekdkCmsDateTime]
  not: BibliotekdkCmsDateTimeFilterInput
  eq: BibliotekdkCmsDateTime
  eqi: BibliotekdkCmsDateTime
  ne: BibliotekdkCmsDateTime
  nei: BibliotekdkCmsDateTime
  startsWith: BibliotekdkCmsDateTime
  endsWith: BibliotekdkCmsDateTime
  contains: BibliotekdkCmsDateTime
  notContains: BibliotekdkCmsDateTime
  containsi: BibliotekdkCmsDateTime
  notContainsi: BibliotekdkCmsDateTime
  gt: BibliotekdkCmsDateTime
  gte: BibliotekdkCmsDateTime
  lt: BibliotekdkCmsDateTime
  lte: BibliotekdkCmsDateTime
  null: Boolean
  notNull: Boolean
  in: [BibliotekdkCmsDateTime]
  notIn: [BibliotekdkCmsDateTime]
  between: [BibliotekdkCmsDateTime]
}

enum BibliotekdkCmsENUM_NOTIFICATION_TYPE {
  warning
  error
  info
  success
}

type BibliotekdkCmsFaq {
  documentId: ID!
  title: String!
  body: String
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsFaqFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  title: BibliotekdkCmsStringFilterInput
  body: BibliotekdkCmsStringFilterInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsFaqFiltersInput]
  or: [BibliotekdkCmsFaqFiltersInput]
  not: BibliotekdkCmsFaqFiltersInput
}

union BibliotekdkCmsGenericMorph = BibliotekdkCmsComponentTranslationsLabel | BibliotekdkCmsComponentTranslationsContext | BibliotekdkCmsUploadFile | BibliotekdkCmsI18NLocale | BibliotekdkCmsReviewWorkflowsWorkflow | BibliotekdkCmsReviewWorkflowsWorkflowStage | BibliotekdkCmsUsersPermissionsPermission | BibliotekdkCmsUsersPermissionsRole | BibliotekdkCmsUsersPermissionsUser | BibliotekdkCmsArticle | BibliotekdkCmsFaq | BibliotekdkCmsNotification | BibliotekdkCmsTranslation

type BibliotekdkCmsI18NLocale {
  documentId: ID!
  name: String
  code: String
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

scalar BibliotekdkCmsI18NLocaleCode

input BibliotekdkCmsIDFilterInput {
  and: [ID]
  or: [ID]
  not: BibliotekdkCmsIDFilterInput
  eq: ID
  eqi: ID
  ne: ID
  nei: ID
  startsWith: ID
  endsWith: ID
  contains: ID
  notContains: ID
  containsi: ID
  notContainsi: ID
  gt: ID
  gte: ID
  lt: ID
  lte: ID
  null: Boolean
  notNull: Boolean
  in: [ID]
  notIn: [ID]
  between: [ID]
}

scalar BibliotekdkCmsJSON

input BibliotekdkCmsJSONFilterInput {
  and: [BibliotekdkCmsJSON]
  or: [BibliotekdkCmsJSON]
  not: BibliotekdkCmsJSONFilterInput
  eq: BibliotekdkCmsJSON
  eqi: BibliotekdkCmsJSON
  ne: BibliotekdkCmsJSON
  nei: BibliotekdkCmsJSON
  startsWith: BibliotekdkCmsJSON
  endsWith: BibliotekdkCmsJSON
  contains: BibliotekdkCmsJSON
  notContains: BibliotekdkCmsJSON
  containsi: BibliotekdkCmsJSON
  notContainsi: BibliotekdkCmsJSON
  gt: BibliotekdkCmsJSON
  gte: BibliotekdkCmsJSON
  lt: BibliotekdkCmsJSON
  lte: BibliotekdkCmsJSON
  null: Boolean
  notNull: Boolean
  in: [BibliotekdkCmsJSON]
  notIn: [BibliotekdkCmsJSON]
  between: [BibliotekdkCmsJSON]
}

type BibliotekdkCmsNotification {
  documentId: ID!
  title: String
  text: String
  type: BibliotekdkCmsENUM_NOTIFICATION_TYPE
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
  locale: String
  localizations_connection(filters: BibliotekdkCmsNotificationFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): BibliotekdkCmsNotificationRelationResponseCollection
  localizations(filters: BibliotekdkCmsNotificationFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsNotification]!
}

input BibliotekdkCmsNotificationFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  title: BibliotekdkCmsStringFilterInput
  text: BibliotekdkCmsStringFilterInput
  type: BibliotekdkCmsStringFilterInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  locale: BibliotekdkCmsStringFilterInput
  localizations: BibliotekdkCmsNotificationFiltersInput
  and: [BibliotekdkCmsNotificationFiltersInput]
  or: [BibliotekdkCmsNotificationFiltersInput]
  not: BibliotekdkCmsNotificationFiltersInput
}

type BibliotekdkCmsNotificationRelationResponseCollection {
  nodes: [BibliotekdkCmsNotification!]!
}

input BibliotekdkCmsPaginationArg {
  page: Int
  pageSize: Int
  start: Int
  limit: Int
}

enum BibliotekdkCmsPublicationStatus {
  DRAFT
  PUBLISHED
}

type BibliotekdkCmsReviewWorkflowsWorkflow {
  documentId: ID!
  name: String!
  stages_connection(filters: BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): BibliotekdkCmsReviewWorkflowsWorkflowStageRelationResponseCollection
  stages(filters: BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsReviewWorkflowsWorkflowStage]!
  stageRequiredToPublish: BibliotekdkCmsReviewWorkflowsWorkflowStage
  contentTypes: BibliotekdkCmsJSON!
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsReviewWorkflowsWorkflowFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  name: BibliotekdkCmsStringFilterInput
  stages: BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput
  stageRequiredToPublish: BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput
  contentTypes: BibliotekdkCmsJSONFilterInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsReviewWorkflowsWorkflowFiltersInput]
  or: [BibliotekdkCmsReviewWorkflowsWorkflowFiltersInput]
  not: BibliotekdkCmsReviewWorkflowsWorkflowFiltersInput
}

type BibliotekdkCmsReviewWorkflowsWorkflowStage {
  documentId: ID!
  name: String
  color: String
  workflow: BibliotekdkCmsReviewWorkflowsWorkflow
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  name: BibliotekdkCmsStringFilterInput
  color: BibliotekdkCmsStringFilterInput
  workflow: BibliotekdkCmsReviewWorkflowsWorkflowFiltersInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput]
  or: [BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput]
  not: BibliotekdkCmsReviewWorkflowsWorkflowStageFiltersInput
}

type BibliotekdkCmsReviewWorkflowsWorkflowStageRelationResponseCollection {
  nodes: [BibliotekdkCmsReviewWorkflowsWorkflowStage!]!
}

input BibliotekdkCmsStringFilterInput {
  and: [String]
  or: [String]
  not: BibliotekdkCmsStringFilterInput
  eq: String
  eqi: String
  ne: String
  nei: String
  startsWith: String
  endsWith: String
  contains: String
  notContains: String
  containsi: String
  notContainsi: String
  gt: String
  gte: String
  lt: String
  lte: String
  null: Boolean
  notNull: Boolean
  in: [String]
  notIn: [String]
  between: [String]
}

type BibliotekdkCmsTranslation {
  documentId: ID!
  contexts(filters: BibliotekdkCmsComponentTranslationsContextFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsComponentTranslationsContext]
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

type BibliotekdkCmsUploadFile {
  documentId: ID!
  name: String!
  alternativeText: String
  caption: String
  focalPoint: BibliotekdkCmsJSON
  width: Int
  height: Int
  formats: BibliotekdkCmsJSON
  hash: String!
  ext: String
  mime: String!
  size: Float!
  url: String!
  previewUrl: String
  provider: String!
  provider_metadata: BibliotekdkCmsJSON
  related: [BibliotekdkCmsGenericMorph]
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

type BibliotekdkCmsUsersPermissionsPermission {
  documentId: ID!
  action: String!
  role: BibliotekdkCmsUsersPermissionsRole
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsUsersPermissionsPermissionFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  action: BibliotekdkCmsStringFilterInput
  role: BibliotekdkCmsUsersPermissionsRoleFiltersInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsUsersPermissionsPermissionFiltersInput]
  or: [BibliotekdkCmsUsersPermissionsPermissionFiltersInput]
  not: BibliotekdkCmsUsersPermissionsPermissionFiltersInput
}

type BibliotekdkCmsUsersPermissionsPermissionRelationResponseCollection {
  nodes: [BibliotekdkCmsUsersPermissionsPermission!]!
}

type BibliotekdkCmsUsersPermissionsRole {
  documentId: ID!
  name: String!
  description: String
  type: String
  permissions_connection(filters: BibliotekdkCmsUsersPermissionsPermissionFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): BibliotekdkCmsUsersPermissionsPermissionRelationResponseCollection
  permissions(filters: BibliotekdkCmsUsersPermissionsPermissionFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsUsersPermissionsPermission]!
  users_connection(filters: BibliotekdkCmsUsersPermissionsUserFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): BibliotekdkCmsUsersPermissionsUserRelationResponseCollection
  users(filters: BibliotekdkCmsUsersPermissionsUserFiltersInput, pagination: BibliotekdkCmsPaginationArg = {}, sort: [String] = []): [BibliotekdkCmsUsersPermissionsUser]!
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsUsersPermissionsRoleFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  name: BibliotekdkCmsStringFilterInput
  description: BibliotekdkCmsStringFilterInput
  type: BibliotekdkCmsStringFilterInput
  permissions: BibliotekdkCmsUsersPermissionsPermissionFiltersInput
  users: BibliotekdkCmsUsersPermissionsUserFiltersInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsUsersPermissionsRoleFiltersInput]
  or: [BibliotekdkCmsUsersPermissionsRoleFiltersInput]
  not: BibliotekdkCmsUsersPermissionsRoleFiltersInput
}

type BibliotekdkCmsUsersPermissionsUser {
  documentId: ID!
  username: String!
  email: String!
  provider: String
  confirmed: Boolean
  blocked: Boolean
  role: BibliotekdkCmsUsersPermissionsRole
  createdAt: BibliotekdkCmsDateTime
  updatedAt: BibliotekdkCmsDateTime
  publishedAt: BibliotekdkCmsDateTime
}

input BibliotekdkCmsUsersPermissionsUserFiltersInput {
  documentId: BibliotekdkCmsIDFilterInput
  username: BibliotekdkCmsStringFilterInput
  email: BibliotekdkCmsStringFilterInput
  provider: BibliotekdkCmsStringFilterInput
  confirmed: BibliotekdkCmsBooleanFilterInput
  blocked: BibliotekdkCmsBooleanFilterInput
  role: BibliotekdkCmsUsersPermissionsRoleFiltersInput
  createdAt: BibliotekdkCmsDateTimeFilterInput
  updatedAt: BibliotekdkCmsDateTimeFilterInput
  publishedAt: BibliotekdkCmsDateTimeFilterInput
  and: [BibliotekdkCmsUsersPermissionsUserFiltersInput]
  or: [BibliotekdkCmsUsersPermissionsUserFiltersInput]
  not: BibliotekdkCmsUsersPermissionsUserFiltersInput
}

type BibliotekdkCmsUsersPermissionsUserRelationResponseCollection {
  nodes: [BibliotekdkCmsUsersPermissionsUser!]!
}
```

import {
  CHANGE_SEARCH_FIELD_USERS_FILE,
  CHANGE_SEARCH_FIELD_USERS_DATABASE,
  CHANGE_SEARCH_FIELD_USERS_PP,
  CHANGE_SEARCH_FIELD_DOCS,
  CHANGE_COCHE_LIST_DOCS,
} from './constants.js';

export const setSearchFieldUsersFile = (text) => ({
  type: CHANGE_SEARCH_FIELD_USERS_FILE,
  payload: text
})

export const setSearchFieldUsersDatabase = (text) => ({
  type: CHANGE_SEARCH_FIELD_USERS_DATABASE,
  payload: text
})

export const setSearchFieldUsersPP = (text) => ({
  type: CHANGE_SEARCH_FIELD_USERS_PP,
  payload: text
})

export const setSearchFieldDocs = (text) => ({
  type: CHANGE_SEARCH_FIELD_DOCS,
  payload: text
})

export const setCocheListeDocs = (obj) => ({
  type: CHANGE_COCHE_LIST_DOCS,
  payload: obj
})

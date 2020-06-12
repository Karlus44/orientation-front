import {
  CHANGE_SEARCH_FIELD_USERS_FILE,
  CHANGE_SEARCH_FIELD_USERS_DATABASE,
  CHANGE_SEARCH_FIELD_USERS_PP,
  CHANGE_SEARCH_FIELD_DOCS,
  CHANGE_COCHE_LIST_DOCS,
} from './constants.js';

const initialUsersStateFile = {
  searchfieldUsersFile : ''
}
const initialUsersStateData = {
  searchfieldUsersDatabase : ''
}
const initialUsersStatePP = {
  searchfieldUsersPP : ''
}

const initialDocsState = {
  searchfieldDocs : ''
}

const initialCocheListDocs = {
  cochelisteDocs : {}
}

export const sortUsersFile = (state=initialUsersStateFile, action={}) => {
  switch (action.type) {
    case CHANGE_SEARCH_FIELD_USERS_FILE:
        return Object.assign({},state,{searchfieldUsersFile: action.payload});

    default:
        return state;
  }
}

export const sortUsersData = (state=initialUsersStateData, action={}) => {
  switch (action.type) {
    case CHANGE_SEARCH_FIELD_USERS_DATABASE:
        return Object.assign({},state,{searchfieldUsersDatabase: action.payload});
    default:
        return state;
  }
}

export const sortUsersPP = (state=initialUsersStatePP, action={}) => {
  switch (action.type) {
    case CHANGE_SEARCH_FIELD_USERS_PP:
        return Object.assign({},state,{searchfieldUsersPP: action.payload});
    default:
        return state;
  }
}

export const sortDocs = (state=initialDocsState, action={}) => {
  switch (action.type) {
    case CHANGE_SEARCH_FIELD_DOCS:
        return Object.assign({},state,{searchfieldDocs: action.payload});
    default:
        return state;
  }
}

export const listeDocs = (state=initialCocheListDocs, action={}) => {
  switch (action.type) {
    case CHANGE_COCHE_LIST_DOCS:
        return Object.assign({},state,{cochelisteDocs: action.payload});
    default:
        return state;
  }
}

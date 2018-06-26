// Custom Action
import { UsersActionTypes, UsersActionAll } from '../actions';

// Model
import { UserState } from '../datatypes';

export const initialState: UserState = {username: null, id: null, whiteList: [], blackList: [], contact: []};

export function reducer(state = initialState, action: UsersActionAll): UserState {
    switch (action.type) {
        case UsersActionTypes.ACCOUNTS_READ_SUCCESS: {
            return {...state, id: action.payload.id, username: action.payload.username};
        }
        case UsersActionTypes.WHITELIST_READ_SUCCESS: {
            return {...state, whiteList: action.payload};
        }

        case UsersActionTypes.WHITELIST_ADD:
        case UsersActionTypes.BLACKLIST_ADD: {
            return {...state, inProgress: true, isError: false,  error: ''};
        }

        case UsersActionTypes.WHITELIST_ADD_SUCCESS: {
            if (!state.whiteList) {
                state.whiteList = [];
            }
            return {
                ...state,
                whiteList: state.whiteList.concat(action.payload),
                inProgress: false,
                isError: false,
                error: '',
            };
        }

        case UsersActionTypes.WHITELIST_ADD_ERROR:
        case UsersActionTypes.BLACKLIST_ADD_ERROR: {
            return {
                ...state,
                inProgress: false,
                isError: true,
                error: action.payload.error && action.payload.error.non_field_errors ? action.payload.error.non_field_errors[0] : '',
            };
        }

        case UsersActionTypes.BLACKLIST_READ_SUCCESS: {
            return {...state, blackList: action.payload};
        }
        case UsersActionTypes.BLACKLIST_ADD_SUCCESS: {
            if (!state.blackList) {
                state.blackList = [];
            }
            return {
                ...state,
                blackList: state.blackList.concat(action.payload),
                inProgress: false,
                isError: false,
            };
        }
        case UsersActionTypes.CONTACT_GET_SUCCESS: {
            return {...state, contact: action.payload};
        }
        case UsersActionTypes.CONTACT_DELETE:
        case UsersActionTypes.CONTACT_ADD: {
            return {...state, inProgress: true, isError: false};
        }
        case UsersActionTypes.CONTACT_ADD_SUCCESS: {
            if (action.payload.isUpdating) {
                const contact = state.contact.filter(item => item.id === action.payload.id)[0];
                contact.note = action.payload.note;
                contact.address = action.payload.address;
                contact.phone = action.payload.phone;
                contact.phone2 = action.payload.phone2;
                contact.email = action.payload.email;
                contact.name = action.payload.name;
                return {...state, inProgress: false, isError: false};
            }
            return {...state, contact: state.contact.concat([action.payload]), inProgress: false, isError: false};
        }
        case UsersActionTypes.CONTACT_ADD_ERROR: {
            return {...state, inProgress: false, isError: true};
        }
        case UsersActionTypes.CONTACT_DELETE_SUCCESS: {
            const contact = state.contact.filter(item => item.id === action.payload)[0];
            state.contact.splice(state.contact.indexOf(contact), 1);
            return {...state, inProgress: false, isError: false};
        }
        case UsersActionTypes.ACCOUNT_DETAILS_GET_SUCCESS: {
            if (action.payload.results && action.payload.results[0]) {
                return {
                    ...state,
                    contact: action.payload.results[0].contacts,
                    blackList: action.payload.results[0].blacklist,
                    whiteList: action.payload.results[0].whitelist,
                    username: action.payload.results[0].username,
                };
            }
            return state;
        }
        default: {
            return state;
        }
    }
}

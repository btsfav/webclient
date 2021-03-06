import { MailActions, MailActionTypes } from '../actions';
import { MailBoxesState } from '../datatypes';
import { Mailbox } from '../models/mail.model';

export function reducer(
  state: MailBoxesState = {
    mailboxes: [],
    currentMailbox: null,
    decryptKeyInProgress: false,
    encryptionInProgress: false,
  },
  action: MailActions,
): MailBoxesState {
  switch (action.type) {
    case MailActionTypes.GET_MAILBOXES: {
      return {
        ...state,
        inProgress: true,
      };
    }
    case MailActionTypes.GET_MAILBOXES_SUCCESS: {
      return {
        ...state,
        mailboxes: action.payload.map((item, index) => {
          item.sort_order = item.sort_order ? item.sort_order : index + 1;
          return item;
        }),
        inProgress: false,
        currentMailbox: action.payload.find((item: Mailbox) => item.is_enabled),
      };
    }

    case MailActionTypes.SET_DECRYPT_INPROGRESS: {
      return {
        ...state,
        decryptKeyInProgress: action.payload,
      };
    }

    case MailActionTypes.SET_DECRYPTED_KEY: {
      return {
        ...state,
        decryptKeyInProgress: false,
        decryptedKey: action.payload.decryptedKey,
      };
    }

    case MailActionTypes.SET_CURRENT_MAILBOX: {
      return {
        ...state,
        currentMailbox: action.payload,
      };
    }

    case MailActionTypes.MAILBOX_SETTINGS_UPDATE_SUCCESS: {
      const updatedCurrentMailBox: Mailbox = action.payload;
      updatedCurrentMailBox.inProgress = false;
      let { mailboxes } = state;

      mailboxes = mailboxes.map(mailbox => {
        if (mailbox.id === updatedCurrentMailBox.id) {
          return { ...updatedCurrentMailBox };
        }
        return mailbox;
      });

      if (updatedCurrentMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...updatedCurrentMailBox };
      }

      return {
        ...state,
        mailboxes,
        inProgress: false,
      };
    }

    case MailActionTypes.MAILBOX_SETTINGS_UPDATE_FAILURE: {
      return {
        ...state,
        mailboxes: state.mailboxes.map(mailbox => {
          if (mailbox.id === action.payload.id) {
            mailbox.inProgress = false;
          }
          return mailbox;
        }),
      };
    }

    case MailActionTypes.CREATE_MAILBOX: {
      return { ...state, inProgress: true };
    }

    case MailActionTypes.CREATE_MAILBOX_SUCCESS: {
      state.mailboxes = [...state.mailboxes, action.payload];
      return { ...state, inProgress: false };
    }

    case MailActionTypes.CREATE_MAILBOX_FAILURE: {
      return { ...state, inProgress: false };
    }

    case MailActionTypes.SET_DEFAULT_MAILBOX_SUCCESS: {
      const updatedCurrentMailBox: Mailbox = action.payload;
      const previousDefaultMailBox = state.mailboxes.find(mailbox => !!mailbox.is_default);
      let { mailboxes } = state;
      mailboxes = mailboxes.map(mailbox => {
        if (mailbox.id === updatedCurrentMailBox.id) {
          return { ...updatedCurrentMailBox };
        }
        if (mailbox.id === previousDefaultMailBox.id) {
          return { ...mailbox, is_default: false };
        }
        return mailbox;
      });

      if (updatedCurrentMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...updatedCurrentMailBox };
      } else if (previousDefaultMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...state.currentMailbox, is_default: false };
      }

      return {
        ...state,
        mailboxes,
      };
    }

    case MailActionTypes.UPDATE_MAILBOX_ORDER: {
      return { ...state, isUpdatingOrder: true };
    }

    case MailActionTypes.UPDATE_MAILBOX_ORDER_SUCCESS: {
      return {
        ...state,
        mailboxes: action.payload.mailboxes,
        currentMailbox: action.payload.mailboxes[0],
        isUpdatingOrder: false,
      };
    }

    case MailActionTypes.DELETE_MAILBOX_SUCCESS: {
      return { ...state, mailboxes: state.mailboxes.filter(mailbox => mailbox.id !== action.payload.id) };
    }

    default: {
      return state;
    }
  }
}

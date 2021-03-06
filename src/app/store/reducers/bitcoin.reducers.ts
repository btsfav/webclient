import { BitcoinState, TransactionStatus } from '../datatypes';
import { BitcoinActionAll, BitcoinActionTypes } from '../actions/bitcoin.action';

export const initialState: BitcoinState = {
  bitcoinRequired: 0.0021,
  newWalletAddress: null,
  loaded: false,
  checkTransactionResponse: { status: TransactionStatus.WAITING },
};

export function reducer(state = initialState, action: BitcoinActionAll): BitcoinState {
  switch (action.type) {
    case BitcoinActionTypes.CREATE_NEW_WALLET: {
      return {
        ...state,
        loaded: false,
      };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS: {
      return {
        ...state,
        loaded: true,
        newWalletAddress: action.payload.address,
        bitcoinRequired: action.payload.amount,
      };
    }
    case BitcoinActionTypes.CHECK_TRANSACTION_SUCCESS: {
      return {
        ...state,
        checkTransactionResponse: action.payload,
      };
    }
    case BitcoinActionTypes.CLEAR_WALLET: {
      return {
        ...initialState,
      };
    }

    default: {
      return state;
    }
  }
}

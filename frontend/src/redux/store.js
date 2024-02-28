import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from "redux-persist";
import userReducer from './userSlice'
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
})

export const persistor = persistStore(store);
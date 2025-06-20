import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { laundryApi } from "./apislice";
import userReducer from "./userSlice";

// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist specific reducers (e.g., userReducer)
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  [laundryApi.reducerPath]: laundryApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ...

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(laundryApi.middleware), // Add RTK Query middleware
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;

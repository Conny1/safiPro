import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { laundryApi } from "./apislice";
import userReducer from "./userSlice";
import networkReducer from "./networkSlice";
import branchReducer from "./branchSlice";
import type { Action } from "@reduxjs/toolkit";


// Persist Config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "branch"], // Only persist specific reducers (e.g., userReducer)
};

// Combine all reducers
const appReducer = combineReducers({
  user: userReducer,
  network:networkReducer,
  branch:branchReducer,
  [laundryApi.reducerPath]: laundryApi.reducer,
});
 type StateType = ReturnType<typeof appReducer>;

const rootReducer = (state:StateType | undefined, action:Action )=>{
  if(action.type === "RESET_APP"){
    state = undefined;
  }
  return appReducer(state, action)
}

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

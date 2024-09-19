import { configureStore } from "@reduxjs/toolkit";
import { todoApi } from "./todo/api";
import todoReducer from "./todo/reducer";
import { setupListeners } from "@reduxjs/toolkit/query";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [todoApi.reducerPath]: todoApi.reducer,
      todo: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(todoApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

setupListeners(makeStore);

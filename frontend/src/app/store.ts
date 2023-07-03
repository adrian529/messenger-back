import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { useGetMessagesQuery } from './api/apiSlice';
import { apiSlice } from './api/apiSlice';
import { authSlice } from '../features/auth/authSlice';
import { chatApi } from '../features/chat/chatApiSlice';
import { setupListeners } from "@reduxjs/toolkit/dist/query";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    authSlice: authSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware, chatApi.middleware),
    devTools: true
});

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

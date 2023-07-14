import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { authSlice } from '../features/auth/authSlice';
import { chatApi } from '../features/chat/chatApiSlice';
import { apiSlice } from './api/apiSlice';

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    authSlice: authSlice.reducer
})
export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware, chatApi.middleware),
    devTools: true
});

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>

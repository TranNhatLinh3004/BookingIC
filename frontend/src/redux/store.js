// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartSlice,
        search: searchReducer,
    },
});

export default store;
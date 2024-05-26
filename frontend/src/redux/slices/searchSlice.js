import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    city: undefined,
    dates: [],
    options: {
        adult: undefined,
        children: undefined,
        room: undefined,
    },
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        newSearch: (state, action) => {
            return action.payload;
        },
        resetSearch: () => initialState,
    },
});

export const { newSearch, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
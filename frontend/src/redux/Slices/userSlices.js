import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userDetails: {}
    },
    reducers: {
        setUser(state, action) {
            state.userDetails = action.payload;
        },
        removeUser(state) {
            state.userDetails = {};
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

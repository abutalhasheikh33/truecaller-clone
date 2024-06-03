import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserDetails {
    id?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
    city?: string;
    country?: string;
    otp?: string | number;
    password?: string;
}

interface UserState {
    userDetails: UserDetails | null; 
    
}

const initialState: UserState = {
    userDetails: {},
    
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserDetails>) {
            state.userDetails = action.payload;
        },
        removeUser(state) {
            state.userDetails = {};
        }
    }
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

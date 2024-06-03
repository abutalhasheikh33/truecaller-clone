import { configureStore } from '@reduxjs/toolkit';
import userReduser from './Slices/userSlices.ts';

const store = configureStore({
    reducer: {
        user: userReduser
    }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
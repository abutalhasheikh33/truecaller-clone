import { configureStore } from '@reduxjs/toolkit';
import userReduser from './Slices/userSlices';

const store = configureStore({
    reducer: {
        user: userReduser
    }
});

export default store;
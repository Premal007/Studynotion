import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    //AHIYA LOCALSTORAGE KEM USE KRVI PADI E MATE MAST REASON :- VID 99 1:45:00 PAR CHE & Book ma pan
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;
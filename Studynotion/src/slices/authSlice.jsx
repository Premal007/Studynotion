import { createSlice } from "@reduxjs/toolkit";


// defining the initial state
const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") 
        ? JSON.parse(localStorage.getItem("token")) 
        : null, 
  // browser bandh kri daie to pan local storage  ma to value paddi jhoy etlle local storage no use kryo che
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
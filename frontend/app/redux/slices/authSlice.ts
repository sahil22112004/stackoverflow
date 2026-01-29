import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  apiLogin, apiRegister } from '../../services/authapi';
import { current } from "@reduxjs/toolkit";

export interface User {
  id?: number | string;
  email: string;
  username?: string;
}

interface AuthState {
  currentUser: User | null;
  cart:any;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  cart:[],
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk(
  'loginUser',
  async (user: any, { rejectWithValue }) => {
    try {
      return await apiLogin(user);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'registerUser',
  async (user: any, { rejectWithValue }) => {
    console.log(user)
    try {
      console.log("working")
      return await apiRegister(user);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'googleLogin',
  async (user: any, { rejectWithValue }) => {
    try {
    return await apiRegister(user);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },

    handleCurrentUser:(state,action)=>{
        state.currentUser = action.payload

    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("working",action.payload)
        state.loading = false;
        state.isLoggedIn = true;
        state.currentUser = action.payload;
        state.error = null;
        
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        console.log(action.payload)
        state.loading = false;
        state.isLoggedIn = true;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
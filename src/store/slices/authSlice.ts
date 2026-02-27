import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase';
import type { UserProfile } from '../../types';
import type { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    profileLoaded: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    profile: null,
    loading: true,
    profileLoaded: false,
    error: null,
};

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (userId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data as UserProfile;
});

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data.user;
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ email, password, fullName }: { email: string; password: string; fullName: string }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        return data.user;
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
});

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (updates: Partial<UserProfile> & { id: string }) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', updates.id)
            .select()
            .single();
        if (error) throw error;
        return data as UserProfile;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.loading = false;
            state.profile = null;
            state.profileLoaded = false;
        },
        clearAuth(state) {
            state.user = null;
            state.profile = null;
            state.loading = false;
            state.profileLoaded = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchProfile
            .addCase(fetchProfile.pending, (state) => {
                state.profileLoaded = false;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.profileLoaded = true;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.profileLoaded = true;
            })
            // login
            .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Login failed';
            })
            // register
            .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Registration failed';
            })
            // logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.profile = null;
            })
            // updateProfile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
            });
    },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase';
import type { WishlistItem } from '../../types';

interface WishlistState {
    items: WishlistItem[];
    loading: boolean;
}

const initialState: WishlistState = {
    items: [],
    loading: false,
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (userId: string) => {
    const { data, error } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('user_id', userId);
    if (error) throw error;
    return (data || []) as WishlistItem[];
});

export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async ({ userId, productId }: { userId: string; productId: number }) => {
        const { data: existing } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existing) {
            await supabase.from('wishlist_items').delete().eq('id', existing.id);
            return { removed: true, id: existing.id, productId };
        } else {
            const { data, error } = await supabase
                .from('wishlist_items')
                .insert({ user_id: userId, product_id: productId })
                .select('*, product:products(*)')
                .single();
            if (error) throw error;
            return { removed: false, item: data as WishlistItem, productId };
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/remove',
    async (itemId: number) => {
        const { error } = await supabase.from('wishlist_items').delete().eq('id', itemId);
        if (error) throw error;
        return itemId;
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        resetWishlist(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                if (action.payload.removed) {
                    state.items = state.items.filter((i) => i.id !== action.payload.id);
                } else if (action.payload.item) {
                    state.items.push(action.payload.item);
                }
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
            });
    },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

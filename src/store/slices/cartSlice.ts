import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase';
import type { CartItem } from '../../types';

interface CartState {
    items: CartItem[];
    loading: boolean;
}

const initialState: CartState = {
    items: [],
    loading: false,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId: string) => {
    const { data, error } = await supabase
        .from('cart_items')
        .select('*, product:products(*)')
        .eq('user_id', userId);
    if (error) throw error;
    return (data || []) as CartItem[];
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, productId, quantity = 1 }: { userId: string; productId: number; quantity?: number }) => {
        // upsert: if item exists, increment quantity
        const { data: existing } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existing) {
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id)
                .select('*, product:products(*)')
                .single();
            if (error) throw error;
            return { item: data as CartItem, isUpdate: true };
        } else {
            const { data, error } = await supabase
                .from('cart_items')
                .insert({ user_id: userId, product_id: productId, quantity })
                .select('*, product:products(*)')
                .single();
            if (error) throw error;
            return { item: data as CartItem, isUpdate: false };
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId)
            .select('*, product:products(*)')
            .single();
        if (error) throw error;
        return data as CartItem;
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId: number) => {
        const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
        if (error) throw error;
        return itemId;
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (userId: string) => {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
        if (error) throw error;
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => { state.loading = true; })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchCart.rejected, (state) => { state.loading = false; })
            .addCase(addToCart.fulfilled, (state, action) => {
                const { item, isUpdate } = action.payload;
                if (isUpdate) {
                    const idx = state.items.findIndex((i) => i.id === item.id);
                    if (idx >= 0) state.items[idx] = item;
                } else {
                    state.items.push(item);
                }
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const idx = state.items.findIndex((i) => i.id === action.payload.id);
                if (idx >= 0) state.items[idx] = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter((i) => i.id !== action.payload);
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            });
    },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

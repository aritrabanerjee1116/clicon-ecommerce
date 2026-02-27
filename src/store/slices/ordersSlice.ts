import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../utils/supabase';
import type { Order, CartItem, Address } from '../../types';

interface OrdersState {
    orders: Order[];
    loading: boolean;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
};

export const fetchOrders = createAsyncThunk('orders/fetch', async (userId: string) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Order[];
});

export const placeOrder = createAsyncThunk(
    'orders/place',
    async ({ userId, cartItems, address }: { userId: string; cartItems: CartItem[]; address: Address }) => {
        const total = cartItems.reduce((sum, item) => {
            const price = item.product?.price_in_rupees || 0;
            return sum + price * item.quantity;
        }, 0);

        // 1. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId,
                total,
                shipping_address: address,
                status: 'Pending',
            })
            .select()
            .single();
        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = cartItems.map((item) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_title: item.product?.title || '',
            product_image: item.product?.images?.[0] || '',
            price: item.product?.price_in_rupees || 0,
            quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        // 3. Clear cart
        await supabase.from('cart_items').delete().eq('user_id', userId);

        // 4. Decrease stock
        for (const item of cartItems) {
            // Simple approach: decrement stock
            const newStock = Math.max(0, (item.product?.stock_quantity || 0) - item.quantity);
            await supabase
                .from('products')
                .update({ stock_quantity: newStock })
                .eq('id', item.product_id);
        }

        return { ...order, order_items: orderItems } as Order;
    }
);

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrders(state) {
            state.orders = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
            })
            .addCase(fetchOrders.rejected, (state) => { state.loading = false; })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload);
            });
    },
});

export const { resetOrders } = ordersSlice.actions;
export default ordersSlice.reducer;

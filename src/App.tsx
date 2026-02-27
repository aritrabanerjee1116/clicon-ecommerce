import { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './theme';
import Routing from './routing/Routing';
import supabase from './utils/supabase';
import { useAppDispatch } from './store/hooks';
import { setUser, fetchProfile, clearAuth } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import { resetCart } from './store/slices/cartSlice';
import { resetWishlist } from './store/slices/wishlistSlice';
import { resetOrders } from './store/slices/ordersSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(fetchProfile(session.user.id));
        dispatch(fetchCart(session.user.id));
        dispatch(fetchWishlist(session.user.id));
      } else {
        dispatch(setUser(null));
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
        dispatch(fetchProfile(session.user.id));
        dispatch(fetchCart(session.user.id));
        dispatch(fetchWishlist(session.user.id));
      } else {
        dispatch(clearAuth());
        dispatch(resetCart());
        dispatch(resetWishlist());
        dispatch(resetOrders());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routing />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: 10, fontWeight: 500 },
        }}
      />
    </ThemeProvider>
  );
};

export default App;
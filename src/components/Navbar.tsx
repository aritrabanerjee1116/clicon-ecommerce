import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, Box, Typography, IconButton, InputBase,
  Container, Button, Badge, Menu, MenuItem, Paper, List,
  ListItem, ListItemText, ListItemAvatar, Avatar, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import supabase from "../utils/supabase";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((s) => s.auth);
  const { items: cartItems } = useAppSelector((s) => s.cart);
  const { items: wishlistItems } = useAppSelector((s) => s.wishlist);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);

  const userMenuOpen = Boolean(userAnchor);

  useEffect(() => {
    const performSearch = async () => {
      if (search.trim().length < 2) {
        setResults([]);
        return;
      }
      const { data, error } = await supabase
        .from("products")
        .select("id, title, description, images")
        .or(`title.ilike.%${search}%,description.ilike.%${search}%`)
        .limit(5);
      if (!error && data) setResults(data);
    };
    const timer = setTimeout(() => performSearch(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResultClick = (id: number) => {
    setSearch("");
    setResults([]);
    navigate(`/products/${id}`);
  };

  const handleSearchSubmit = () => {
    if (results.length > 0) handleResultClick(results[0].id);
  };

  const handleLogout = () => {
    dispatch(logout());
    setUserAnchor(null);
    navigate("/");
  };

  return (
    <Box>
      {/* TOP BAR */}
      <Box sx={{ background: "#2E6F95", color: "#fff", py: 0.5 }}>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography fontSize={13}>
            Welcome to Clicon online eCommerce store.
          </Typography>
        </Container>
      </Box>

      {/* MAIN HEADER */}
      <AppBar position="static" elevation={0}>
        <Container>
          <Toolbar sx={{ gap: 3 }}>
            <Button
              component={Link}
              to={"/"}
              sx={{ fontWeight: 700, color: "#fff", fontSize: 34, textTransform: "none" }}
            >
              CLICON
            </Button>

            {/* Search Bar */}
            <Box sx={{ flex: 1, position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 1, px: 2 }}>
                <InputBase
                  placeholder="Search for anything..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  sx={{ flex: 1, color: "#000" }}
                />
                <IconButton onClick={handleSearchSubmit}>
                  <SearchIcon />
                </IconButton>
              </Box>
              {results.length > 0 && (
                <Paper
                  elevation={3}
                  sx={{ position: "absolute", top: "110%", left: 0, right: 0, zIndex: 100, maxHeight: 400, overflow: "auto" }}
                >
                  <List>
                    {results.map((product) => (
                      <ListItem
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" }, color: "#000" }}
                      >
                        <ListItemAvatar>
                          <Avatar variant="rounded" src={product.images?.[0]} alt={product.title} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={product.title}
                          secondary={product.description}
                          primaryTypographyProps={{ noWrap: true, fontWeight: "bold" }}
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>

            {/* ICONS */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" component={Link} to="/wishlist">
                <Badge badgeContent={wishlistItems.length} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>

              <IconButton color="inherit" onClick={(e) => setUserAnchor(e.currentTarget)}>
                <PersonOutlineIcon />
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={userAnchor}
                open={userMenuOpen}
                onClose={() => setUserAnchor(null)}
                PaperProps={{ sx: { minWidth: 200, borderRadius: 2, mt: 1 } }}
              >
                {user ? (
                  <Box>
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {profile?.full_name || "User"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => { setUserAnchor(null); navigate("/account"); }}>
                      <AccountCircleIcon sx={{ mr: 1.5, fontSize: 20 }} /> My Account
                    </MenuItem>
                    <MenuItem onClick={() => { setUserAnchor(null); navigate("/orders"); }}>
                      <ReceiptIcon sx={{ mr: 1.5, fontSize: 20 }} /> My Orders
                    </MenuItem>
                    {profile?.role === "admin" && (
                      <MenuItem onClick={() => { setUserAnchor(null); navigate("/admin"); }}>
                        <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} /> Admin Panel
                      </MenuItem>
                    )}
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Sign Out
                    </MenuItem>
                  </Box>
                ) : (
                  <Box>
                    <MenuItem onClick={() => { setUserAnchor(null); navigate("/login"); }}>
                      <LoginIcon sx={{ mr: 1.5, fontSize: 20 }} /> Sign In
                    </MenuItem>
                    <MenuItem onClick={() => { setUserAnchor(null); navigate("/register"); }}>
                      <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 20 }} /> Create Account
                    </MenuItem>
                  </Box>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* UTILITY BAR */}
      <Box sx={{ background: "#EFEFEF", py: 1 }}>
        <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Typography
              component={Link}
              to="/products"
              sx={{ cursor: "pointer",  color: "#444", fontSize: 14, textDecoration: "none", "&:hover": { color: "#2E6F95" } }}
            >
              All Products
              </Typography>
            <Typography
              component={Link}
              to="/orders"
              sx={{ cursor: "pointer", color: "#444", fontSize: 14, textDecoration: "none", "&:hover": { color: "#2E6F95" } }}
            >
              Track Order
            </Typography>
            <Typography component={Link} to="/support" sx={{ cursor: "pointer", textDecoration: "none","&:hover": { color: "#2E6F95" }, color: "#444", fontSize: 14 }}>Customer Support</Typography>
            <Typography component={Link} to="/faq" sx={{ cursor: "pointer",textDecoration: "none","&:hover": { color: "#2E6F95" }, color: "#444", fontSize: 14 }}>FAQ</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#000" }}>
            <PhoneOutlinedIcon fontSize="small" />
            <Typography fontWeight={500} >+1-202-555-0104</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
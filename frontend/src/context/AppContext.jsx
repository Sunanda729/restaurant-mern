import {
  createContext,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [admin, setAdmin] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem("admin");

      return savedAdmin
        ? JSON.parse(savedAdmin)
        : null;
    } catch (error) {
      console.error("Admin localStorage error:", error);
      return null;
    }
  });

  const [categories, setCategories] = useState([]);

  const [menus, setMenus] = useState([]);

  const [cart, setCart] = useState([]);

  const [totalPrice, setTotalPrice] = useState(0);

  // =========================
  // FETCH CART
  // =========================

  const fetchCartData = async () => {
    try {
      const { data } = await axios.get(
        "/api/cart/get"
      );

      if (data.success) {
        setCart(data.cart || { items: [] });
      }
    } catch (error) {
      console.log(
        "Cart fetch:",
        error?.response?.data?.message ||
          error.message
      );

      setCart({ items: [] });
    }
  };

  // =========================
  // CALCULATE TOTAL PRICE
  // =========================

  useEffect(() => {
    if (!cart?.items) {
      setTotalPrice(0);
      return;
    }

    const total = cart.items.reduce(
      (sum, item) => {
        const price = item?.menuItem?.price || 0;
        const quantity = item?.quantity || 0;

        return sum + price * quantity;
      },
      0
    );

    setTotalPrice(total);
  }, [cart]);

  // =========================
  // CART COUNT
  // =========================

  const cartCount =
    cart?.items?.reduce(
      (acc, item) =>
        acc + (item?.quantity || 0),
      0
    ) || 0;

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = async (
    menuId,
    quantity = 1
  ) => {
    try {
      const { data } = await axios.post(
        "/api/cart/add",
        {
          menuId,
          quantity,
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCartData();
      } else {
        toast.error(
          data.message || "Unable to add item"
        );
      }
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong!"
      );
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "/api/category/all"
      );

      if (data.success) {
        setCategories(data.categories || []);
      } else {
        console.log(
          "Failed to fetch categories"
        );
      }
    } catch (error) {
      console.log(
        "Error fetching categories:",
        error
      );
    }
  };

  // =========================
  // FETCH MENUS
  // =========================

  const fetchMenus = async () => {
    try {
      const { data } = await axios.get(
        "/api/menu/all"
      );

      if (data.success) {
        setMenus(data.menuItems || []);
      } else {
        console.log("Failed to fetch menus");
      }
    } catch (error) {
      console.log(
        "Error fetching menus:",
        error
      );
    }
  };

  // =========================
  // USER AUTH CHECK
  // =========================

  const isAuth = async () => {
    try {
      const { data } = await axios.get(
        "/api/auth/is-auth"
      );

      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(
        "User auth check:",
        error?.response?.data?.message ||
          error.message
      );

      setUser(null);
    }
  };

  // =========================
  // INITIAL DATA
  // =========================

  useEffect(() => {
    isAuth();
    fetchCategories();
    fetchMenus();

    // Only fetch cart if user exists
    // Cart API normally requires authentication.
  }, []);

  // =========================
  // FETCH CART AFTER USER LOGIN
  // =========================

  useEffect(() => {
    if (user) {
      fetchCartData();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  // =========================
  // LOGOUT ADMIN HELPER
  // =========================

  const logoutAdmin = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    navigate("/admin");
  };

  const value = {
    navigate,

    loading,
    setLoading,

    user,
    setUser,

    axios,

    admin,
    setAdmin,
    logoutAdmin,

    categories,
    fetchCategories,

    menus,
    fetchMenus,

    addToCart,

    cartCount,
    cart,

    totalPrice,
    fetchCartData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import {
  Calendar,
  LogOut,
  Package,
  ShoppingCart,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    navigate,
    user,
    setUser,
    axios,
    cartCount,
  } = useContext(AppContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      const { data } = await axios.post(
        "/api/auth/logout"
      );

      if (data.success) {
        setUser(null);

        toast.success(
          data.message || "Logged out successfully"
        );

        navigate("/");
      } else {
        toast.error(
          data.message || "Unable to logout"
        );
      }
    } catch (error) {
      console.error("Logout error:", error);

      toast.error("Unable to logout");
    }
  };

  // =========================
  // CLOSE MOBILE MENU
  // =========================
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =========================
            MAIN NAVBAR
        ========================= */}
        <div className="flex items-center justify-between h-16">

          {/* =========================
              LOGO
          ========================= */}
          <div className="flex items-center">

            <Link
              to="/"
              onClick={closeMobileMenu}
              aria-label="Restaurant Home"
            >
              <img
                src="/logo.png"
                alt="Restaurant"
                className="w-28"
              />
            </Link>

          </div>


          {/* =========================
              DESKTOP MENU
          ========================= */}
          <div className="hidden md:flex items-center space-x-8">

            <Link
              to="/"
              className="text-gray-700 hover:text-yellow-600 font-semibold transition-colors"
            >
              Home
            </Link>

            <Link
              to="/menu"
              className="text-gray-700 hover:text-yellow-600 font-semibold transition-colors"
            >
              Menus
            </Link>

            <Link
              to="/book-table"
              className="text-gray-700 hover:text-yellow-600 font-semibold transition-colors"
            >
              Book Table
            </Link>

            <Link
              to="/contact"
              className="text-gray-700 hover:text-yellow-600 font-semibold transition-colors"
            >
              Contact
            </Link>

          </div>


          {/* =========================
              RIGHT SIDE
          ========================= */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {/* =========================
                CART
            ========================= */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-yellow-50 rounded-full transition-colors"
              aria-label="Shopping Cart"
            >

              <ShoppingCart
                size={22}
                className="text-gray-700"
              />

              {/* CART COUNT */}
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount > 0 ? cartCount : 0}
              </span>

            </button>


            {/* =========================
                DESKTOP LOGIN / PROFILE
            ========================= */}
            <div className="hidden md:block">

              {user ? (

                /* =========================
                   LOGGED IN USER
                ========================= */
                <div className="relative">

                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onMouseEnter={() =>
                      setIsProfileOpen(true)
                    }
                    onMouseLeave={() =>
                      setIsProfileOpen(false)
                    }
                    aria-label="Profile"
                  >

                    <UserCircle
                      size={30}
                      className="text-gray-700"
                    />

                  </button>


                  {/* PROFILE DROPDOWN */}
                  {isProfileOpen && (
                    <div
                      onMouseEnter={() =>
                        setIsProfileOpen(true)
                      }
                      onMouseLeave={() =>
                        setIsProfileOpen(false)
                      }
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden"
                    >

                      {/* MY BOOKINGS */}
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                      >

                        <Calendar
                          size={18}
                          className="mr-3"
                        />

                        My Bookings

                      </Link>


                      {/* MY ORDERS */}
                      <Link
                        to="/my-orders"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                      >

                        <Package
                          size={18}
                          className="mr-3"
                        />

                        My Orders

                      </Link>


                      {/* DIVIDER */}
                      <div className="border-t border-gray-100 my-1" />


                      {/* LOGOUT */}
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >

                        <LogOut
                          size={18}
                          className="mr-3"
                        />

                        Logout

                      </button>

                    </div>
                  )}

                </div>

              ) : (

                /* =========================
                   LOGIN BUTTON
                ========================= */
                <button
                  onClick={() => navigate("/login")}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition"
                >
                  Login
                </button>

              )}

            </div>


            {/* =========================
                MOBILE MENU BUTTON
            ========================= */}
            <button
              onClick={() =>
                setIsMenuOpen(!isMenuOpen)
              }
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle Menu"
              aria-expanded={isMenuOpen}
            >

              {isMenuOpen ? (
                <X
                  size={25}
                  className="text-gray-700"
                />
              ) : (
                <Menu
                  size={25}
                  className="text-gray-700"
                />
              )}

            </button>

          </div>

        </div>


        {/* =========================
            MOBILE MENU
        ========================= */}
        {isMenuOpen && (

          <div className="md:hidden py-5 border-t border-gray-200">

            <div className="flex flex-col space-y-2">

              {/* HOME */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-semibold transition-colors"
              >
                Home
              </Link>


              {/* MENU */}
              <Link
                to="/menu"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-semibold transition-colors"
              >
                Menus
              </Link>


              {/* BOOK TABLE */}
              <Link
                to="/book-table"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-semibold transition-colors"
              >
                Book Table
              </Link>


              {/* CONTACT */}
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 font-semibold transition-colors"
              >
                Contact
              </Link>


              {/* =========================
                  MOBILE USER SECTION
              ========================= */}
              {user ? (

                <div className="pt-3 border-t border-gray-200 mt-2">

                  {/* MY BOOKINGS */}
                  <Link
                    to="/my-bookings"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                  >

                    <Calendar
                      size={19}
                      className="mr-3"
                    />

                    My Bookings

                  </Link>


                  {/* MY ORDERS */}
                  <Link
                    to="/my-orders"
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                  >

                    <Package
                      size={19}
                      className="mr-3"
                    />

                    My Orders

                  </Link>


                  {/* LOGOUT */}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >

                    <LogOut
                      size={19}
                      className="mr-3"
                    />

                    Logout

                  </button>

                </div>

              ) : (

                /* =========================
                   MOBILE LOGIN
                ========================= */
                <div className="pt-3 border-t border-gray-200 mt-2">

                  <button
                    onClick={() => {
                      navigate("/login");
                      closeMobileMenu();
                    }}
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition"
                  >
                    Login
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

      </div>

    </nav>
  );
};

export default Navbar;
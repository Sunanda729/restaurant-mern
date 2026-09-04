import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    cart,
    totalPrice,
    navigate,
    axios,
    fetchCartData,
  } = useContext(AppContext);

  const removeFromCart = async (menuId) => {
    try {
      const { data } = await axios.delete(
        `/api/cart/remove/${menuId}`
      );

      if (data.success) {
        toast.success(data.message);
        fetchCartData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to remove item");
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag
            size={65}
            className="mx-auto text-gray-300 mb-5"
          />

          <h2 className="text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add some delicious dishes to get started.
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="mt-6 px-7 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-yellow-500 hover:text-black transition"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Your <span className="text-yellow-500">Cart</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 items-center"
              >
                <img
                  src={item.menuItem.image}
                  alt={item.menuItem.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {item.menuItem.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    ₹{item.menuItem.price} × {item.quantity}
                  </p>

                  <p className="font-bold text-yellow-600 mt-2">
                    ₹{item.menuItem.price * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.menuItem._id)
                  }
                  className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-900 text-white rounded-3xl p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between text-gray-300 mb-3">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between text-gray-300 mb-5">
              <span>Delivery</span>
              <span>₹0</span>
            </div>

            <div className="border-t border-gray-700 pt-5 flex justify-between">
              <span className="font-bold text-lg">Total</span>
              <span className="font-extrabold text-2xl text-yellow-400">
                ₹{totalPrice}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full mt-7 py-4 rounded-xl bg-yellow-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
            >
              Proceed to Checkout
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
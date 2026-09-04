import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingCart,
  XCircle,
  Plus,
  Minus,
  Star,
} from "lucide-react";

const MenuDetails = () => {
  const { id } = useParams();
  const { menus, navigate, addToCart } = useContext(AppContext);

  const [quantity, setQuantity] = useState(1);

  const menu = menus.find((item) => item._id === id);

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Menu not found
          </h2>

          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-semibold"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const total = menu.price * quantity;

const handleAddToCart = () => {
  addToCart(menu._id, quantity);
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-14">
      <div className="max-w-6xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate("/menu")}
          className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Image */}
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full h-[350px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute top-5 right-5">
              {menu.isAvailable ? (
                <span className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  <CheckCircle size={18} />
                  Available
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  <XCircle size={18} />
                  Unavailable
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <span className="text-gray-500 text-sm">
                4.8 (120 reviews)
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-5">
              {menu.name}
            </h1>

            <p className="text-3xl font-extrabold text-yellow-600 mb-6">
              ₹{menu.price}
            </p>

            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-7">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About this dish
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {menu.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-7">
              <p className="font-semibold text-gray-800 mb-3">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="w-11 h-11 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  <Minus size={18} />
                </button>

                <span className="text-xl font-bold w-8 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl bg-gray-900 text-white p-6">
              <div className="flex justify-between items-center mb-5">
                <span className="text-gray-300">
                  Total Amount
                </span>

                <span className="text-3xl font-extrabold text-yellow-400">
                  ₹{total}
                </span>
              </div>

              <button
                disabled={!menu.isAvailable}
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg transition-all hover:scale-[1.02] disabled:bg-gray-500 disabled:text-gray-300"
              >
                <ShoppingCart size={22} />

                {menu.isAvailable
                  ? "Add to Cart"
                  : "Currently Unavailable"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MenuDetails;
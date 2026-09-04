import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  ShoppingCart,
  Star,
  Heart,
  ArrowRight,
} from "lucide-react";

const MenuCard = ({ menu }) => {
  const { navigate, addToCart } = useContext(AppContext);

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Image */}
      <div
        onClick={() => navigate(`/menu-details/${menu._id}`)}
        className="relative h-60 overflow-hidden cursor-pointer"
      >
        <img
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Availability */}
        <div className="absolute top-4 left-4">
          {menu.isAvailable ? (
            <span className="px-3 py-1.5 rounded-full bg-green-500/90 text-white text-xs font-bold backdrop-blur-sm">
              Available
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs font-bold">
              Unavailable
            </span>
          )}
        </div>

        {/* Favourite */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-700 hover:bg-white hover:text-red-500 transition-all duration-300 hover:scale-110"
        >
          <Heart size={18} />
        </button>

        {/* Rating */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-white">
          <Star size={15} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          onClick={() => navigate(`/menu-details/${menu._id}`)}
          className="text-xl font-bold text-gray-900 cursor-pointer hover:text-yellow-600 transition-colors line-clamp-1"
        >
          {menu.name}
        </h3>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed min-h-10">
          {menu.description}
        </p>

        <div className="flex items-center justify-between mt-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Price
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              ₹{menu.price}
            </p>
          </div>

          <button
            onClick={() => addToCart(menu._id)}
            disabled={!menu.isAvailable}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all duration-300 ${
              menu.isAvailable
                ? "bg-gray-900 text-white hover:bg-yellow-500 hover:text-black hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} />

            <span>
              {menu.isAvailable ? "Add" : "Sold Out"}
            </span>

            {menu.isAvailable && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
};


export default MenuCard;
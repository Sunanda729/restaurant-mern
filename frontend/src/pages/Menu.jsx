import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Search, X, SlidersHorizontal } from "lucide-react";
import MenuCard from "../components/MenuCard";

const Menu = () => {
  const { menus } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenus, setFilteredMenus] = useState(menus);

  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredMenus(menus);
      return;
    }

    setFilteredMenus(
      menus.filter(
        (menu) =>
          menu.name.toLowerCase().includes(query) ||
          menu.description.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, menus]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-yellow-600 font-bold uppercase tracking-[0.2em] text-sm">
            Discover Our Food
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">
            Our <span className="text-yellow-500">Menu</span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Explore our delicious selection of handcrafted dishes
            made with the finest ingredients.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={21}
            />

            <input
              type="text"
              placeholder="Search your favorite dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-14 py-4 rounded-2xl bg-white border border-gray-200 shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">
              {filteredMenus.length}
            </span>{" "}
            dishes available
          </p>

          <SlidersHorizontal
            size={20}
            className="text-gray-500"
          />
        </div>

        {/* Grid */}
        {filteredMenus.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredMenus.map((menu) => (
              <MenuCard key={menu._id} menu={menu} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl">
            <Search
              size={50}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold text-gray-800">
              No dishes found
            </h2>

            <p className="text-gray-500 mt-2">
              Try searching with another name.
            </p>

            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-3 bg-yellow-500 text-black rounded-full font-bold hover:bg-yellow-400"
            >
              View All Dishes
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Menu;
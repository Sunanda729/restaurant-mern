import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";

const Hero = () => {
  const { navigate } = useContext(AppContext);

  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-3xl text-white">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-6">
            <Sparkles
              size={16}
              className="text-yellow-400"
            />

            <span className="text-sm font-semibold">
              Premium Dining Experience
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Where Every
            <span className="text-yellow-400"> Bite </span>
            Tells a Story.
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mt-6 max-w-2xl leading-relaxed">
            Discover delicious handcrafted dishes,
            fresh ingredients and unforgettable dining
            experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-9">

            <button
              onClick={() => navigate("/menu")}
              className="px-7 py-4 rounded-full bg-yellow-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 hover:scale-105 transition"
            >
              Explore Menu
              <ArrowRight size={19} />
            </button>

            <button
              onClick={() => navigate("/book-table")}
              className="px-7 py-4 rounded-full border border-white/50 bg-white/10 backdrop-blur text-white font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition"
            >
              <CalendarDays size={19} />
              Book a Table
            </button>

          </div>
        </div>
      </div>

      {/* Floating bottom card */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 text-white">
          <p className="text-sm text-gray-300">
            Today's Special
          </p>
          <p className="font-bold text-lg">
            Chef's Signature Dish
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
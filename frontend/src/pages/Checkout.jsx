import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
} from "lucide-react";

const Checkout = () => {
  const { totalPrice, axios, navigate } =
    useContext(AppContext);

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    // Address validation
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    // Prevent duplicate clicks
    if (loading) return;

    // Online payment is not connected yet
    if (paymentMethod === "Online Payment") {
      toast.error(
        "Online payment will be available soon with Razorpay."
      );
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/order/place",
        {
          address: address.trim(),
          paymentMethod,
        }
      );

      if (data.success) {
        toast.success(
          data.message || "Order placed successfully!"
        );

        navigate("/my-orders");
      } else {
        toast.error(
          data.message || "Unable to place order"
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-yellow-600 font-semibold uppercase tracking-wider text-sm">
            Almost There
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            Checkout
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your order and enjoy your meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* =========================
              LEFT - ADDRESS
          ========================= */}
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center">
                <MapPin
                  size={22}
                  className="text-yellow-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delivery Address
                </h2>

                <p className="text-sm text-gray-500">
                  Where should we deliver your order?
                </p>
              </div>

            </div>

            <textarea
              rows={7}
              value={address}
              placeholder="Enter your full delivery address..."
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full border border-gray-200 rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500 transition"
            />

          </div>


          {/* =========================
              RIGHT - ORDER SUMMARY
          ========================= */}
          <div className="bg-gray-900 text-white rounded-3xl p-7 shadow-lg">

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            {/* Total */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-700">

              <span className="text-gray-300">
                Total Amount
              </span>

              <span className="text-3xl font-extrabold text-yellow-400">
                ₹{totalPrice}
              </span>

            </div>


            {/* Payment */}
            <div className="pt-6">

              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={19} />
                Payment Method
              </h3>


              {/* Cash on Delivery */}
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "Cash on Delivery"
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-gray-700 hover:border-yellow-500"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="accent-yellow-500"
                />

                <Banknote
                  size={20}
                  className="text-yellow-400"
                />

                <div>
                  <p className="font-semibold">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-gray-400">
                    Pay when your order arrives
                  </p>
                </div>

              </label>


              {/* Online Payment */}
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border mt-3 cursor-pointer transition ${
                  paymentMethod === "Online Payment"
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-gray-700 hover:border-yellow-500"
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="Online Payment"
                  checked={
                    paymentMethod ===
                    "Online Payment"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  className="accent-yellow-500"
                />

                <CreditCard
                  size={20}
                  className="text-yellow-400"
                />

                <div>
                  <p className="font-semibold">
                    Online Payment
                  </p>

                  <p className="text-xs text-gray-400">
                    Razorpay coming soon
                  </p>
                </div>

              </label>

            </div>


            {/* Confirm button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-7 py-4 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >

              <CheckCircle size={20} />

              {loading
                ? "Placing Order..."
                : "Confirm Order"}

            </button>

          </div>

        </div>

      </div>

    </main>
  );
};

export default Checkout;
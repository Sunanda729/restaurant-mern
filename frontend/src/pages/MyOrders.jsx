import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import {
  CheckCircle,
  Clock,
  ChefHat,
  PackageCheck,
} from "lucide-react";

const MyOrders = () => {
  const { axios } = useContext(AppContext);
  const [orders, setOrders] = useState([]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get(
        "/api/order/my-orders"
      );

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const getStep = (status) => {
    if (status === "Pending") return 1;
    if (status === "Preparing") return 2;
    if (status === "Delivered") return 3;
    return 1;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">

        <div className="text-center mb-10">
          <span className="text-yellow-600 font-bold uppercase tracking-wider text-sm">
            Your Orders
          </span>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            Order History
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center">
            <PackageCheck
              size={60}
              className="mx-auto text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your delicious journey starts here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const step = getStep(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-lg">
                        #{order._id.slice(-6).toUpperCase()}
                      </h2>
                    </div>

                    <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
                      {order.status}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-3 gap-2 mb-8">

                    <div
                      className={`text-center ${
                        step >= 1
                          ? "text-yellow-600"
                          : "text-gray-300"
                      }`}
                    >
                      <Clock className="mx-auto mb-2" />
                      <p className="text-xs font-semibold">
                        Order Placed
                      </p>
                    </div>

                    <div
                      className={`text-center ${
                        step >= 2
                          ? "text-yellow-600"
                          : "text-gray-300"
                      }`}
                    >
                      <ChefHat className="mx-auto mb-2" />
                      <p className="text-xs font-semibold">
                        Preparing
                      </p>
                    </div>

                    <div
                      className={`text-center ${
                        step >= 3
                          ? "text-green-600"
                          : "text-gray-300"
                      }`}
                    >
                      <CheckCircle className="mx-auto mb-2" />
                      <p className="text-xs font-semibold">
                        Delivered
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-5">
                    <div>
                      <p className="text-xs text-gray-500">
                        Total
                      </p>

                      <p className="font-bold text-lg">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Payment
                      </p>

                      <p className="font-semibold">
                        {order.paymentMethod}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-gray-500">
                        Delivery Address
                      </p>

                      <p className="font-medium">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
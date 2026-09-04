import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Orders = () => {
  const { admin, axios, loading, setLoading } =
    useContext(AppContext);

  const [orders, setOrders] = useState([]);

  // =========================
  // FETCH ALL ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/orders");

      console.log("Orders API response:", data);

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to fetch orders"
      );
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================
  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `/api/order/update-status/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Refresh orders after status update
        await fetchOrders();
      } else {
        toast.error(
          data.message || "Unable to update status"
        );
      }
    } catch (error) {
      console.error(
        "Update status error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ORDERS WHEN ADMIN IS READY
  // =========================
  useEffect(() => {
    if (admin) {
      fetchOrders();
    }
  }, [admin]);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-3 sm:px-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
          All Orders
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Manage customer orders and update their status
        </p>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* No orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              No orders found
            </h2>

            <p className="text-gray-500 mt-2">
              Customer orders will appear here.
            </p>

            <button
              onClick={fetchOrders}
              className="mt-5 px-6 py-3 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold transition"
            >
              Refresh Orders
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >

                {/* Order Header */}
                <div className="p-5 border-b border-gray-100">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Order ID
                      </p>

                      <p className="font-semibold text-gray-800 break-all">
                        {order._id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Customer
                      </p>

                      <p className="font-semibold text-gray-800">
                        {order.user?.name || "Unknown Customer"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.user?.email || ""}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Status
                      </p>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Preparing">
                          Preparing
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>
                    </div>

                  </div>
                </div>

                {/* Order Information */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Delivery Address
                    </p>

                    <p className="text-gray-800">
                      {order.address}
                    </p>
                  </div>

                  {/* Payment */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Payment Method
                    </p>

                    <p className="font-semibold text-gray-800">
                      {order.paymentMethod ||
                        "Cash on Delivery"}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">
                      Total Amount
                    </p>

                    <p className="text-2xl font-extrabold text-yellow-400">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                </div>

                {/* Ordered Items */}
                <div className="px-5 pb-5">

                  <h3 className="font-bold text-lg text-gray-800 mb-3">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={
                            item.menuItem?._id ||
                            index
                          }
                          className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3"
                        >

                          {/* Image */}
                          {item.menuItem?.image ? (
                            <img
                              src={item.menuItem.image}
                              alt={
                                item.menuItem.name ||
                                "Menu item"
                              }
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}

                          {/* Details */}
                          <div className="flex-1">

                            <p className="font-semibold text-gray-800">
                              {item.menuItem?.name ||
                                "Menu item unavailable"}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <p className="text-sm text-gray-500">
                              Price: ₹
                              {item.menuItem?.price ||
                                0}
                            </p>

                          </div>

                          {/* Item Total */}
                          <p className="font-bold text-gray-800">
                            ₹
                            {(item.menuItem?.price ||
                              0) *
                              item.quantity}
                          </p>

                        </div>
                      )
                    )}

                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
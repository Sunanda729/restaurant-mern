import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";

/* =========================
   PLACE ORDER
========================= */

export const placeOrder = async (req, res) => {
  try {
    const { id } = req.user;
    const { address, paymentMethod } = req.body;

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const cart = await Cart.findOne({ user: id }).populate(
      "items.menuItem"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => {
        if (!item.menuItem) return sum;

        return (
          sum +
          item.menuItem.price * item.quantity
        );
      },
      0
    );

    const newOrder = await Order.create({
      user: id,
      items: cart.items
        .filter((item) => item.menuItem)
        .map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
        })),
      totalAmount,
      address: address.trim(),
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    // Clear cart after successful order
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   USER ORDERS
========================= */

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;

    const orders = await Order.find({
      user: id,
    })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   ADMIN - ALL ORDERS
========================= */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "-password")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   ADMIN - UPDATE ORDER STATUS
========================= */

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
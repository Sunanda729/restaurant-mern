import Cart from "../models/cartModel.js";
import Menu from "../models/menuModel.js";

/* =========================
   ADD TO CART
========================= */

export const addToCart = async (req, res) => {
  try {
    const { menuId, quantity = 1 } = req.body;
    const { id } = req.user;

    // Validate menu ID
    if (!menuId) {
      return res.status(400).json({
        success: false,
        message: "Menu item is required",
      });
    }

    // Validate quantity
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check menu item
    const menuItem = await Menu.findById(menuId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    // Optional availability check
    if (menuItem.isAvailable === false) {
      return res.status(400).json({
        success: false,
        message: "This item is currently unavailable",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: id,
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: id,
        items: [],
      });
    }

    // Check if item already exists
    const existingItem = cart.items.find(
      (item) =>
        item.menuItem.toString() === menuId
    );

    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({
        menuItem: menuId,
        quantity: qty,
      });
    }

    await cart.save();

    // Return populated cart
    const updatedCart = await Cart.findOne({
      user: id,
    }).populate("items.menuItem");

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   GET USER CART
========================= */

export const getCart = async (req, res) => {
  try {
    const { id } = req.user;

    const cart = await Cart.findOne({
      user: id,
    }).populate("items.menuItem");

    // No cart yet
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   UPDATE CART QUANTITY
========================= */

export const updateCartQuantity = async (
  req,
  res
) => {
  try {
    const { id } = req.user;
    const { menuId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    // Validate quantity
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.menuItem.toString() === menuId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cartItem.quantity = qty;

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: id,
    }).populate("items.menuItem");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(
      "Update cart quantity error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


/* =========================
   REMOVE FROM CART
========================= */

export const removeFromCart = async (
  req,
  res
) => {
  try {
    const { id } = req.user;
    const { menuId } = req.params;

    const cart = await Cart.findOne({
      user: id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength =
      cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        item.menuItem.toString() !== menuId
    );

    // Item wasn't in cart
    if (
      cart.items.length === originalLength
    ) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: id,
    }).populate("items.menuItem");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(
      "Remove from cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
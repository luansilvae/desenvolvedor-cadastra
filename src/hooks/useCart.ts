import { useContext } from "react"
import { CartContext } from "../context/CartContext"

export const useCart = () => {
  const {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    clearCart,
    isCartEmpty,
    amountProducts,
    totalProducts,
    toggleMinicart,
    openCart
  } = useContext(CartContext)

  return {
    cart,
    handleAddToCart,
    handleRemoveFromCart,
    clearCart,
    isCartEmpty,
    amountProducts,
    totalProducts,
    toggleMinicart,
    openCart
  }
}

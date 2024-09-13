import { ReactNode } from "react"
import { Product } from "../../ts/Product"

export interface CartProps {
  children: ReactNode
}

export interface CartContextData {
  handleAddToCart: (productId: number) => void
  handleRemoveFromCart: (productId: number) => void
  clearCart: () => void
  isCartEmpty: boolean
  cart: Product[]
  totalProducts: number
  amountProducts: number
  toggleMinicart: () => void
  openCart: boolean
}

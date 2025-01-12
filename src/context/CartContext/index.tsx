import React, { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { useProducts } from "../../hooks/useProducts"
import { Product } from "../../ts/Product"
import { CartContextData, CartProps } from "./types"

export const CartContext = createContext({} as CartContextData)

export function CartProvider({ children }: CartProps) {
  const { allProducts } = useProducts()
  const [openCart, setOpenCart] = useState<boolean>(false);

  const [cart, setCart] = useState<any[]>(() => {
    const storageValue = localStorage.getItem("cart")

    if (storageValue) {
      return JSON.parse(storageValue)
    } else {
      return [] as Product[]
    }
  })

  const toggleMinicart = () => setOpenCart(!openCart)

  const handleAddToCart = useCallback(
    (productId: number) => {
      const productAdded = allProducts.find(product => product.id === productId)

      setCart((prev: Product[]) => {
        const isProductInCart = prev.find(product => product.id === productId)

        if (isProductInCart) {
          const additionalProduct = prev.map(product =>
            product.id === productId
              ? { ...product, amount: product.amount + 1 }
              : product
          )

          localStorage.setItem("cart", JSON.stringify(additionalProduct))

          return additionalProduct
        } else {
          const newProductAdded = [...prev, { ...productAdded, amount: 1 }]

          localStorage.setItem("cart", JSON.stringify(newProductAdded))

          return newProductAdded
        }
      })
    },
    [allProducts]
  )

  const handleRemoveFromCart = useCallback((productId: number) => {
    setCart((prev: Product[]) => {
      const cartRemovedProduct = prev.reduce((acc, product) => {
        if (product.id === productId) {
          if (product.amount === 1) return acc
          return [...acc, { ...product, amount: product.amount - 1 }]
        } else {
          return [...acc, product]
        }
      }, [] as Product[])

      localStorage.setItem("cart", JSON.stringify(cartRemovedProduct))
      return cartRemovedProduct
    })
  }, [])

  const isCartEmpty = useMemo(() => cart.length === 0, [cart.length])

  const amountProducts = useMemo(
    () => cart.reduce((acc: number, product) => acc + product.amount, 0),
    [cart]
  )

  const totalProducts = useMemo(
    () =>
      cart.reduce(
        (acc: number, product) =>
          acc + product.amount * product.price,
        0
      ),
    [cart]
  )

  const clearCart = () => {
    localStorage.removeItem("cart")
    setCart([])
  }

  useEffect(() => {
    document.body.style.overflow = openCart ? 'hidden' : 'auto'
  }, [openCart])

  return (
    <CartContext.Provider
      value={{
        handleAddToCart,
        cart,
        handleRemoveFromCart,
        clearCart,
        isCartEmpty,
        amountProducts,
        totalProducts,
        toggleMinicart,
        openCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

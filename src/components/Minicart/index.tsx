import React, { useRef, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { formattedCurrency } from "../../utils/formattedCurrency";

export const Minicart = () => {
  const {
    cart,
    isCartEmpty,
    totalProducts,
    clearCart,
    handleRemoveFromCart,
    openCart,
    toggleMinicart,
  } = useCart();

  const minicartRef = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (minicartRef.current == event.target) {
      toggleMinicart();
    }
  };

  const handleEscapeKey = (event: { keyCode: number; }) => {
    if (event.keyCode === 27) {
      toggleMinicart();
    }
  };

  useEffect(() => {
    if (openCart) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [openCart, toggleMinicart]);

  return (
    <div
      className={`minicart minicart--${openCart ? "active" : "hidden"}`}
      ref={minicartRef}
    >
      <div className="minicart__container">
        <div className="minicart__content">
          <div className="minicart__header">
            <h2 className="minicart__title">Carrinho</h2>
            <button className="minicart__close" onClick={toggleMinicart}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
              >
                <path d="M0.5 18.852L17.5547 1.00001" stroke="black" />
                <line
                  y1="-0.5"
                  x2="25.2899"
                  y2="-0.5"
                  transform="matrix(0.711746 0.702437 -0.874311 0.485367 0 1.23547)"
                  stroke="black"
                />
              </svg>
            </button>
          </div>

          {isCartEmpty ? (
            <strong className="minicart__empty">
              Seu carrinho está vazio.
            </strong>
          ) : (
            <>
              <ul className="minicart__list">
                {cart.map((cartProduct, index) => (
                  <li key={index} className="minicart__product">
                    <img src={cartProduct.image} alt={cartProduct.name} />
                    <div className="minicart__product--info">
                      <h4>{cartProduct.name}</h4>

                      <span>
                        Qtd. {cartProduct.amount}
                        <strong>
                          {formattedCurrency(
                            cartProduct.amount * cartProduct.price
                          )}
                        </strong>
                      </span>
                    </div>
                    <button
                      className="minicart__product--remove"
                      onClick={() => handleRemoveFromCart(cartProduct.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="20"
                        viewBox="0 0 19 20"
                        fill="none"
                      >
                        <path d="M0.5 18.852L17.5547 1.00001" stroke="black" />
                        <line
                          y1="-0.5"
                          x2="25.2899"
                          y2="-0.5"
                          transform="matrix(0.711746 0.702437 -0.874311 0.485367 0 1.23547)"
                          stroke="black"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="minicart__submit">
                <div className="minicart__submit--header">
                  <span>
                    Subtotal:
                    <strong>{formattedCurrency(totalProducts)}</strong>
                  </span>

                  <button onClick={clearCart} className="minicart__clear">
                    Limpar carrinho
                  </button>
                </div>

                <button className="minicart__product--buy">
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

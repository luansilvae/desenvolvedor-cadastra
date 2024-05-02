import React, { Fragment } from "react";
import { useProducts } from "../../hooks/useProducts";
import { formattedCurrency } from "../../utils/formattedCurrency";
import { useCart } from "../../hooks/useCart";

const ProductList: React.FC = () => {
  const { products, loadMore, isLastPage } = useProducts();
  const { handleAddToCart, toggleMinicart } = useCart();

  return (
    <Fragment>
      <ul className="product">
        {products &&
          products.map((product) => (
            <li key={product.id} className="product__item">
              <a href="#" className="product__link">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product__image"
                />
                <div className="product__info">
                  <span className="product__name">{product.name}</span>
                  <span className="product__price">
                    {formattedCurrency(product.price)}
                  </span>
                  <span className="product__installments">
                    até {product.parcelamento[0]}x de{" "}
                    {formattedCurrency(product.price / product.parcelamento[0])}
                  </span>

                  <button
                    className="product__buy"
                    onClick={() => {
                      handleAddToCart(product.id);
                      toggleMinicart()
                    }}
                  >
                    Comprar
                  </button>
                </div>
              </a>
            </li>
          ))}
      </ul>

      <button onClick={loadMore} className="loadMore" disabled={isLastPage}>Carregar mais</button>
    </Fragment>
  );
};

export default ProductList;

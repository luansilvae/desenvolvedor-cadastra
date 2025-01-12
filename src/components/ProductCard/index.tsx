import React from "react";
import { formattedCurrency } from "../../utils/formattedCurrency";
import { Product } from "../../ts/types";
import { useCart } from "../../hooks/useCart";


interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { handleAddToCart, toggleMinicart } = useCart();

  return (
    <li className="product__item">
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
              toggleMinicart();
            }}
          >
            Comprar
          </button>
        </div>
      </a>
    </li>
  );
};

export default ProductCard;

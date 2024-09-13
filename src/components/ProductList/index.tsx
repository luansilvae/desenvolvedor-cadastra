import React, { Fragment, useState, useEffect } from "react";
import { useProducts } from "../../hooks/useProducts";
import { formattedCurrency } from "../../utils/formattedCurrency";
import { useCart } from "../../hooks/useCart";

const removeDuplicates = (array: string[]) => Array.from(new Set(array));

const ProductList: React.FC = () => {
  const { products, loadMore, isLastPage } = useProducts();
  const { handleAddToCart, toggleMinicart } = useCart();

  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maximumPrice, setMaximumPrice] = useState<number>(500);
  const [minimumPrice, setMinimumPrice] = useState<number>(0);
  const [maximumPricePossivel, setMaximumPricePossivel] =
    useState<number>(1000);

  useEffect(() => {
    if (products.length > 0) {
      const priceMin = Math.min(...products.map((product) => product.price));
      const priceMax = Math.max(...products.map((product) => product.price));

      setMinimumPrice(priceMin);
      setMaximumPrice(priceMax);
      setMaximumPricePossivel(priceMax);
    }
  }, [products]);

  const availableColors = removeDuplicates(
    products.map((product) => product.color)
  );
  const availableSizes = removeDuplicates(
    products.flatMap((product) => product.size)
  );

  const filteredProducts = products.filter((product) => {
    const filterByColor =
      selectedColors.length > 0 ? selectedColors.includes(product.color) : true;
    const filterBySize =
      selectedSizes.length > 0
        ? selectedSizes.some((size) => product.size.includes(size))
        : true;
    const filterByPrice = maximumPrice ? product.price <= maximumPrice : true;

    return filterByColor && filterBySize && filterByPrice;
  });

  const handleColorChange = (color: string) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((t) => t !== size)
        : [...prevSizes, size]
    );
  };

  return (
    <Fragment>
      <div className="product__list">
        <div className="filter">
          <div>
            <label className="filter__name">CORES</label>
            <div className="filter__item">
              {availableColors.map((color) => (
                <label key={color}>
                  <input
                    type="checkbox"
                    value={color}
                    checked={selectedColors.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                   {color}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="filter__name">TAMANHOS</label>
            <div className="filter__item">
              {availableSizes.map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className="filter__item">
            <label htmlFor="priceFilter" className="filter__name">
              FAIXA DE PREÇO  <span className="filter__price--selected">{formattedCurrency(maximumPrice)}</span>
            </label>
            <input
              id="priceFilter"
              type="range"
              min={minimumPrice}
              max={maximumPricePossivel}
              value={maximumPrice}
              onChange={(e) => setMaximumPrice(Number(e.target.value))}
              step="10"
            />
          </div>
        </div>

        <ul className="product">
          {filteredProducts &&
            filteredProducts.map((product) => (
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
                      {formattedCurrency(
                        product.price / product.parcelamento[0]
                      )}
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
            ))}
        </ul>
      </div>

      <button onClick={loadMore} className="loadMore" disabled={isLastPage}>
        Carregar mais
      </button>
    </Fragment>
  );
};

export default ProductList;

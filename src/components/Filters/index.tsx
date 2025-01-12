import React, { useEffect, useState } from "react";
import { Filters as FiltersType } from "../../ts/types";

interface FiltersProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  colors: string[];
  sizes: string[];
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  colors,
  sizes,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState({
    colors: isMobile ? false : true,
    sizes: isMobile ? false : true,
    price: isMobile ? false : true,
  });
  const [tempFilters, setTempFilters] = useState<FiltersType>(filters);
  const [showAllColors, setShowAllColors] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleAccordion = (section: "colors" | "sizes" | "price") => {
    setIsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterType: "color" | "size"
  ) => {
    const { value, checked } = e.target;

    setTempFilters((prevFilters) => {
      const currentValues = prevFilters[filterType] as string[];

      return {
        ...prevFilters,
        [filterType]: checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value),
      };
    });
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const [min, max] = value.split("-").map(Number);

    setTempFilters((prevFilters) => ({
      ...prevFilters,
      minPrice: checked ? min : 0,
      maxPrice: checked ? max : Infinity,
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters: FiltersType = {
      color: [],
      size: [],
      minPrice: 0,
      maxPrice: Infinity,
    };

    setFilters(clearedFilters);
    setTempFilters(clearedFilters);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const priceRanges = [
    { label: "de R$0 até R$50", value: "0-50" },
    { label: "de R$51 até R$150", value: "51-150" },
    { label: "de R$151 até R$300", value: "151-300" },
    { label: "de R$301 até R$500", value: "301-500" },
    { label: "a partir de R$500", value: "500-Infinity" },
  ];

  return (
    <div className="filter">
      <div>
        <label
          className="filter__name"
          onClick={() => toggleAccordion("colors")}
        >
          CORES
          <span className={`arrow ${isOpen.colors ? "open" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
            >
              <path
                d="M1 1L10 14L19 1.0135"
                stroke="#666666"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </label>
        {isOpen.colors && (
          <div className="filter__item filter__item--colors">
            {(showAllColors ? colors : colors.slice(0, 5)).map((color) => (
              <label key={color}>
                <input
                  type="checkbox"
                  value={color}
                  checked={(tempFilters.color as string[]).includes(color)}
                  onChange={(e) => handleCheckboxChange(e, "color")}
                />
                <span className="checkmark"></span>
                {color}
              </label>
            ))}

            {colors.length > 5 && (
              <button
                className="filter__button filter__button--toggle"
                onClick={() => setShowAllColors((prev) => !prev)}
              >
                {showAllColors ? (
                  <span>
                    Ver menos
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M8 6L4.5 1L1 5.99481" stroke="#666666" stroke-linecap="round"/>
                    </svg>
                  </span>
                )   :  (
                  <span>
                    Ver todas as cores 
                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 1L4.5 6L8 1.00519" stroke="#666666" stroke-linecap="round"/>
                      </svg>
                  </span>
                )}
              </button>
            )}
          </div>
        )}
      </div>
      <div>
        <label
          className="filter__name"
          onClick={() => toggleAccordion("sizes")}
        >
          TAMANHOS
          <span className={`arrow ${isOpen.sizes ? "open" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
            >
              <path
                d="M1 1L10 14L19 1.0135"
                stroke="#666666"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </label>
        {isOpen.sizes && (
          <div className="filter__item filter__item--size">
            {sizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  value={size}
                  checked={(tempFilters.size as string[]).includes(size)}
                  onChange={(e) => handleCheckboxChange(e, "size")}
                />
                <div className="checkmark">{size}</div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label
          className="filter__name"
          onClick={() => toggleAccordion("price")}
        >
          FAIXA DE PREÇO
          <span className={`arrow ${isOpen.price ? "open" : ""}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="15"
              viewBox="0 0 20 15"
              fill="none"
            >
              <path
                d="M1 1L10 14L19 1.0135"
                stroke="#666666"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </label>
        {isOpen.price && (
          <div className="filter__item filter__item--price">
            {priceRanges.map((range) => (
              <label key={range.value}>
                <input
                  type="checkbox"
                  value={range.value}
                  checked={
                    tempFilters.minPrice ===
                      Number(range.value.split("-")[0]) &&
                    tempFilters.maxPrice ===
                      (range.value.split("-")[1] === "Infinity"
                        ? Infinity
                        : Number(range.value.split("-")[1]))
                  }
                  onChange={handlePriceRangeChange}
                />
                <span className="checkmark"></span>
                {range.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="filter__actions">
        <button
          className="filter__button filter__button--apply"
          onClick={applyFilters}
        >
          APLICAR
        </button>

        <button
          className="filter__button filter__button--clear"
          onClick={handleClearFilters}
        >
          LIMPAR
        </button>
      </div>
    </div>
  );
};

export default Filters;

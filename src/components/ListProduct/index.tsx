import React, {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useRef,
} from "react";
import { Filters as FiltersType } from "../../ts/types";
import ProductCard from "../ProductCard";
import Filters from "../Filters";

interface Product {
  id: number;
  name: string;
  price: number;
  parcelamento: [number, number];
  color: string;
  image: string;
  size: string[];
  date: string;
}

const ListProduct: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [isMobileFilterOpen, setModalFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersType>({
    color: [],
    size: [],
    minPrice: 0,
    maxPrice: Infinity,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<
    "recent" | "priceAsc" | "priceDesc"
  >("recent");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  const PRODUCTS_PER_PAGE = 9;
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const toggleFilterMobile = () => setModalFilterOpen(!isMobileFilterOpen);

  const filterMobileRef = useRef(null);

  const sortProducts = useCallback(
    (products: Product[]) => {
      switch (sortOrder) {
        case "recent":
          return products.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        case "priceAsc":
          return products.sort((a, b) => a.price - b.price);
        case "priceDesc":
          return products.sort((a, b) => b.price - a.price);
        default:
          return products;
      }
    },
    [sortOrder]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) {
          throw new Error(`Erro ao buscar dados: ${response.statusText}`);
        }
        const data: Product[] = await response.json();

        setAllProducts(data);

        const uniqueColors = Array.from(
          new Set(data.map((item) => item.color))
        );
        const uniqueSizes = Array.from(
          new Set(data.flatMap((item) => item.size))
        );

        setColors(uniqueColors);
        setSizes(uniqueSizes);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = allProducts.filter((product) => {
        const matchesColor =
          filters.color.length > 0
            ? filters.color.includes(product.color)
            : true;
        const matchesSize =
          filters.size.length > 0
            ? filters.size.some((size) => product.size.includes(size))
            : true;
        const matchesMinPrice =
          filters.minPrice !== 0 ? product.price >= filters.minPrice : true;
        const matchesMaxPrice =
          filters.maxPrice !== Infinity
            ? product.price <= filters.maxPrice
            : true;

        return (
          matchesColor && matchesSize && matchesMinPrice && matchesMaxPrice
        );
      });

      const sorted = sortProducts(filtered);
      setFilteredProducts(sorted);
    };

    applyFilters();
    toggleFilterMobile()

  }, [filters, sortOrder, allProducts, sortProducts]);

  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, visibleCount));
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + PRODUCTS_PER_PAGE);
  };

  const SortOptions = () => (
    <div className="sort-options">
      <label>
        Ordenar por:
        <select
          value={sortOrder}
          onChange={(e) =>
            setSortOrder(e.target.value as "recent" | "priceAsc" | "priceDesc")
          }
        >
          <option value="recent">Mais recente</option>
          <option value="priceAsc">Menor preço</option>
          <option value="priceDesc">Maior preço</option>
        </select>
      </label>
    </div>
  );

  const LoadingSpinner = () => (
    <div className="search__loading">
      <div className="loader"></div>
    </div>
  );

  const FilterMobile = () => {
    return (
      <div
        className={`filterMobile filterMobile--${
          isMobileFilterOpen ? "active" : "hidden"
        }`}
        ref={filterMobileRef}
      >
        <div className="filterMobile__container">
          <div className="filterMobile__content">
            <div className="filterMobile__header">
              <h2 className="filterMobile__title">FILTRAR</h2>
              <button
                className="filterMobile__close"
                onClick={toggleFilterMobile}
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
            </div>

            <div className="filterMobile__overflow">
              <Filters
                filters={filters}
                setFilters={setFilters}
                colors={colors}
                sizes={sizes}
              />
            </div>

          </div>
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;

  if (error) return <div>Erro: {error}</div>;

  return (
    <Fragment>
      <div className="search__head">
        <h2 className="search__title">Blusas</h2>
        <button className="filter__trigger-mobile" onClick={toggleFilterMobile}>
          Filtrar
        </button>
        <SortOptions />
      </div>
      <div className="product__list">
        <div className="filterWrapper filterWrapper__desktop">
          <Filters
            filters={filters}
            setFilters={setFilters}
            colors={colors}
            sizes={sizes}
          />
        </div>

        <FilterMobile />

        <div className="product__list--result">
          <ul className="product">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : filters.color.length > 0 ||
              filters.size.length > 0 ||
              filters.minPrice > 0 ||
              filters.maxPrice < Infinity ? (
              <div className="product__empty">
                Nenhum produto encontrado para o filtro selecionado.
              </div>
            ) : (
              <div className="product__empty">
                <LoadingSpinner />
              </div>
            )}
          </ul>
          {visibleProducts.length < filteredProducts.length &&
            visibleProducts.length > 0 && (
              <button onClick={handleLoadMore} className="loadMore">
                Carregar mais
              </button>
            )}
        </div>
      </div>
    </Fragment>
  );
};

export default ListProduct;

import { useCallback, useEffect, useMemo, useState } from "react";
import { Product } from "../ts/Product";
import axios from "axios";

interface ProductApiResponse {
  data: Product[];
  headers: {
    "x-total-count": string;
  };
}

interface useProductsProps {
  products: Product[];
  allProducts: Product[];
  error: string | null;
  isFetching: boolean;
  loadMore: () => void;
  isLastPage: boolean;
}

const ITEMS_PER_PAGE = 6;

export function useProducts(): useProductsProps {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState<number | null>(null);

  async function fetchProductsPage(
    pageToFetch: number
  ): Promise<ProductApiResponse> {
    return axios.get(
      `http://localhost:5000/products?_page=${pageToFetch}&_limit=${ITEMS_PER_PAGE}`
    );
  }

  async function fetchAllProducts(): Promise<ProductApiResponse> {
    return axios.get(`http://localhost:5000/products`);
  }

  const handleFetchError = useCallback((errorMessage: string) => {
    setError("Não foi possível listar os produtos: " + errorMessage);
  }, []);

  const fetchProducts = useCallback(async (pageToFetch: number) => {
    try {
      const response = await fetchProductsPage(pageToFetch);
      const listProducts = response.data as Product[];
      const responseAll = await fetchAllProducts();
      const listAllProducts = responseAll.data as Product[];

      setAllProducts(listAllProducts);
      setProducts((prevProducts) =>
        pageToFetch === 1 ? listProducts : [...prevProducts, ...listProducts]
      );

      const totalCountHeader = response.headers["x-total-count"];
      if (totalCountHeader) {
        setTotalItems(parseInt(totalCountHeader, 10));
      }
    } catch (error) {
      handleFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const loadMore = useCallback(() => {
    if (totalItems === null || (page - 1) * ITEMS_PER_PAGE < totalItems) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [totalItems, page]);

  const isLastPage = useMemo(() => {
    return totalItems !== null && page * ITEMS_PER_PAGE >= totalItems;
  }, [page, totalItems]);

  return {
    products,
    allProducts,
    error,
    isFetching,
    loadMore,
    isLastPage,
  };
}

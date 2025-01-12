import React from "react";
import Header from "./components/Header";

import { CartProvider } from "./context/CartContext"
// import ProductList from "./components/ProductList";
import ListProduct from "./components/ListProduct";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Header />
      
      <main className="search">
        <div className="search__content">
        <ListProduct />
          {/* <ProductList /> */}
        </div>
      </main>

      <footer>
        CADASTRA: Implantação de E-commerce VTEX
      </footer>
    </CartProvider> 
  );
};

export default App;

import React from "react";
import Header from "./components/Header";

import { CartProvider } from "./context/CartContext"
import ProductList from "./components/ProductList";

const App: React.FC = () => {
  return (
    <CartProvider>
      <Header />
      
      <main className="search">
        <div className="search__content">
          <ProductList />
        </div>
      </main>
    </CartProvider> 
  );
};

export default App;

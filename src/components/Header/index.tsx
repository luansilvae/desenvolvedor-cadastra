import React from "react";
import { Minicart } from "../Minicart";
import { useCart } from "../../hooks/useCart";
const Header: React.FC = () => {
  const { amountProducts, toggleMinicart } = useCart();

  return (
    <header className="header">
      <div className="header__container">
        <a href="/">
          <img src="../../img/logo-cadastra.png" alt="Logo Cadastra" />
        </a>

        <button className="minicart__button" onClick={toggleMinicart}>
          <img src="../../img/minicart-icon.png" alt="Minicart Icon" />
          <span className="minicart__amount">{amountProducts}</span>
        </button>

        <Minicart />
      </div>
    </header>
  );
};

export default Header;

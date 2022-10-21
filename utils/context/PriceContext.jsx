import React, { createContext, useContext, useState} from "react";

const Context = createContext();


export const PriceContext = ({ children }) => {

    const [selectedPrice, setSelectedPrice] = useState(null)

    const priceFormatter = (unit) => {
      const num = unit/100
      return new Intl.NumberFormat("en-GB", {style: "currency", currency: "gbp"}).format(num)
  } 
 
  return (
    <Context.Provider
      value={{
        selectedPrice,
        setSelectedPrice,
        priceFormatter
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const usePriceContext = () => useContext(Context);
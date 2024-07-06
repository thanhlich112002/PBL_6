import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext();

export function CityProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [key, setKey] = useState('');

  const updateLocation = (newCity) => {
    setSelectedLocation(newCity);
  };

  const updateKey = (newKey) => {
    setKey(newKey);
  };
  // const existingCart = localStorage.getItem('cart');
  const [cart, setCart] = useState({
    idStore: '',
    nameStore: '',
    products: []
});
const [productsCount, setProductsCount] = useState(0);
const updateProductsCount = (count) => {
  setProductsCount(count);
};
const [selectSearch, setSelectSearch] = useState("store");
  return (
    <CityContext.Provider value={{ selectedLocation, updateLocation, key, updateKey, cart, setCart, productsCount, setProductsCount, selectSearch, setSelectSearch}}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}

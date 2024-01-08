import { createContext, useContext, useEffect, useState } from "react";

const URL = "http://127.0.0.1:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const resp = await fetch(`${URL}/cities`);
        const data = await resp.json();
        setCities(data);
        // setIsLoading(false);
      } catch {
        alert("There was an error loading data... ");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        URL,
        cities,
        setCities,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(" Cities Context used outside Cities Provider");
  return context;
}

export default { CitiesProvider, useCities };

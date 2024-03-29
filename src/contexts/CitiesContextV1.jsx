import { createContext, useContext, useEffect, useState } from "react";

const URL = "http://127.0.0.1:8000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

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

  async function getCity(id) {
    try {
      setIsLoading(true);
      const resp = await fetch(`${URL}/cities/${id}`);
      const data = await resp.json();
      setCurrentCity(data);
      // setIsLoading(false);
    } catch {
      alert("There was an error loading data... ");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const resp = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await resp.json();
      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was an error creating city... ");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deletting city... ");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        setCities,
        isLoading,
        currentCity,
        setCurrentCity,
        getCity,
        createCity,
        removeCity,
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

export { CitiesProvider, useCities };

// import { createContext, useContext, useEffect, useReducer } from "react";

// const URL = "http://127.0.0.1:8000";

// const CitiesContext = createContext();

// const initialState = {
//   cities: [],
//   isLoading: false,
//   currentCity: {},
//   error: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "loading":
//       return { ...state, isLoading: true };
//     case "cities/loaded":
//       return { ...state, isLoading: false, cities: action.payload };
//     case "city/loaded":
//       return { ...state, isLoading: false, currentCity: action.payload };
//     case "city/created":
//       return {
//         ...state,
//         isLoading: false,
//         cities: [...state.cities, action.payload],
//       };
//     case "city/deleted":
//       return {
//         ...state,
//         isLoading: false,
//         cities: state.cities.filter((city) => city.id !== action.payload),
//       };
//     case "rejected":
//       return { ...state, isLoading: false, error: action.payload };
//     default:
//       throw new Error("Action action type");
//   }
// }

// function CitiesProvider({ children }) {
//   // const [cities, setCities] = useState([]);
//   // const [isLoading, setIsLoading] = useState(false);
//   // const [currentCity, setCurrentCity] = useState({});

//   const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
//     reducer,
//     initialState
//   );

//   useEffect(() => {
//     async function fetchCities() {
//       dispatch({ type: "loading" });
//       try {
//         const resp = await fetch(`${URL}/cities`);
//         const data = await resp.json();
//         dispatch({ type: "cities/loaded", payload: data });
//         // setIsLoading(false);
//       } catch {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error loading  data...",
//         });
//       }
//     }

//     fetchCities();
//   }, []);

//   async function getCity(id) {
//     dispatch({ type: "loading" });
//     try {
//       const resp = await fetch(`${URL}/cities/${id}`);
//       const data = await resp.json();
//       dispatch({ type: "city/loaded", payload: data });
//       // setIsLoading(false);
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error loading  cities...",
//       });
//     }
//   }

//   async function createCity(newCity) {
//     dispatch({ type: "loading" });
//     try {
//       const resp = await fetch(`${URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: {
//           "Content-type": "application/json",
//         },
//       });
//       const data = await resp.json();
//       dispatch({ type: "city/created", payload: data });
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error loading  city...",
//       });
//     }
//   }

//   async function removeCity(id) {
//     dispatch({ type: "loading" });
//     try {
//       await fetch(`${URL}/cities/${id}`, {
//         method: "DELETE",
//       });
//       dispatch({ type: "city/deleted", payload: id });
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error deleting  city...",
//       });
//     }
//   }

//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         getCity,
//         createCity,
//         removeCity,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error(" Cities Context used outside Cities Provider");
//   return context;
// }

// export { CitiesProvider, useCities };

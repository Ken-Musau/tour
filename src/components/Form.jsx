// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

import { useUrlPostion } from "../hooks/useUrlPostion";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  const navigate = useNavigate();

  const { createCity, isLoading } = useCities();
  const [lat, lng] = useUrlPostion();

  useEffect(() => {
    async function fetchCityData() {
      if (!lat && !lng) return;
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");

        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be a city. Click somewhere else😅"
          );
        setCityName(data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    }

    fetchCityData();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingGeocoding) return <Spinner />;
  if (!lat && !lng) return <Message message="Start by clicking on the map" />;

  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>

        <BackButton />
      </div>
    </form>
  );
}

export default Form;

// // "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

// import { useEffect, useReducer, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import styles from "./Form.module.css";
// import Button from "./Button";
// import BackButton from "./BackButton";
// import Message from "./Message";
// import Spinner from "./Spinner";

// import { useUrlPostion } from "../hooks/useUrlPostion";
// import { useCities } from "../contexts/CitiesContext";
// import { useNavigate } from "react-router-dom";

// function convertToEmoji(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

// const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// const initialState = {
//   isLoadingGeocoding: false,
//   cityName: "",
//   country: "",
//   date: new Date(),
//   notes: "",
//   emoji: "",
//   geoCodingError: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "geCoding/loading":
//       return { ...state, isLoadingGeocoding: true, geoCodingError: "" };

//     case "city/loaded":
//       return { ...state, isLoadingGeocoding: false, cityName: action.payload };

//     case "country/loaded":
//       return {
//         ...state,
//         isLoadingGeocoding: false,
//         countryName: action.payload,
//       };

//     case "emoji/loaded":
//       return { ...state, isLoadingGeocoding: false, emoji: action.payload };

//     case "date/loaded":
//       return { ...state, date: action.payoad };

//     case "notes/loaded":
//       return { ...state, notes: action.payload };

//     case "rejected":
//       return {
//         ...state,
//         isLoadingGeocoding: false,
//         geoCodingError: action.payload,
//       };

//     default:
//       throw new Error("unkwon action");
//   }
// }

// function Form() {
//   const [
//     {
//       isLoadingGeocoding,
//       cityName,
//       country,
//       date,
//       notes,
//       emoji,
//       geoCodingError,
//     },
//     dispatch,
//   ] = useReducer(reducer, initialState);

//   const { createCity, isLoading } = useCities();
//   const navigate = useNavigate();
//   const [lat, lng] = useUrlPostion();

//   useEffect(() => {
//     async function fetchCityData() {
//       if (!lat && !lng) return;
//       try {
//         dispatch({ type: "geCoding/loading" });

//         const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
//         const data = await res.json();

//         if (!data.countryCode)
//           throw new Error(
//             "That doesn't seem to be a city. Click somewhere else😅"
//           );
//         dispatch({ type: "city/loaded", payload: data.locality || "" });
//         dispatch({ type: "country/loaded", payload: data.country });
//         dispatch({
//           type: "emoji/loaded",
//           payload: convertToEmoji(data.countryCode),
//         });
//       } catch (err) {
//         dispatch({ type: "rejected", payload: err });
//       }
//     }

//     fetchCityData();
//   }, [lat, lng]);

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (!cityName || !date) return;
//     const newCity = {
//       cityName,
//       country,
//       emoji,
//       date,
//       notes,
//       position: { lat, lng },
//     };

//     await createCity(newCity);
//     navigate("/app/cities");
//   }

//   if (isLoadingGeocoding) return <Spinner />;
//   if (!lat && !lng) return <Message message="Start by clicking on the map" />;

//   if (geoCodingError) return <Message message={geoCodingError} />;
//   return (
//     <form
//       className={`${styles.form} ${isLoading ? styles.loading : ""}`}
//       onSubmit={handleSubmit}
//     >
//       <div className={styles.row}>
//         <label htmlFor="cityName">City name</label>
//         <input
//           id="cityName"
//           onChange={(e) =>
//             dispatch({ type: "city/loaded", payload: e.target.value })
//           }
//           value={cityName}
//         />
//         <span className={styles.flag}>{emoji}</span>
//       </div>

//       <div className={styles.row}>
//         <label htmlFor="date">When did you go to {cityName}?</label>
//         {/* <input
//           id="date"
//           onChange={(e) => setDate(e.target.value)}
//           value={date}
//         /> */}

//         <DatePicker
//           id="date"
//           onChange={(date) => dispatch({ type: "date/loaded", payload: date })}
//           selected={date}
//           minDate={new Date()}
//           dateFormat="dd/MM/yyyy"
//         />
//       </div>

//       <div className={styles.row}>
//         <label htmlFor="notes">Notes about your trip to {cityName}</label>
//         <textarea
//           id="notes"
//           onChange={(e) =>
//             dispatch({ type: "notes/loaded", payload: e.target.value })
//           }
//           value={notes}
//         />
//       </div>

//       <div className={styles.buttons}>
//         <Button type="primary">Add</Button>

//         <BackButton />
//       </div>
//     </form>
//   );
// }

// export default Form;

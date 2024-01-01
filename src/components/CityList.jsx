// import PropTypes from "prop-types";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";

function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city, index) => (
        <CityItem key={index} city={city} />
      ))}
    </ul>
  );
}

export default CityList;

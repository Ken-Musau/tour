// import PropTypes from "prop-types";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";

function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city, index) => (
        <CityItem key={index} city={city} />
      ))}
    </ul>
  );
}

export default CityList;

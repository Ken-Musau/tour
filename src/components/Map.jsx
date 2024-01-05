import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer}>
      <h1>Map</h1>
      <h2>
        position: {lat} and {lng}
      </h2>

      <button
        onClick={() => {
          setSearchParams({ lat: 50, lng: 30 });
        }}
      >
        Change
      </button>
    </div>
  );
}

export default Map;

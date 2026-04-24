import PriceRange from "../PriceRange";
import "./index.css";

const Filters = ({
  priceRangeValue,
  setPriceRangeValue,
  rating,
  setRating,
  setCurrentPage,
}) => {
  return (
    <div className="filters-container">

      {/* 🔥 PRICE FILTER */}
      <PriceRange
        sliderExtremes={[0, 1000]}
        sliderPositions={priceRangeValue}
        onChangeSliderPosition={(value) => {
          setPriceRangeValue(value);
          setCurrentPage(1);
        }}
      />

      {/* ⭐ RATING FILTER */}
      <div className="filter-block">
        <h3>Rating</h3>
        <select
          className="filter-select"
          value={rating}
          onChange={(e) => {
            setRating(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Ratings</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>
      </div>

    </div>
  );
};

export default Filters;
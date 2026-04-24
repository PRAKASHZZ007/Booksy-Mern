import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./index.css";

const BookItem = ({ bookItemDetails }) => {
  const { title, subtitle, image, price, id, rating } = bookItemDetails;

  const ratingValue = parseFloat(rating) || 0;

  // ⭐ render stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    // full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    // half star
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    // empty stars
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return stars;
  };

  return (
    <li className="book-item-container">
      <Link to={`/books/${id}`} className="book-item-nav-link">

        <img
          src={image || "https://via.placeholder.com/150"}
          alt={title}
          className="book-image"
        />

        <h3 className="book-title">{title}</h3>

        <p className="book-subtitle">{subtitle}</p>

        {/* ⭐ Rating UI */}
        <div className="book-rating">
          {renderStars()}
          <span className="rating-number">{ratingValue}</span>
        </div>

        <p className="book-price">₹ {price}</p>

      </Link>
    </li>
  );
};

export default BookItem;
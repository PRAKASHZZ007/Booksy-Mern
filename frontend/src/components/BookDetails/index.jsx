import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

import Header from "../Header";
import Loader from "../Loader";
import ErrorMessage from "../ErrorMessage";
import { addToCart } from "../redux/cartSlice";

import "./index.css";

const apiStatusConstants = {
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartList = useSelector((state) => state.cart.cartList);

  const [apiStatus, setApiStatus] = useState(apiStatusConstants.inProgress);
  const [bookDetailsData, setBookDetailsData] = useState({});
  const [similarBooks, setSimilarBooks] = useState([]);

  // ⭐ reusable rating function
  const getRating = (downloadCount) => {
    return (
      3 + ((downloadCount % 2000) / 2000) * 2
    ).toFixed(1);
  };

  // ⭐ star renderer
  const renderStars = (ratingValue) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    const remaining = 5 - stars.length;

    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }

    return stars;
  };

  // scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const getBookDetails = async () => {
      try {
        setApiStatus(apiStatusConstants.inProgress);
        setBookDetailsData({});
        setSimilarBooks([]);

        const response = await fetch(
          `https://gutendex.com/books/${id}`
        );
        const data = await response.json();

        const storedPrices =
          JSON.parse(localStorage.getItem("bookPrices")) || {};

        const subject = data.subjects?.[0] || "";

        const formattedData = {
          id: data.id,
          title: data.title,
          subtitle: subject,
          authors: data.authors.map((a) => a.name).join(", "),
          image: data.formats["image/jpeg"],
          desc: data.summaries?.[0] || "No description available",
          pages: data.download_count,
          publisher: "Gutenberg",
          year: "N/A",
          price:
            storedPrices[data.id] ||
            Math.floor(Math.random() * 500) + 100,

          // ⭐ rating
          rating: getRating(data.download_count),
        };

        setBookDetailsData(formattedData);

        // ✅ similar books
        if (subject) {
          const similarRes = await fetch(
            `https://gutendex.com/books?topic=${subject}`
          );
          const similarData = await similarRes.json();

          const formattedSimilar = similarData.results
            .filter((b) => b.id !== data.id)
            .slice(0, 3)
            .map((b) => ({
              id: b.id,
              title: b.title,
              image: b.formats["image/jpeg"],
              price:
                storedPrices[b.id] ||
                Math.floor(Math.random() * 500) + 100,

              // ⭐ rating for similar
              rating: getRating(b.download_count),
            }));

          setSimilarBooks(formattedSimilar);
        }

        setApiStatus(apiStatusConstants.success);
      } catch {
        setApiStatus(apiStatusConstants.failure);
      }
    };

    getBookDetails();
  }, [id]);

const onClickAddToCart = async () => {
  await dispatch(
    addToCart({
      bookId: bookDetailsData.id,
      title: bookDetailsData.title,
      subtitle: bookDetailsData.subtitle,
      price: bookDetailsData.price,
      image: bookDetailsData.image,
    })
  );
};

  const renderSuccessView = () => {
    const {
      title,
      image,
      subtitle,
      authors,
      price,
      desc,
      id,
      rating,
    } = bookDetailsData;

    const isAddedToCart = cartList?.some(
      (item) => String(item.bookId) === String(id)
    );

    return (
      <div className="book-details-container">
        <div className="book-details-content-container">

          {/* Book Details */}
          <div className="book-basic-details-container">
            <img
              src={image || "https://via.placeholder.com/150"}
              alt={title}
              className="book-details-image"
            />

            <div>
              <h1>{title}</h1>

              {/* ⭐ Rating */}
              <div className="book-rating">
                {renderStars(parseFloat(rating))}
                <span className="rating-number">{rating}</span>
              </div>

              <p>{subtitle}</p>
              <p>{authors}</p>

              <p className="book-details-price">₹ {price}</p>

              <button
                className="primary-btn"
                onClick={onClickAddToCart}
                disabled={isAddedToCart}
              >
                {isAddedToCart ? "Added to Cart" : "Add to Cart"}
              </button>

              <button
                className="secondary-btn"
                onClick={() => navigate("/books")}
              >
                Back to Books
              </button>
            </div>
          </div>

          {/* Description */}
          <h2>Description</h2>
          <p>{desc}</p>

          {/* Similar Books */}
          {similarBooks.length > 0 && (
            <>
              <h2>Similar Books</h2>

              <div className="similar-books-container">
                {similarBooks.map((book) => (
                  <div
                    key={book.id}
                    className="similar-book-card"
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <img
                      src={
                        book.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={book.title}
                    />

                    <p className="similar-title">{book.title}</p>

                    {/* ⭐ Rating */}
                    <div className="book-rating">
                      {renderStars(parseFloat(book.rating))}
                      <span className="rating-number">
                        {book.rating}
                      </span>
                    </div>

                    <p className="similar-price">
                      ₹ {book.price}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loader />;
      case apiStatusConstants.success:
        return renderSuccessView();
      default:
        return <ErrorMessage />;
    }
  };

  return (
    <>
      <Header />
      {renderView()}
    </>
  );
};

export default BookDetails;
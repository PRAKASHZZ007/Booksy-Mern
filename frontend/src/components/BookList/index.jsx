import { useEffect, useState } from "react";
import BookItem from "../BookItem";
import PriceRange from "../PriceRange";
import Header from "../Header";
import "./index.css";
import Loader from "../Loader";
import { Box, Typography,Paper } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const priceRangeExtreme = [0, 1000];

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const BookList = () => {
  const [booksData, setBooksData] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
  const [priceRangeValue, setPriceRangeValue] = useState(priceRangeExtreme);
  const [searchInput, setSearchInput] = useState("");
  const [rating, setRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 16;

  useEffect(() => {
    getBooks();
  }, []);

  const getBooks = async () => {
    setApiStatus(apiStatusConstants.inProgress);

    try {
      const MAX_PAGES = 5;

      const requests = Array.from({ length: MAX_PAGES }, (_, i) =>
        fetch(`https://gutendex.com/books?page=${i + 1}`)
      );

      const responses = await Promise.all(requests);
      const dataArray = await Promise.all(
        responses.map((res) => res.json())
      );

      let allBooks = [];

      const storedPrices =
        JSON.parse(localStorage.getItem("bookPrices")) || {};

      dataArray.forEach((data) => {
        const books = data.results.map((book) => {
          if (!storedPrices[book.id]) {
            storedPrices[book.id] =
              Math.floor(Math.random() * 500) + 100;
          }

          return {
            id: book.id,
            title: book.title,
            subtitle: book.subjects?.[0] || "No subtitle",
            image: book.formats["image/jpeg"],
            authors: book.authors.map((a) => a.name).join(", "),
            price: storedPrices[book.id],
            rating: Number(
              (
                3 +
                ((book.download_count % 2000) / 2000) * 2
              ).toFixed(1)
            ),
          };
        });

        allBooks = [...allBooks, ...books];
      });

      localStorage.setItem(
        "bookPrices",
        JSON.stringify(storedPrices)
      );

      setBooksData(allBooks);
      setApiStatus(apiStatusConstants.success);
    } catch (error) {
      console.error(error);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const getFilteredBooks = () => {
    return booksData.filter((book) => {
      const priceMatch =
        book.price >= priceRangeValue[0] &&
        book.price <= priceRangeValue[1];

      const searchMatch =
        searchInput === "" ||
        book.title.toLowerCase().includes(searchInput.toLowerCase());

      const ratingMatch =
        rating === "" || book.rating >= Number(rating);

      return priceMatch && searchMatch && ratingMatch;
    });
  };

  const filteredBooks = getFilteredBooks();
  const limitedBooks = filteredBooks.slice(0, 160);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;

  const currentBooks = limitedBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  const totalPages = Math.ceil(limitedBooks.length / booksPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const renderLoadingView = () => (
    <>
      <Header />
      <Loader />
    </>
  );

  const renderFailureView = () => (
    <div className="failure-container">
      <h1>Something went wrong</h1>
    </div>
  );

  const renderSuccessView = () => (
    <>
      <Header />
      <h1 className="book-items-heading">Books</h1>

      {/* 🔥 TOP CONTROLS (ONE LINE) */}
      <div className="top-controls">

        {/* PRICE */}
        <div className="control-item">
          <h4 className="label">Price</h4>
          <PriceRange
            sliderExtremes={priceRangeExtreme}
            sliderPositions={priceRangeValue}
            onChangeSliderPosition={(value) => {
              setPriceRangeValue(value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* SEARCH */}
        <div className="control-item">
          <h4 className="label">Search</h4>
          <input
            type="search"
            placeholder="Search books..."
            className="search-input"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* RATING */}
        <div className="control-item">
          <h4 className="label">Rating</h4>
          <select
            className="filter-select"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
          </select>
        </div>

      </div>

      {limitedBooks.length === 0 ? (
<Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  minHeight="70vh"
>
  <Paper
    elevation={4}
    sx={{
      padding: 6,
      borderRadius: 4,
      textAlign: "center",
      minWidth: 350,
    }}
  >
    <MenuBookIcon
      sx={{
        fontSize: 100,
        color: "#9e9e9e",
      }}
    />

<Typography
  variant="h4"
  mt={3}
  sx={{
    fontFamily: "Poppins, sans-serif",
    fontWeight: 600,
    letterSpacing: "0.5px",
  }}
>
  No Books Found
</Typography>

<Typography
  variant="body1"
  sx={{
    fontFamily: "Poppins, sans-serif",
    color: "text.secondary",
    mt: 1,
  }}
>
  Try changing filters or search keyword
</Typography>
  </Paper>
</Box>
      ) : (
        <>
          <ul className="book-list-container">
            {currentBooks.map((book) => (
              <BookItem key={book.id} bookItemDetails={book} />
            ))}
          </ul>

          <div className="pagination-container">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={
                  currentPage === index + 1 ? "active" : ""
                }
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );

  switch (apiStatus) {
    case apiStatusConstants.success:
      return renderSuccessView();
    case apiStatusConstants.failure:
      return renderFailureView();
    case apiStatusConstants.inProgress:
      return renderLoadingView();
    default:
      return null;
  }
};

export default BookList;
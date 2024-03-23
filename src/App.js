import { useEffect, useState } from "react";
import NavBar, { Logo, Search, Results } from "./NavBar";
import StarRating from "./StarRating";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const key = "f41cabff";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [query, setQuery] = useState("");
  const [movieId, setMovieId] = useState(null);

  function handleMovieId(id) {
    setMovieId((movieId) => {
      return movieId === id ? null : id;
    });
  }
  function handleAddWatchedMovie(movie) {
    setWatched((watched) => {
      return [...watched, movie];
    });
  }
  function handleCloseId() {
    setMovieId(null);
  }
  useEffect(
    function () {
      async function fetchMovie() {
        setIsLoading(true);
        try {
          setErrors("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`
          );
          if (!res.ok) throw new Error("Network issue unable to fetch");

          const data = await res.json();

          if (data.Response === "False") {
            throw Error("Movie Not found");
          }

          setMovies(data.Search);
        } catch (error) {
          setErrors(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setErrors("");
        return;
      }
      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !errors && (
            <MovieList movies={movies} handleMovieId={handleMovieId} />
          )}
          {errors && <Error errorREC={errors} />}
        </Box>

        <Box>
          {movieId ? (
            <MovieDetails
              movieId={movieId}
              handleCloseId={handleCloseId}
              watched={watched}
              // key={movieId}
              handleAddWatchedMovie={handleAddWatchedMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading....</p>;
}
function Error({ errorREC }) {
  console.log(errorREC);
  return <p className="error">{errorREC}</p>;
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieDetails({
  movieId,
  handleCloseId,
  handleAddWatchedMovie,
  watched,
}) {
  const [movieDetailFetched, setMovieDetailFetched] = useState({});
  const [userRating, setUserRating] = useState(0);
  const isWatched = watched.map((value) => value.imdbID).includes(movieId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetailFetched;
  function addMovie() {
    const newMovie = {
      imdbID: movieId,
      poster,
      title,
      year,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    handleAddWatchedMovie(newMovie);
    handleCloseId();
  }
  useState(
    function () {
      async function movieDetail() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${movieId}`
        );
        const data = await res.json();
        setMovieDetailFetched(data);
      }
      movieDetail();
    },
    [movieId]
  );
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={handleCloseId}>
          {" "}
          &larr;
        </button>
        <img src={poster} alt={`poster of ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p> You have watched this movie</p>
          ) : (
            <>
              <StarRating maxrating={10} onSetRating={setUserRating} />
              {userRating > 0 && (
                <button className="btn-add" onClick={addMovie}>
                  + Add to list
                </button>
              )}
            </>
          )}
        </div>
        <p>
          <em>{plot}</em>{" "}
        </p>
        <p> starring {actors}</p>
        <p> Directied by {director}</p>
      </section>
    </div>
  );
}

function MovieList({ movies, handleMovieId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => handleMovieId(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

import { useEffect, useRef } from "react";

export default function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
export function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
export function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useEffect(function () {
    function callBack(e) {
      if (e.code === "Enter") {
        inputEl.current.focus();
      }
    }
    document.addEventListener("keydown", callBack);
    return function () {
      document.removeEventListener("keydown", callBack);
    };
  }, []);
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
export function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

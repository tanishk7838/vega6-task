import React, { useEffect, useState } from "react";
import "./Search.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = "sdAmg6v_01EHBS2qADqvvkSS8EBIVZTl0aRMhsp8Gxc";
const img_per_page = 20;
function Search({ user, setSrc }) {
  const [userInput, setUserInput] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    fetchImg();
  }, [page]);

  const fetchImg = () => {
    axios
      .get(
        `${API_URL}?query=${userInput}&page=${page}&per_page=${img_per_page}&client_id=${API_KEY}`
      )
      .then((res) => {
        setTotalPages(res.data.total_pages);
        setData(res.data.results);
      });
  };

  const handelSearch = () => {
    fetchImg();
    setPage(1);
  };
  return (
    <div className="search-container">
      <div className="header">
        <p>
          Name : <span>{user.name}</span>
        </p>
        <p>
          Email : <span>{user.email}</span>
        </p>
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your search term"
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button onClick={handelSearch}>Search</button>
      </div>
      <div className="grid">
        {data.map((item, index) => {
          return (
            <div className="img-container" key={index}>
              <img crossOrigin="anonymous" src={item.urls.small} key={index} height={200} width={200} />
              <button
                onClick={()=>{
                  setSrc(item.urls.small)
                  navigate('/canvas')
                }}
              >
                Add Caption
              </button>
            </div>
          );
        })}
      </div>

      <div className="bottom-btn">
        {page === 1 && (
          <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
        )}
        {page > 1 && page < totalPages && (
          <div>
            <button onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </button>
            <button onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        )}
        {page === totalPages && (
          <button onClick={() => setPage((prev) => prev - 1)}>Previous</button>
        )}
      </div>
    </div>
  );
}

export default Search;

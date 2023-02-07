import "./styles.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import YouTube from "react-youtube";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState({});
  const [trailer, setTrailer] = useState({});
  const [hasSelect, setHasSelect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [existsGenre, setExistsGenre] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "35627d0c839e289546d71029e8068e67";
  const IMAGE_URL = "https://image.tmdb.org/t/p/original";

  let allGenres = [
    {
      id: 28,
      name: "Action"
    },
    {
      id: 12,
      name: "Adventure"
    },
    {
      id: 16,
      name: "Animation"
    },
    {
      id: 35,
      name: "Comedy"
    },
    {
      id: 80,
      name: "Crime"
    },
    {
      id: 99,
      name: "Documentary"
    },
    {
      id: 18,
      name: "Drama"
    },
    {
      id: 10751,
      name: "Family"
    },
    {
      id: 14,
      name: "Fantasy"
    },
    {
      id: 36,
      name: "History"
    },
    {
      id: 27,
      name: "Horror"
    },
    {
      id: 10402,
      name: "Music"
    },
    {
      id: 9648,
      name: "Mystery"
    },
    {
      id: 10749,
      name: "Romance"
    },
    {
      id: 878,
      name: "Science Fiction"
    },
    {
      id: 10770,
      name: "TV Movie"
    },
    {
      id: 53,
      name: "Thriller"
    },
    {
      id: 10752,
      name: "War"
    },
    {
      id: 37,
      name: "Western"
    }
  ];

  const fetchMovies = (searchKey) => {
    const type = searchKey ? "search" : "discover";
    axios

      .get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey
        }
      })
      .then((data) => {
        setMovies(data.data.results);
        console.log(data.data.results);
        if (data.data.results.length > 0) {
          type === "search"
            ? fetchMovie(data.data.results[0].id)
            : fetchMovie(data.data.results[Math.round(Math.random() * 20)].id);
        }
      });
  };

  const fetchMovie = (id) => {
    window.scroll(0, 0);
    axios
      .get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos"
        }
      })
      .then((data) => {
        setMovie(data.data);
        console.log(data.data);
        if (data.data.videos && data.data.videos.results) {
          const trailer = data.data.videos.results.find(
            (vid) => vid.type === "Trailer"
          );
          setTrailer(trailer ? trailer : data.data.videos.results[0]);
          !trailer && setIsPlaying(false);
        }

        setHasSelect(true);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>Movies</h1>
        <input
          type="text"
          placeholder="Name of the movie"
          onInput={(e) => fetchMovies(e.target.value)}
        />
      </header>

      <div className="movieContainer">
        {hasSelect ? (
          <div className="movieBig">
            {isPlaying ? (
              <>
                <div className="movieBig_info-header">
                  <button onClick={() => setIsPlaying(false)}>
                    Close trailer
                  </button>
                  <h3>{movie.original_title}</h3>
                </div>
                <YouTube
                  videoId={trailer.key}
                  className="reproductor container"
                  containerClassName={"youtube-container amru"}
                  opts={{
                    width: "100%",
                    height: "450rem",
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      cc_load_policy: 0,
                      fs: 0,
                      iv_load_policy: 0,
                      modestbranding: 0,
                      rel: 0,
                      showinfo: 0
                    }
                  }}
                />
              </>
            ) : (
              <>
                <LazyLoadImage
                  src={`${IMAGE_URL}/${movie.backdrop_path}`}
                  alt={`${movie.original_title} image`}
                  effect="blur"
                  className="movie__image"
                  width="100%"
                  height="100%"
                />
                <div className="movieBig__info">
                  <div className="movieBig_info-header">
                    {trailer ? (
                      <button onClick={() => setIsPlaying(true)}>
                        Play trailer
                      </button>
                    ) : null}

                    <h3>{movie.original_title}</h3>
                  </div>
                  <p className="movieBig__info-overview">{movie.overview}</p>
                  <div className="movieBig__info-genres">
                    {movie.genres.map((genre) => (
                      <small key={genre.id}>{genre.name}</small>
                    ))}
                  </div>
                  <p
                    className="movieBig__info-vote"
                    style={{
                      color:
                        movie.vote_average > 7.5
                          ? "green"
                          : movie.vote_average > 5
                          ? "orange"
                          : "red",
                      borderColor:
                        movie.vote_average > 7.5
                          ? "green"
                          : movie.vote_average > 5
                          ? "orange"
                          : "red"
                    }}
                  >
                    {movie.vote_average.toFixed(2)}
                  </p>
                  <a
                    href={movie.homepage}
                    target="_blank"
                    className="movieBig__info-site"
                  >
                    Sitio oficial
                  </a>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      <div className="movies">
        {allGenres.map((genre) => (
          <>
            {movies.map((movieMap) => (
              <>
                {movieMap.genre_ids.map((genre_id) => (
                  <>
                    {genre.id == genre_id ? <>{(genre.exist = true)}</> : null}
                  </>
                ))}
              </>
            ))}
            {genre.exist ? (
              <div>
                <h2>{genre.name}</h2>
                <div className="moviesCathegory">
                  {movies.map((movieMap) => (
                    <>
                      {movieMap.genre_ids.map((genre_id) => (
                        <>
                          {genre.id == genre_id ? (
                            <>
                              {(genre.exist = true)}
                              <div
                                className="movie"
                                key={movieMap.id}
                                onClick={() => fetchMovie(movieMap.id)}
                              >
                                <div>
                                  <LazyLoadImage
                                    src={`${IMAGE_URL}/${movieMap.poster_path}`}
                                    alt={`${movieMap.original_title} image`}
                                    effect="blur"
                                    className="movie__image"
                                    height="400px"
                                    width="100%"
                                  />
                                  <h3>{movieMap.original_title}</h3>
                                  <small>{movieMap.overview}</small>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </>
                      ))}
                    </>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import Loading from './components/UI/Loading';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  // function fetchMovieHandler(e){
  //   e.preventDefault()
  //   fetch('https://swapi.dev/api/films/').then(response => {
  //     return response.json()
  //   }).then(data => {
  //     const transformedMovies = data.results.map((movieData) => {
  //       return {
  //         id: movieData.episode_id,
  //         title: movieData.title,
  //         openingText: movieData.opening_crawl,
  //         releaseDate: movieData.release_date
  //       }
  //     })

  //     setMovies(transformedMovies)
  //   })
  // }

  //POST
  async function addMovieHandler(movie){
    const response = await fetch('https://react-http-d779a-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie), //convert to json
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    console.log(data)
  }

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null)

    try{
      const response = await fetch('https://react-http-d779a-default-rtdb.firebaseio.com/movies.json')// /movies.json is up to you
      
      if(!response.ok){
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      const loadedMovies = [];

      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }
    
      
      setMovies(loadedMovies)
    }catch(error){
      setError(error.message)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchMovieHandler()
  }, [fetchMovieHandler])

  let content = <p> Found no movies. </p>;

  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  if(error){
    content = <p> {error} </p>
  }
  if(isLoading){
    content = <Loading />
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        <button onClick={fetchMovieHandler} >Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;

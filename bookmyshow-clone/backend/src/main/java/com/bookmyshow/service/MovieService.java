package com.bookmyshow.service;

import com.bookmyshow.dto.response.MovieResponse;
import com.bookmyshow.entity.Movie;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {
    
    @Autowired
    private MovieRepository movieRepository;
    
    public List<MovieResponse> getAllMovies(Long cityId, String language, String genre, String format) {
        List<Movie> movies;
        
        if (cityId != null) {
            movies = movieRepository.findMoviesWithFilters(cityId, language, genre, format);
        } else {
            movies = movieRepository.findAll();
        }
        
        return movies.stream()
            .map(MovieResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<MovieResponse> getNowShowingMovies() {
        return movieRepository.findByStatus(Movie.MovieStatus.NOW_SHOWING).stream()
            .map(MovieResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<MovieResponse> getComingSoonMovies() {
        return movieRepository.findByStatus(Movie.MovieStatus.COMING_SOON).stream()
            .map(MovieResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
        return MovieResponse.fromEntity(movie);
    }
}


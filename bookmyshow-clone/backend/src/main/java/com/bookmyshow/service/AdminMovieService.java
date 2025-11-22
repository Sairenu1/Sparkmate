package com.bookmyshow.service;

import com.bookmyshow.dto.response.MovieResponse;
import com.bookmyshow.entity.Movie;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminMovieService {
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Transactional
    public MovieResponse createMovie(Movie movie) {
        movie = movieRepository.save(movie);
        return MovieResponse.fromEntity(movie);
    }
    
    @Transactional
    public MovieResponse updateMovie(Long id, Movie movieDetails) {
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        
        movie.setTitle(movieDetails.getTitle());
        movie.setDescription(movieDetails.getDescription());
        movie.setDuration(movieDetails.getDuration());
        movie.setPosterUrl(movieDetails.getPosterUrl());
        movie.setRating(movieDetails.getRating());
        movie.setReleaseDate(movieDetails.getReleaseDate());
        movie.setLanguages(movieDetails.getLanguages());
        movie.setGenres(movieDetails.getGenres());
        movie.setStatus(movieDetails.getStatus());
        
        movie = movieRepository.save(movie);
        return MovieResponse.fromEntity(movie);
    }
    
    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));
        movieRepository.delete(movie);
    }
    
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream()
            .map(MovieResponse::fromEntity)
            .collect(Collectors.toList());
    }
}


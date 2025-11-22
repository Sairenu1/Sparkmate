package com.bookmyshow.controller;

import com.bookmyshow.dto.response.MovieResponse;
import com.bookmyshow.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "*")
public class MovieController {
    
    @Autowired
    private MovieService movieService;
    
    @GetMapping
    public ResponseEntity<List<MovieResponse>> getAllMovies(
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String format) {
        return ResponseEntity.ok(movieService.getAllMovies(cityId, language, genre, format));
    }
    
    @GetMapping("/now-showing")
    public ResponseEntity<List<MovieResponse>> getNowShowingMovies() {
        return ResponseEntity.ok(movieService.getNowShowingMovies());
    }
    
    @GetMapping("/coming-soon")
    public ResponseEntity<List<MovieResponse>> getComingSoonMovies() {
        return ResponseEntity.ok(movieService.getComingSoonMovies());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }
}


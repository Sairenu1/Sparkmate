package com.bookmyshow.controller;

import com.bookmyshow.dto.response.MovieResponse;
import com.bookmyshow.entity.Movie;
import com.bookmyshow.service.AdminMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/movies")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMovieController {
    
    @Autowired
    private AdminMovieService adminMovieService;
    
    @GetMapping
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        return ResponseEntity.ok(adminMovieService.getAllMovies());
    }
    
    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@RequestBody Movie movie) {
        return ResponseEntity.ok(adminMovieService.createMovie(movie));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MovieResponse> updateMovie(@PathVariable Long id, @RequestBody Movie movie) {
        return ResponseEntity.ok(adminMovieService.updateMovie(id, movie));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        adminMovieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}


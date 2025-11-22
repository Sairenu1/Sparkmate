package com.bookmyshow.dto.response;

import com.bookmyshow.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private String posterUrl;
    private Double rating;
    private LocalDate releaseDate;
    private String languages;
    private String genres;
    private Movie.MovieStatus status;
    
    public static MovieResponse fromEntity(Movie movie) {
        return new MovieResponse(
            movie.getId(),
            movie.getTitle(),
            movie.getDescription(),
            movie.getDuration(),
            movie.getPosterUrl(),
            movie.getRating(),
            movie.getReleaseDate(),
            movie.getLanguages(),
            movie.getGenres(),
            movie.getStatus()
        );
    }
}


package com.bookmyshow.repository;

import com.bookmyshow.entity.Movie;
import com.bookmyshow.entity.Movie.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByStatus(MovieStatus status);
    
    @Query("SELECT DISTINCT m FROM Movie m " +
           "JOIN m.shows s " +
           "JOIN s.screen sc " +
           "JOIN sc.theater t " +
           "WHERE t.city.id = :cityId " +
           "AND (:language IS NULL OR m.languages LIKE %:language%) " +
           "AND (:genre IS NULL OR m.genres LIKE %:genre%) " +
           "AND (:format IS NULL OR EXISTS (SELECT sh FROM Show sh WHERE sh.movie = m AND sh.format = :format))")
    List<Movie> findMoviesWithFilters(@Param("cityId") Long cityId,
                                      @Param("language") String language,
                                      @Param("genre") String genre,
                                      @Param("format") String format);
}


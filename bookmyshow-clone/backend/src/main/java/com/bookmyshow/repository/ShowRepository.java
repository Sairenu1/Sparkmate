package com.bookmyshow.repository;

import com.bookmyshow.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByMovieId(Long movieId);
    
    @Query("SELECT s FROM Show s " +
           "WHERE s.movie.id = :movieId " +
           "AND s.screen.theater.city.id = :cityId " +
           "AND DATE(s.startTime) = :date " +
           "ORDER BY s.startTime")
    List<Show> findShowsByMovieAndCityAndDate(@Param("movieId") Long movieId,
                                               @Param("cityId") Long cityId,
                                               @Param("date") LocalDate date);
    
    @Query("SELECT s FROM Show s " +
           "WHERE s.movie.id = :movieId " +
           "AND s.screen.theater.city.id = :cityId " +
           "AND s.startTime >= :startDateTime " +
           "AND s.startTime < :endDateTime " +
           "ORDER BY s.startTime")
    List<Show> findShowsByMovieAndCityAndDateRange(@Param("movieId") Long movieId,
                                                    @Param("cityId") Long cityId,
                                                    @Param("startDateTime") LocalDateTime startDateTime,
                                                    @Param("endDateTime") LocalDateTime endDateTime);
}


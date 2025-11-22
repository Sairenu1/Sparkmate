package com.bookmyshow.repository;

import com.bookmyshow.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    
    @Query("SELECT b FROM Booking b " +
           "WHERE (:movieId IS NULL OR b.show.movie.id = :movieId) " +
           "AND (:theaterId IS NULL OR b.show.screen.theater.id = :theaterId) " +
           "AND (:date IS NULL OR DATE(b.show.startTime) = :date)")
    List<Booking> findBookingsWithFilters(@Param("movieId") Long movieId,
                                          @Param("theaterId") Long theaterId,
                                          @Param("date") LocalDate date);
}


package com.bookmyshow.repository;

import com.bookmyshow.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByScreenId(Long screenId);
    
    Optional<Seat> findByScreenIdAndRowLabelAndSeatNumber(Long screenId, String rowLabel, Integer seatNumber);
    
    @Query("SELECT s FROM Seat s " +
           "WHERE s.screen.id = :screenId " +
           "AND s.id NOT IN " +
           "(SELECT bs.seat.id FROM BookingSeat bs " +
           "JOIN bs.booking b " +
           "WHERE b.show.id = :showId " +
           "AND b.status = 'CONFIRMED')")
    List<Seat> findAvailableSeatsByShow(@Param("screenId") Long screenId, @Param("showId") Long showId);
}


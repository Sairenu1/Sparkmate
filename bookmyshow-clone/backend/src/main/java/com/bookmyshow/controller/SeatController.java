package com.bookmyshow.controller;

import com.bookmyshow.dto.response.SeatResponse;
import com.bookmyshow.entity.Seat;
import com.bookmyshow.repository.BookingSeatRepository;
import com.bookmyshow.repository.SeatRepository;
import com.bookmyshow.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shows/{showId}/seats")
@CrossOrigin(origins = "*")
public class SeatController {
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private BookingSeatRepository bookingSeatRepository;
    
    @GetMapping
    public ResponseEntity<List<SeatResponse>> getSeatsByShow(@PathVariable Long showId) {
        var show = showRepository.findById(showId)
            .orElseThrow(() -> new RuntimeException("Show not found"));
        
        Long screenId = show.getScreen().getId();
        List<Seat> allSeats = seatRepository.findByScreenId(screenId);
        
        // Get booked seats for this show
        List<Seat> availableSeats = seatRepository.findAvailableSeatsByShow(screenId, showId);
        Set<Long> availableSeatIds = availableSeats.stream()
            .map(Seat::getId)
            .collect(Collectors.toSet());
        
        List<SeatResponse> seatResponses = allSeats.stream()
            .map(seat -> SeatResponse.fromEntity(seat, availableSeatIds.contains(seat.getId())))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(seatResponses);
    }
}


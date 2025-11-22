package com.bookmyshow.service;

import com.bookmyshow.dto.response.BookingResponse;
import com.bookmyshow.dto.response.MovieResponse;
import com.bookmyshow.dto.response.UserResponse;
import com.bookmyshow.entity.*;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        long totalBookings = bookingRepository.count();
        summary.put("totalBookings", totalBookings);
        
        long confirmedBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
            .count();
        summary.put("confirmedBookings", confirmedBookings);
        
        double totalRevenue = paymentRepository.findAll().stream()
            .filter(p -> p.getStatus() == Payment.PaymentStatus.SUCCESS)
            .mapToDouble(Payment::getAmount)
            .sum();
        summary.put("totalRevenue", totalRevenue);
        
        long totalUsers = userRepository.count();
        summary.put("totalUsers", totalUsers);
        
        long totalMovies = movieRepository.count();
        summary.put("totalMovies", totalMovies);
        
        // Top movies by bookings
        Map<Long, Long> movieBookingCounts = bookingRepository.findAll().stream()
            .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
            .collect(Collectors.groupingBy(
                b -> b.getShow().getMovie().getId(),
                Collectors.counting()
            ));
        
        List<Map<String, Object>> topMovies = movieBookingCounts.entrySet().stream()
            .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Movie movie = movieRepository.findById(entry.getKey()).orElse(null);
                if (movie == null) return null;
                Map<String, Object> movieData = new HashMap<>();
                movieData.put("movieId", movie.getId());
                movieData.put("title", movie.getTitle());
                movieData.put("bookingCount", entry.getValue());
                return movieData;
            })
            .filter(m -> m != null)
            .collect(Collectors.toList());
        
        summary.put("topMovies", topMovies);
        
        return summary;
    }
    
    public List<BookingResponse> getAllBookings(Long movieId, Long theaterId, LocalDate date) {
        return bookingRepository.findBookingsWithFilters(movieId, theaterId, date).stream()
            .map(BookingResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
    }
}


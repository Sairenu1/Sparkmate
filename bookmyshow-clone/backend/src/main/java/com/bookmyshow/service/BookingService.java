package com.bookmyshow.service;

import com.bookmyshow.dto.request.CreateBookingRequest;
import com.bookmyshow.dto.response.BookingResponse;
import com.bookmyshow.entity.*;
import com.bookmyshow.exception.BadRequestException;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private BookingSeatRepository bookingSeatRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Show show = showRepository.findById(request.getShowId())
            .orElseThrow(() -> new ResourceNotFoundException("Show not found"));
        
        // Validate seats
        List<Seat> seats = request.getSeatIds().stream()
            .map(seatId -> seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatId)))
            .collect(Collectors.toList());
        
        // Check if seats belong to the show's screen
        Long screenId = show.getScreen().getId();
        for (Seat seat : seats) {
            if (!seat.getScreen().getId().equals(screenId)) {
                throw new BadRequestException("Seat does not belong to this screen");
            }
        }
        
        // Check if seats are available
        List<Seat> availableSeats = seatRepository.findAvailableSeatsByShow(screenId, show.getId());
        for (Seat seat : seats) {
            boolean isAvailable = availableSeats.stream()
                .anyMatch(s -> s.getId().equals(seat.getId()));
            if (!isAvailable) {
                throw new BadRequestException("Seat " + seat.getSeatLabel() + " is not available");
            }
        }
        
        // Calculate total amount
        double totalAmount = seats.stream()
            .mapToDouble(seat -> {
                // Price based on seat category
                double multiplier = switch (seat.getCategory()) {
                    case PLATINUM -> 1.5;
                    case GOLD -> 1.2;
                    case SILVER -> 1.0;
                };
                return show.getBasePrice() * multiplier;
            })
            .sum();
        
        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShow(show);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking = bookingRepository.save(booking);
        
        // Create booking seats
        for (int i = 0; i < seats.size(); i++) {
            Seat seat = seats.get(i);
            double seatPrice = show.getBasePrice() * switch (seat.getCategory()) {
                case PLATINUM -> 1.5;
                case GOLD -> 1.2;
                case SILVER -> 1.0;
            };
            
            BookingSeat bookingSeat = new BookingSeat();
            bookingSeat.setBooking(booking);
            bookingSeat.setSeat(seat);
            bookingSeat.setPrice(seatPrice);
            bookingSeatRepository.save(bookingSeat);
        }
        
        return BookingResponse.fromEntity(bookingRepository.findById(booking.getId()).orElse(booking));
    }
    
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        // Check if user owns the booking or is admin
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!booking.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Unauthorized to view this booking");
        }
        
        return BookingResponse.fromEntity(booking);
    }
    
    public List<BookingResponse> getUserBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return bookingRepository.findByUserId(user.getId()).stream()
            .map(BookingResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);
        
        return BookingResponse.fromEntity(booking);
    }
}


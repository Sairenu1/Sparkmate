package com.bookmyshow.dto.response;

import com.bookmyshow.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private ShowResponse show;
    private Double totalAmount;
    private Booking.BookingStatus status;
    private LocalDateTime createdAt;
    private List<BookingSeatResponse> seats;
    private PaymentResponse payment;
    
    public static BookingResponse fromEntity(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUser().getId());
        response.setUserName(booking.getUser().getName());
        response.setShow(ShowResponse.fromEntity(booking.getShow()));
        response.setTotalAmount(booking.getTotalAmount());
        response.setStatus(booking.getStatus());
        response.setCreatedAt(booking.getCreatedAt());
        response.setSeats(booking.getBookingSeats().stream()
            .map(BookingSeatResponse::fromEntity)
            .collect(Collectors.toList()));
        if (booking.getPayment() != null) {
            response.setPayment(PaymentResponse.fromEntity(booking.getPayment()));
        }
        return response;
    }
}


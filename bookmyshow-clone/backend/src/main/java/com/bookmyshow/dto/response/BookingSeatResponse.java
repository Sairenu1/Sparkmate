package com.bookmyshow.dto.response;

import com.bookmyshow.entity.BookingSeat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeatResponse {
    private Long id;
    private Long seatId;
    private String seatLabel;
    private Double price;
    
    public static BookingSeatResponse fromEntity(BookingSeat bookingSeat) {
        BookingSeatResponse response = new BookingSeatResponse();
        response.setId(bookingSeat.getId());
        response.setSeatId(bookingSeat.getSeat().getId());
        response.setSeatLabel(bookingSeat.getSeat().getSeatLabel());
        response.setPrice(bookingSeat.getPrice());
        return response;
    }
}


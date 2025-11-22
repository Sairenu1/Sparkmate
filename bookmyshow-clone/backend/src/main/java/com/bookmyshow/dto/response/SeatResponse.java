package com.bookmyshow.dto.response;

import com.bookmyshow.entity.Seat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
    private Long id;
    private String rowLabel;
    private Integer seatNumber;
    private String seatLabel;
    private Seat.SeatCategory category;
    private boolean available;
    
    public static SeatResponse fromEntity(Seat seat, boolean available) {
        SeatResponse response = new SeatResponse();
        response.setId(seat.getId());
        response.setRowLabel(seat.getRowLabel());
        response.setSeatNumber(seat.getSeatNumber());
        response.setSeatLabel(seat.getSeatLabel());
        response.setCategory(seat.getCategory());
        response.setAvailable(available);
        return response;
    }
}


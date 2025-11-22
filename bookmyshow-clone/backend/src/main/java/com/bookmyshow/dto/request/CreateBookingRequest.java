package com.bookmyshow.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateBookingRequest {
    @NotNull(message = "Show ID is required")
    private Long showId;
    
    @NotEmpty(message = "At least one seat must be selected")
    private List<Long> seatIds;
}


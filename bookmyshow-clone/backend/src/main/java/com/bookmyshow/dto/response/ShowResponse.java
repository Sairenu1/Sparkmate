package com.bookmyshow.dto.response;

import com.bookmyshow.entity.Show;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowResponse {
    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long screenId;
    private String screenName;
    private Long theaterId;
    private String theaterName;
    private String theaterAddress;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double basePrice;
    private String language;
    private String format;
    
    public static ShowResponse fromEntity(Show show) {
        ShowResponse response = new ShowResponse();
        response.setId(show.getId());
        response.setMovieId(show.getMovie().getId());
        response.setMovieTitle(show.getMovie().getTitle());
        response.setScreenId(show.getScreen().getId());
        response.setScreenName(show.getScreen().getName());
        response.setTheaterId(show.getScreen().getTheater().getId());
        response.setTheaterName(show.getScreen().getTheater().getName());
        response.setTheaterAddress(show.getScreen().getTheater().getAddress());
        response.setStartTime(show.getStartTime());
        response.setEndTime(show.getEndTime());
        response.setBasePrice(show.getBasePrice());
        response.setLanguage(show.getLanguage());
        response.setFormat(show.getFormat());
        return response;
    }
}


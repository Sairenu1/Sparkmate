package com.bookmyshow.service;

import com.bookmyshow.dto.response.ShowResponse;
import com.bookmyshow.entity.Show;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.ShowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {
    
    @Autowired
    private ShowRepository showRepository;
    
    public List<ShowResponse> getShowsByMovieAndCity(Long movieId, Long cityId, LocalDate date) {
        List<Show> shows;
        
        if (date != null) {
            shows = showRepository.findShowsByMovieAndCityAndDate(movieId, cityId, date);
        } else {
            LocalDateTime startDateTime = LocalDateTime.now();
            LocalDateTime endDateTime = startDateTime.plusDays(7);
            shows = showRepository.findShowsByMovieAndCityAndDateRange(movieId, cityId, startDateTime, endDateTime);
        }
        
        return shows.stream()
            .map(ShowResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    public ShowResponse getShowById(Long id) {
        Show show = showRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Show not found with id: " + id));
        return ShowResponse.fromEntity(show);
    }
}


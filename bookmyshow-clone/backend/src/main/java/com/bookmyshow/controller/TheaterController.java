package com.bookmyshow.controller;

import com.bookmyshow.entity.Theater;
import com.bookmyshow.repository.TheaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@CrossOrigin(origins = "*")
public class TheaterController {
    
    @Autowired
    private TheaterRepository theaterRepository;
    
    @GetMapping
    public ResponseEntity<List<Theater>> getTheaters(@RequestParam(required = false) Long cityId) {
        if (cityId != null) {
            return ResponseEntity.ok(theaterRepository.findByCityId(cityId));
        }
        return ResponseEntity.ok(theaterRepository.findAll());
    }
}


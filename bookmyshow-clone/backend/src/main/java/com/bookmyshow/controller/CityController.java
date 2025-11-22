package com.bookmyshow.controller;

import com.bookmyshow.entity.City;
import com.bookmyshow.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "*")
public class CityController {
    
    @Autowired
    private CityRepository cityRepository;
    
    @GetMapping
    public ResponseEntity<List<City>> getAllCities() {
        return ResponseEntity.ok(cityRepository.findAll());
    }
}


package com.bookmyshow.controller;

import com.bookmyshow.dto.response.PaymentIntentResponse;
import com.bookmyshow.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/create-order")
    public ResponseEntity<PaymentIntentResponse> createPaymentOrder(@RequestBody Map<String, Long> request) {
        Long bookingId = request.get("bookingId");
        return ResponseEntity.ok(paymentService.createPaymentIntent(bookingId));
    }
    
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, String>> confirmPayment(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        paymentService.confirmPayment(paymentIntentId);
        return ResponseEntity.ok(Map.of("message", "Payment confirmed successfully"));
    }
}


package com.bookmyshow.service;

import com.bookmyshow.dto.response.PaymentIntentResponse;
import com.bookmyshow.entity.Booking;
import com.bookmyshow.entity.Payment;
import com.bookmyshow.exception.BadRequestException;
import com.bookmyshow.exception.ResourceNotFoundException;
import com.bookmyshow.repository.BookingRepository;
import com.bookmyshow.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    
    @Value("${stripe.publishable.key}")
    private String stripePublishableKey;
    
    @Transactional
    public PaymentIntentResponse createPaymentIntent(Long bookingId) {
        Stripe.apiKey = stripeSecretKey;
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in PENDING status");
        }
        
        // Check if payment already exists
        Payment existingPayment = paymentRepository.findByBookingId(bookingId).orElse(null);
        if (existingPayment != null && existingPayment.getStatus() == Payment.PaymentStatus.SUCCESS) {
            throw new BadRequestException("Payment already completed");
        }
        
        try {
            // Create PaymentIntent in Stripe
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount((long) (booking.getTotalAmount() * 100)) // Convert to cents
                .setCurrency("usd")
                .setMetadata(Map.of("bookingId", bookingId.toString()))
                .build();
            
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            // Create or update payment record
            Payment payment;
            if (existingPayment != null) {
                payment = existingPayment;
            } else {
                payment = new Payment();
                payment.setBooking(booking);
            }
            
            payment.setProvider(Payment.PaymentProvider.STRIPE);
            payment.setProviderOrderId(paymentIntent.getId());
            payment.setAmount(booking.getTotalAmount());
            payment.setStatus(Payment.PaymentStatus.CREATED);
            payment = paymentRepository.save(payment);
            
            return new PaymentIntentResponse(
                paymentIntent.getClientSecret(),
                paymentIntent.getId(),
                bookingId
            );
        } catch (StripeException e) {
            throw new BadRequestException("Failed to create payment intent: " + e.getMessage());
        }
    }
    
    @Transactional
    public void confirmPayment(String paymentIntentId) {
        Stripe.apiKey = stripeSecretKey;
        
        try {
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            if (!"succeeded".equals(paymentIntent.getStatus())) {
                throw new BadRequestException("Payment not succeeded");
            }
            
            Payment payment = paymentRepository.findByProviderOrderId(paymentIntentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
            
            payment.setProviderPaymentId(paymentIntent.getLatestCharge());
            payment.setStatus(Payment.PaymentStatus.SUCCESS);
            paymentRepository.save(payment);
            
            // Confirm booking
            Booking booking = payment.getBooking();
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        } catch (StripeException e) {
            throw new BadRequestException("Failed to confirm payment: " + e.getMessage());
        }
    }
}


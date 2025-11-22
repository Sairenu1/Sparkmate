package com.bookmyshow.dto.response;

import com.bookmyshow.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private String providerOrderId;
    private String providerPaymentId;
    private Double amount;
    private Payment.PaymentProvider provider;
    private Payment.PaymentStatus status;
    private LocalDateTime createdAt;
    
    public static PaymentResponse fromEntity(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getProviderOrderId(),
            payment.getProviderPaymentId(),
            payment.getAmount(),
            payment.getProvider(),
            payment.getStatus(),
            payment.getCreatedAt()
        );
    }
}


package com.bookmyshow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(nullable = false)
    private String rowLabel; // A, B, C, etc.

    @Column(nullable = false)
    private Integer seatNumber; // 1, 2, 3, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatCategory category;

    public enum SeatCategory {
        PLATINUM, GOLD, SILVER
    }

    public String getSeatLabel() {
        return rowLabel + seatNumber;
    }
}


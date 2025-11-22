package com.bookmyshow.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private Integer duration; // in minutes

    @Column(nullable = false)
    private String posterUrl;

    private Double rating;

    private LocalDate releaseDate;

    @Column(nullable = false)
    private String languages; // Comma-separated: "Hindi,English"

    @Column(nullable = false)
    private String genres; // Comma-separated: "Action,Drama"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieStatus status = MovieStatus.COMING_SOON;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Show> shows = new ArrayList<>();

    public enum MovieStatus {
        NOW_SHOWING, COMING_SOON
    }
}


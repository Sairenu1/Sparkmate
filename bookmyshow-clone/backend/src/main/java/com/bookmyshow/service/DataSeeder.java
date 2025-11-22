package com.bookmyshow.service;

import com.bookmyshow.entity.*;
import com.bookmyshow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CityRepository cityRepository;
    
    @Autowired
    private TheaterRepository theaterRepository;
    
    @Autowired
    private ScreenRepository screenRepository;
    
    @Autowired
    private SeatRepository seatRepository;
    
    @Autowired
    private MovieRepository movieRepository;
    
    @Autowired
    private ShowRepository showRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedData();
        }
    }
    
    private void seedData() {
        // Create Admin User
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@bookmyshow.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setPhone("1234567890");
        admin.setRole(User.Role.ADMIN);
        admin = userRepository.save(admin);
        
        // Create Test User
        User user = new User();
        user.setName("Test User");
        user.setEmail("user@test.com");
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setPhone("9876543210");
        user.setRole(User.Role.USER);
        user = userRepository.save(user);
        
        // Create Cities
        City mumbai = new City();
        mumbai.setName("Mumbai");
        mumbai = cityRepository.save(mumbai);
        
        City delhi = new City();
        delhi.setName("Delhi");
        delhi = cityRepository.save(delhi);
        
        City bangalore = new City();
        bangalore.setName("Bangalore");
        bangalore = cityRepository.save(bangalore);
        
        // Create Theaters
        Theater theater1 = new Theater();
        theater1.setName("PVR Cinemas");
        theater1.setCity(mumbai);
        theater1.setAddress("Andheri West, Mumbai");
        theater1.setFacilities("Parking,Food Court,IMAX");
        theater1 = theaterRepository.save(theater1);
        
        Theater theater2 = new Theater();
        theater2.setName("INOX");
        theater2.setCity(mumbai);
        theater2.setAddress("Bandra, Mumbai");
        theater2.setFacilities("Parking,Food Court");
        theater2 = theaterRepository.save(theater2);
        
        // Create Screens
        Screen screen1 = new Screen();
        screen1.setName("Screen 1");
        screen1.setTheater(theater1);
        screen1.setTotalRows(10);
        screen1.setSeatsPerRow(15);
        screen1 = screenRepository.save(screen1);
        
        Screen screen2 = new Screen();
        screen2.setName("Screen 2");
        screen2.setTheater(theater1);
        screen2.setTotalRows(8);
        screen2.setSeatsPerRow(12);
        screen2 = screenRepository.save(screen2);
        
        // Create Seats for Screen 1
        createSeatsForScreen(screen1);
        createSeatsForScreen(screen2);
        
        // Create Movies
        Movie movie1 = new Movie();
        movie1.setTitle("Avengers: Endgame");
        movie1.setDescription("The epic conclusion to the Infinity Saga");
        movie1.setDuration(181);
        movie1.setPosterUrl("https://via.placeholder.com/300x450?text=Avengers");
        movie1.setRating(8.4);
        movie1.setReleaseDate(LocalDate.now().minusDays(30));
        movie1.setLanguages("Hindi,English");
        movie1.setGenres("Action,Adventure,Sci-Fi");
        movie1.setStatus(Movie.MovieStatus.NOW_SHOWING);
        movie1 = movieRepository.save(movie1);
        
        Movie movie2 = new Movie();
        movie2.setTitle("The Dark Knight");
        movie2.setDescription("Batman faces the Joker");
        movie2.setDuration(152);
        movie2.setPosterUrl("https://via.placeholder.com/300x450?text=Dark+Knight");
        movie2.setRating(9.0);
        movie2.setReleaseDate(LocalDate.now().minusDays(10));
        movie2.setLanguages("Hindi,English");
        movie2.setGenres("Action,Crime,Drama");
        movie2.setStatus(Movie.MovieStatus.NOW_SHOWING);
        movie2 = movieRepository.save(movie2);
        
        Movie movie3 = new Movie();
        movie3.setTitle("Upcoming Movie");
        movie3.setDescription("A new exciting movie");
        movie3.setDuration(120);
        movie3.setPosterUrl("https://via.placeholder.com/300x450?text=Coming+Soon");
        movie3.setRating(0.0);
        movie3.setReleaseDate(LocalDate.now().plusDays(30));
        movie3.setLanguages("Hindi");
        movie3.setGenres("Drama");
        movie3.setStatus(Movie.MovieStatus.COMING_SOON);
        movie3 = movieRepository.save(movie3);
        
        // Create Shows
        LocalDate today = LocalDate.now();
        for (int day = 0; day < 7; day++) {
            LocalDate showDate = today.plusDays(day);
            
            // Show 1: 10:00 AM
            Show show1 = new Show();
            show1.setMovie(movie1);
            show1.setScreen(screen1);
            show1.setStartTime(LocalDateTime.of(showDate, LocalTime.of(10, 0)));
            show1.setEndTime(LocalDateTime.of(showDate, LocalTime.of(13, 1)));
            show1.setBasePrice(250.0);
            show1.setLanguage("Hindi");
            show1.setFormat("2D");
            showRepository.save(show1);
            
            // Show 2: 2:00 PM
            Show show2 = new Show();
            show2.setMovie(movie1);
            show2.setScreen(screen1);
            show2.setStartTime(LocalDateTime.of(showDate, LocalTime.of(14, 0)));
            show2.setEndTime(LocalDateTime.of(showDate, LocalTime.of(17, 1)));
            show2.setBasePrice(300.0);
            show2.setLanguage("English");
            show2.setFormat("3D");
            showRepository.save(show2);
            
            // Show 3: 6:00 PM
            Show show3 = new Show();
            show3.setMovie(movie2);
            show3.setScreen(screen2);
            show3.setStartTime(LocalDateTime.of(showDate, LocalTime.of(18, 0)));
            show3.setEndTime(LocalDateTime.of(showDate, LocalTime.of(20, 32)));
            show3.setBasePrice(280.0);
            show3.setLanguage("Hindi");
            show3.setFormat("2D");
            showRepository.save(show3);
        }
    }
    
    private void createSeatsForScreen(Screen screen) {
        List<Seat> seats = new ArrayList<>();
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        
        for (int row = 0; row < screen.getTotalRows(); row++) {
            Seat.SeatCategory category;
            if (row < 2) {
                category = Seat.SeatCategory.PLATINUM;
            } else if (row < 5) {
                category = Seat.SeatCategory.GOLD;
            } else {
                category = Seat.SeatCategory.SILVER;
            }
            
            for (int seatNum = 1; seatNum <= screen.getSeatsPerRow(); seatNum++) {
                Seat seat = new Seat();
                seat.setScreen(screen);
                seat.setRowLabel(rows[row]);
                seat.setSeatNumber(seatNum);
                seat.setCategory(category);
                seats.add(seat);
            }
        }
        
        seatRepository.saveAll(seats);
    }
}


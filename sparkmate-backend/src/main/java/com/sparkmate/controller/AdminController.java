package com.sparkmate.controller;

import com.sparkmate.dto.response.ApiResponse;
import com.sparkmate.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", adminService.getAllUsers()));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        Map<String, Object> user = adminService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", user));
    }

    @PostMapping("/users/{userId}/ban")
    public ResponseEntity<ApiResponse> banUser(@PathVariable Long userId) {
        adminService.banUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User banned successfully"));
    }

    @PostMapping("/users/{userId}/unban")
    public ResponseEntity<ApiResponse> unbanUser(@PathVariable Long userId) {
        adminService.unbanUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User unbanned successfully"));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse> getAllReports() {
        return ResponseEntity.ok(ApiResponse.success("Reports retrieved", adminService.getAllReports()));
    }

    @GetMapping("/reports/pending")
    public ResponseEntity<ApiResponse> getPendingReports() {
        return ResponseEntity.ok(ApiResponse.success("Pending reports retrieved", adminService.getPendingReports()));
    }

    @PostMapping("/reports/{reportId}/resolve")
    public ResponseEntity<ApiResponse> resolveReport(@PathVariable Long reportId) {
        adminService.resolveReport(reportId);
        return ResponseEntity.ok(ApiResponse.success("Report resolved successfully"));
    }

    @PostMapping("/reports/{reportId}/dismiss")
    public ResponseEntity<ApiResponse> dismissReport(@PathVariable Long reportId) {
        adminService.dismissReport(reportId);
        return ResponseEntity.ok(ApiResponse.success("Report dismissed successfully"));
    }
}


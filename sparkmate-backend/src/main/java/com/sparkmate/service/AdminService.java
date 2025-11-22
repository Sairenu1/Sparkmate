package com.sparkmate.service;

import com.sparkmate.model.Report;
import com.sparkmate.model.User;
import com.sparkmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findByIsActiveTrue().size();
        long totalMatches = matchRepository.count();
        long pendingReports = reportRepository.findByStatus(Report.ReportStatus.PENDING).size();
        long totalMessages = messageRepository.count();
        
        // Calculate growth (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long newUsersLastMonth = userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();
        
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("totalMatches", totalMatches);
        stats.put("pendingReports", pendingReports);
        stats.put("totalMessages", totalMessages);
        stats.put("newUsersLastMonth", newUsersLastMonth);
        
        return stats;
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToAdminResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToAdminResponse(user);
    }

    @Transactional
    public void banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    public List<Map<String, Object>> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapReportToAdminResponse)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPendingReports() {
        return reportRepository.findByStatus(Report.ReportStatus.PENDING).stream()
                .map(this::mapReportToAdminResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void resolveReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(Report.ReportStatus.RESOLVED);
        reportRepository.save(report);
    }

    @Transactional
    public void dismissReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setStatus(Report.ReportStatus.DISMISSED);
        reportRepository.save(report);
    }

    private Map<String, Object> mapUserToAdminResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole().name());
        userMap.put("status", user.getIsActive() ? "active" : "banned");
        userMap.put("isActive", user.getIsActive());
        userMap.put("emailVerified", user.getEmailVerified());
        userMap.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        userMap.put("lastActive", user.getLastActive() != null ? user.getLastActive().toString() : null);
        
        // Get match count
        long matchCount = matchRepository.findAll().stream()
                .filter(m -> m.getUser1().getId().equals(user.getId()) || 
                            m.getUser2().getId().equals(user.getId()))
                .count();
        userMap.put("matches", matchCount);
        
        // Get report count
        long reportCount = reportRepository.findByReportedUserId(user.getId()).size();
        userMap.put("reports", reportCount);
        
        return userMap;
    }

    private Map<String, Object> mapReportToAdminResponse(Report report) {
        Map<String, Object> reportMap = new HashMap<>();
        reportMap.put("id", report.getId());
        reportMap.put("reporterId", report.getReporter().getId());
        reportMap.put("reporterName", report.getReporter().getName());
        reportMap.put("reportedUserId", report.getReportedUser().getId());
        reportMap.put("reportedUserName", report.getReportedUser().getName());
        reportMap.put("reason", report.getReason() != null ? report.getReason().name() : null);
        reportMap.put("description", report.getDescription());
        reportMap.put("status", report.getStatus().name().toLowerCase());
        reportMap.put("createdAt", report.getCreatedAt() != null ? report.getCreatedAt().toString() : null);
        return reportMap;
    }
}


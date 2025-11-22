import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Shield, 
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { GradientBackground } from '../Layouts/GradientBackground';
import toast from 'react-hot-toast';
import { adminApi } from '../../services/adminApi';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    pendingReports: 0,
    totalMessages: 0,
    newUsersLastMonth: 0
  });

  // Load dashboard stats
  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Load users when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  // Load reports when reports tab is active
  useEffect(() => {
    if (activeTab === 'reports') {
      loadReports();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await adminApi.getStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminApi.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      setLoading(true);
      const reportsData = await adminApi.getReports();
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      icon: <Users size={24} />, 
      label: 'Total Users', 
      value: dashboardStats.totalUsers.toLocaleString(), 
      change: `+${dashboardStats.newUsersLastMonth}`, 
      color: '#3a86ff' 
    },
    { 
      icon: <Heart size={24} />, 
      label: 'Total Matches', 
      value: dashboardStats.totalMatches.toLocaleString(), 
      change: '+8%', 
      color: '#ff006e' 
    },
    { 
      icon: <MessageSquare size={24} />, 
      label: 'Messages Sent', 
      value: dashboardStats.totalMessages.toLocaleString(), 
      change: '+15%', 
      color: '#8338ec' 
    },
    { 
      icon: <AlertTriangle size={24} />, 
      label: 'Pending Reports', 
      value: dashboardStats.pendingReports.toString(), 
      change: '-5%', 
      color: '#ff6b35' 
    },
  ];

  const handleUserAction = async (userId, action) => {
    try {
      setLoading(true);
      if (action === 'ban') {
        await adminApi.banUser(userId);
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'banned', isActive: false } : u));
        toast.success('User banned successfully');
      } else if (action === 'unban') {
        await adminApi.unbanUser(userId);
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'active', isActive: true } : u));
        toast.success('User unbanned successfully');
      } else if (action === 'view') {
        const userData = await adminApi.getUserById(userId);
        toast.success(`Viewing profile: ${userData.name}`);
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      toast.error(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      setLoading(true);
      if (action === 'resolve') {
        await adminApi.resolveReport(reportId);
        setReports(reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
        toast.success('Report resolved');
        // Reload stats to update pending reports count
        loadDashboardStats();
      } else if (action === 'dismiss') {
        await adminApi.dismissReport(reportId);
        setReports(reports.map(r => r.id === reportId ? { ...r, status: 'dismissed' } : r));
        toast.success('Report dismissed');
        // Reload stats to update pending reports count
        loadDashboardStats();
      }
    } catch (error) {
      console.error('Error performing report action:', error);
      toast.error(`Failed to ${action} report`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && users.length === 0 && reports.length === 0 && dashboardStats.totalUsers === 0) {
    return (
      <div className="admin-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <GradientBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ color: '#ff006e', fontSize: '48px' }}
        >
          ⚙️
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <GradientBackground />
      
      <div className="admin-container">
        {/* Header */}
        <motion.div 
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage your dating platform</p>
          </div>
          <div className="admin-header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button
              className="admin-icon-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="admin-stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="stat-icon-wrapper" style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
                <span className="stat-change" style={{ color: stat.change.startsWith('+') ? '#4ade80' : '#ff6b35' }}>
                  {stat.change} from last month
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
            { id: 'users', label: 'Users', icon: <Users size={18} /> },
            { id: 'reports', label: 'Reports', icon: <AlertTriangle size={18} /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overview-content"
            >
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    {[
                      { action: 'New user registered', time: '2 minutes ago', type: 'user' },
                      { action: 'Match created', time: '15 minutes ago', type: 'match' },
                      { action: 'Report submitted', time: '1 hour ago', type: 'report' },
                      { action: 'User banned', time: '2 hours ago', type: 'ban' },
                    ].map((activity, idx) => (
                      <div key={idx} className="activity-item">
                        <Activity size={16} />
                        <div>
                          <p>{activity.action}</p>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions">
                    {[
                      { icon: <Users />, label: 'View All Users', action: () => setActiveTab('users') },
                      { icon: <AlertTriangle />, label: 'Review Reports', action: () => setActiveTab('reports') },
                      { icon: <BarChart3 />, label: 'View Analytics', action: () => setActiveTab('analytics') },
                      { icon: <Shield />, label: 'Security Settings', action: () => toast('Security settings coming soon') },
                    ].map((action, idx) => (
                      <motion.button
                        key={idx}
                        className="quick-action-btn"
                        onClick={action.action}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action.icon}
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="users-content"
            >
              <div className="table-header">
                <h3>User Management</h3>
                <div className="table-actions">
                  <motion.button
                    className="admin-btn secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Filter size={16} />
                    Filter
                  </motion.button>
                  <motion.button
                    className="admin-btn primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Export
                  </motion.button>
                </div>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Matches</th>
                      <th>Reports</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ background: 'rgba(255, 0, 110, 0.05)' }}
                      >
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'banned'}`}>
                            {user.isActive ? 'active' : 'banned'}
                          </span>
                        </td>
                        <td>{user.matches}</td>
                        <td>{user.reports}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <motion.button
                              className="action-btn view"
                              onClick={() => handleUserAction(user.id, 'view')}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye size={16} />
                            </motion.button>
                            {user.isActive ? (
                              <motion.button
                                className="action-btn ban"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Ban size={16} />
                              </motion.button>
                            ) : (
                              <motion.button
                                className="action-btn unban"
                                onClick={() => handleUserAction(user.id, 'unban')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <CheckCircle size={16} />
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="reports-content"
            >
              <div className="table-header">
                <h3>Reports & Moderation</h3>
              </div>

              <div className="reports-list">
                {reports.map((report) => (
                  <motion.div
                    key={report.id}
                    className="report-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="report-header">
                      <div>
                        <h4>Report #{report.id}</h4>
                        <p className="report-meta">
                          {report.reporterName} reported {report.reportedUserName}
                        </p>
                      </div>
                      <span className={`report-status ${report.status}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="report-body">
                      <p><strong>Reason:</strong> {report.reason || report.description || 'N/A'}</p>
                      {report.description && (
                        <p><strong>Description:</strong> {report.description}</p>
                      )}
                      <p className="report-date">
                        <Calendar size={14} />
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    {report.status === 'pending' && (
                      <div className="report-actions">
                        <motion.button
                          className="admin-btn success"
                          onClick={() => handleReportAction(report.id, 'resolve')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={16} />
                          Resolve
                        </motion.button>
                        <motion.button
                          className="admin-btn danger"
                          onClick={() => handleReportAction(report.id, 'dismiss')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <XCircle size={16} />
                          Dismiss
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="analytics-content"
            >
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>User Growth</h3>
                  <div className="chart-placeholder">
                    <BarChart3 size={48} />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Match Rate</h3>
                  <div className="chart-placeholder">
                    <TrendingUp size={48} />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Engagement Metrics</h3>
                  <div className="metrics-list">
                    {[
                      { label: 'Daily Active Users', value: '3,456', change: '+12%' },
                      { label: 'Messages per Day', value: '12,345', change: '+8%' },
                      { label: 'Match Success Rate', value: '68%', change: '+5%' },
                      { label: 'Average Session', value: '24 min', change: '+3%' },
                    ].map((metric, idx) => (
                      <div key={idx} className="metric-item">
                        <span>{metric.label}</span>
                        <div>
                          <strong>{metric.value}</strong>
                          <span className="metric-change">{metric.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


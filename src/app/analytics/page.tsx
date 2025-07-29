'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BarChart3, TrendingUp, Users, FileText, Clock, Download, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { useUser } from '@/contexts/UserContext'
import styles from './analytics.module.css'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const { user } = useUser()

  // Mock analytics data
  const analyticsData = {
    totalContracts: 247,
    contractsThisMonth: 34,
    avgProcessingTime: '2.3 min',
    riskIssuesFound: 89,
    teamMembers: 12,
    activeUsers: 8
  }

  const contractsByMonth = [
    { month: 'Jan', contracts: 18, risks: 12 },
    { month: 'Feb', contracts: 22, risks: 8 },
    { month: 'Mar', contracts: 31, risks: 15 },
    { month: 'Apr', contracts: 28, risks: 11 },
    { month: 'May', contracts: 35, risks: 18 },
    { month: 'Jun', contracts: 42, risks: 22 }
  ]

  const topRiskCategories = [
    { category: 'Liability Clauses', count: 23, percentage: 26 },
    { category: 'Payment Terms', count: 19, percentage: 21 },
    { category: 'Termination Rights', count: 16, percentage: 18 },
    { category: 'Intellectual Property', count: 14, percentage: 16 },
    { category: 'Confidentiality', count: 12, percentage: 13 },
    { category: 'Other', count: 5, percentage: 6 }
  ]

  const recentActivity = [
    { action: 'Contract analyzed', user: 'Sarah Johnson', time: '2 hours ago', contract: 'Vendor Agreement #247' },
    { action: 'Risk flagged', user: 'Mike Chen', time: '4 hours ago', contract: 'Service Contract #246' },
    { action: 'Report generated', user: 'Emily Davis', time: '6 hours ago', contract: 'Partnership Agreement #245' },
    { action: 'Contract uploaded', user: 'John Smith', time: '1 day ago', contract: 'Employment Contract #244' }
  ]

  return (
    <div className={styles.container}>
      <Navigation />

      {/* Back Button */}
      <Link href="/profiles" className={styles.backButton}>
        <ArrowLeft size={20} />
        Back to Profiles
      </Link>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Usage Analytics</h1>
            <p className={styles.subtitle}>View detailed analytics and usage reports for all profiles</p>
          </div>
          <div className={styles.headerActions}>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className={styles.timeRangeSelect}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className={styles.exportButton}>
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <FileText size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>{analyticsData.totalContracts}</h3>
              <p>Total Contracts</p>
              <span className={styles.metricChange}>+{analyticsData.contractsThisMonth} this month</span>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Clock size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>{analyticsData.avgProcessingTime}</h3>
              <p>Avg Processing Time</p>
              <span className={styles.metricChange}>-15% from last month</span>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>{analyticsData.riskIssuesFound}</h3>
              <p>Risk Issues Found</p>
              <span className={styles.metricChange}>+12% from last month</span>
            </div>
          </div>
          
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <Users size={24} />
            </div>
            <div className={styles.metricContent}>
              <h3>{analyticsData.activeUsers}/{analyticsData.teamMembers}</h3>
              <p>Active Team Members</p>
              <span className={styles.metricChange}>67% engagement rate</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsSection}>
          <div className={styles.chartCard}>
            <h3>Contract Analysis Trends</h3>
            <div className={styles.chart}>
              <div className={styles.chartBars}>
                {contractsByMonth.map((data, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div 
                      className={styles.contractBar}
                      style={{ height: `${(data.contracts / 50) * 100}%` }}
                    ></div>
                    <div 
                      className={styles.riskBar}
                      style={{ height: `${(data.risks / 50) * 100}%` }}
                    ></div>
                    <span className={styles.chartLabel}>{data.month}</span>
                  </div>
                ))}
              </div>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#3b82f6' }}></div>
                  <span>Contracts Analyzed</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Risk Issues</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3>Top Risk Categories</h3>
            <div className={styles.riskCategories}>
              {topRiskCategories.map((risk, index) => (
                <div key={index} className={styles.riskCategory}>
                  <div className={styles.riskInfo}>
                    <span className={styles.riskName}>{risk.category}</span>
                    <span className={styles.riskCount}>{risk.count} issues</span>
                  </div>
                  <div className={styles.riskBar}>
                    <div 
                      className={styles.riskProgress}
                      style={{ width: `${risk.percentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.riskPercentage}>{risk.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <h3>Recent Activity</h3>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <FileText size={16} />
                </div>
                <div className={styles.activityContent}>
                  <div className={styles.activityAction}>
                    <strong>{activity.action}</strong> by {activity.user}
                  </div>
                  <div className={styles.activityDetails}>
                    {activity.contract} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div className={styles.exportSection}>
          <h3>Export Options</h3>
          <div className={styles.exportOptions}>
            <button className={styles.exportOption}>
              <Calendar size={20} />
              <div>
                <h4>Monthly Report</h4>
                <p>Comprehensive monthly analytics report</p>
              </div>
            </button>
            <button className={styles.exportOption}>
              <BarChart3 size={20} />
              <div>
                <h4>Risk Analysis Report</h4>
                <p>Detailed breakdown of risk categories and trends</p>
              </div>
            </button>
            <button className={styles.exportOption}>
              <Users size={20} />
              <div>
                <h4>Team Usage Report</h4>
                <p>Individual team member activity and performance</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

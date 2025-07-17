import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import * as echarts from 'echarts';
import axios from 'axios';

const Analytics = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [dealsByStage, setDealsByStage] = useState([]);
  const [leadsByStatus, setLeadsByStatus] = useState([]);
  const { user } = useContext(AuthContext);

  // Fetch analytics data
  useEffect(() => {
    setLoading(true);
    const token = user?.token || localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get('/api/reports/revenue-by-month', config),
      axios.get('/api/reports/deals-by-stage', config),
      axios.get('/api/reports/leads-by-status', config)
    ]).then(([revenueRes, dealsRes, leadsRes]) => {
      console.log('Revenue:', revenueRes.data);
      console.log('Deals:', dealsRes.data);
      console.log('Leads:', leadsRes.data);
      setRevenueByMonth(revenueRes.data || []);
      setDealsByStage(dealsRes.data || []);
      setLeadsByStatus(leadsRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user?.token]);

  // Revenue Overview calculations
  const totalRevenue = Array.isArray(revenueByMonth)
    ? revenueByMonth.reduce((sum, r) => sum + Number(r.revenue || 0), 0)
    : 0;
  // Remove bestMonth calculation, use highestDeal instead

  // Render charts using echarts from npm
  useEffect(() => {
    if (loading) return;
    const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--phoenix-card-bg').trim();
    const cardColor = getComputedStyle(document.documentElement).getPropertyValue('--phoenix-card-color').trim();
    // Line Chart (Revenue Trend)
    if (lineChartRef.current) {
      const chart = echarts.init(lineChartRef.current);
      const months = Array.isArray(revenueByMonth) ? revenueByMonth.map(r => r.month) : [];
      const revenueData = Array.isArray(revenueByMonth) ? revenueByMonth.map(r => r.revenue) : [];
      chart.setOption({
        backgroundColor: cardBg,
        tooltip: { trigger: 'axis', textStyle: { color: cardColor } },
        legend: { textStyle: { color: cardColor }, top: 56, left: 'center', itemWidth: 18, itemHeight: 12 },
        grid: { left: 70, right: 40, top: 90, bottom: 60 },
        xAxis: {
          type: 'category',
          data: months,
          axisLabel: { color: cardColor, fontSize: 13, margin: 12 },
          axisLine: { lineStyle: { color: cardColor } },
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: cardColor, fontSize: 13, margin: 12 },
          axisLine: { lineStyle: { color: cardColor } },
          splitLine: { lineStyle: { color: cardColor, opacity: 0.15 } },
        },
        series: [{
          data: revenueData,
          type: 'line',
          smooth: true,
          areaStyle: { color: 'rgba(79,140,255,0.08)' },
          lineStyle: { color: '#3874ff', width: 3 },
          itemStyle: { color: '#3874ff' },
          label: { show: false }
        }]
      });
    }
    // Bar Chart (Deals Closed)
    if (barChartRef.current) {
      const chart = echarts.init(barChartRef.current);
      const stages = Array.isArray(dealsByStage) ? dealsByStage.map(d => d.stage) : [];
      const counts = Array.isArray(dealsByStage) ? dealsByStage.map(d => d.deal_count) : [];
      chart.setOption({
        backgroundColor: cardBg,
        tooltip: { trigger: 'axis', textStyle: { color: cardColor } },
        legend: { textStyle: { color: cardColor }, top: 56, left: 'center', itemWidth: 18, itemHeight: 12 },
        grid: { left: 70, right: 40, top: 90, bottom: 60 },
        xAxis: {
          type: 'category',
          data: stages,
          axisLabel: { color: cardColor, fontSize: 13, margin: 12, rotate: 20 },
          axisLine: { lineStyle: { color: cardColor } },
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: cardColor, fontSize: 13, margin: 12 },
          axisLine: { lineStyle: { color: cardColor } },
          splitLine: { lineStyle: { color: cardColor, opacity: 0.15 } },
        },
        series: [{
          data: counts,
          type: 'bar',
          itemStyle: { color: '#3874ff' },
          label: { show: false }
        }]
      });
    }
    // Pie Chart (Leads by Status)
    if (pieChartRef.current) {
      // Dispose previous instance to avoid duplicate rendering
      if (pieChartRef.current._echarts_instance_) {
        echarts.dispose(pieChartRef.current);
      }
      const chart = echarts.init(pieChartRef.current);
      // Use hardcoded test data for debugging
      const pieData = [
        { value: 10, name: 'contacted' },
        { value: 5, name: 'qualified' },
        { value: 8, name: 'New Lead' },
        { value: 3, name: 'New' }
      ];
      console.log('Pie Data (HARDCODED):', pieData); // Debug line

      chart.setOption({
        backgroundColor: cardBg,
        tooltip: { trigger: 'item', textStyle: { color: cardColor } },
        legend: {
          orient: 'vertical',
          right: 24, // Reverted to original value
          top: 56,
          textStyle: { color: cardColor, fontSize: 14 },
          itemWidth: 18,
          itemHeight: 12
        },
        color: ['#3874ff', '#6fcf97', '#f2c94c', '#eb5757', '#9b51e0', '#56ccf2'], // Force visible colors
        series: [{
          name: 'Leads',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: cardBg,
            borderWidth: 2
          },
          label: {
            show: false // Hide all labels on the pie chart
          },
          labelLine: {
            show: false // Hide all label lines
          },
          data: pieData.length > 0 ? pieData : [{ value: 1, name: 'No Data' }]
        }]
      });
      // Force ECharts to resize after render
      setTimeout(() => {
        chart.resize();
      }, 100);
    }
  }, [loading, dealsByStage, leadsByStatus, revenueByMonth]);

  return (
    <>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!">Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#!">Analytics</a></li>
          <li className="breadcrumb-item active">Overview</li>
        </ol>
      </nav>
      <div className="pb-6">
        <h2 className="mb-4">Analytics Dashboard</h2>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{height: 320}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
        <>
        {/* Charts Row */}
        <div className="row g-3 mb-6">
          <div className="col-lg-4">
            <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}><h5 className="mb-0">Revenue Trend</h5></div>
              <div className="card-body"><div ref={lineChartRef} style={{height: 300, width: '100%'}}></div></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}><h5 className="mb-0">Deals Closed</h5></div>
              <div className="card-body"><div ref={barChartRef} style={{height: 300, width: '100%'}}></div></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}><h5 className="mb-0">Leads by Status</h5></div>
              <div className="card-body"><div ref={pieChartRef} style={{
                height: 300,
                width: '100%',
                minHeight: 300,
                minWidth: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}></div></div>
            </div>
          </div>
        </div>
        {/* Summary Row */}
        <div className="row g-3 mb-6">
          <div className="col-lg-8">
            <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}><h5 className="mb-0">Revenue Overview</h5></div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-4">
                  <div>
                    <div className="fw-bold text-body-emphasis">Total Revenue</div>
                    <div className="fs-4 text-info">${Number(totalRevenue).toLocaleString()}</div>
                  </div>
                  {/* Removed highestDeal display */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card" style={{ backgroundColor: 'var(--phoenix-card-bg) !important', color: 'var(--phoenix-card-color) !important', borderColor: 'var(--phoenix-card-border-color) !important' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--phoenix-card-header-bg) !important', color: 'var(--phoenix-card-header-color) !important', borderBottom: '1px solid var(--phoenix-card-border-color) !important' }}><h5 className="mb-0">Top Performers</h5></div>
              <div className="card-body">
                {/* Removed topPerformers display */}
              </div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </>
  );
};

export default Analytics; 
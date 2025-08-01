import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import * as echarts from 'echarts';
import axios from 'axios';
import { ThemeContext } from "../ThemeContext";
import ErrorMessage from "./ErrorMessage";

const Analytics = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [dealsByStage, setDealsByStage] = useState([]);
  const [leadsByStatus, setLeadsByStatus] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Fetch analytics data
  useEffect(() => {
    setLoading(true);
    setError(null);
    const token = user?.token || localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get('/api/reports/revenue-by-month', config),
      axios.get('/api/reports/deals-by-stage', config),
      axios.get('/api/reports/leads-by-status', config),
      axios.get('/api/reports/top-performers', config)
    ]).then(([revenueRes, dealsRes, leadsRes, performersRes]) => {
      console.log('Revenue:', revenueRes.data);
      console.log('Deals:', dealsRes.data);
      console.log('Leads:', leadsRes.data);
      console.log('Top Performers:', performersRes.data);
      setRevenueByMonth(revenueRes.data || []);
      setDealsByStage(dealsRes.data || []);
      setLeadsByStatus(leadsRes.data || []);
      setTopPerformers(performersRes.data || []);
      setLoading(false);
    }).catch(() => {
      setError("Failed to fetch analytics data");
      setLoading(false);
    });
  }, [user?.token]);

  // Revenue Overview calculations
  const totalRevenue = Array.isArray(revenueByMonth)
    ? revenueByMonth.reduce((sum, r) => sum + Number(r.revenue || 0), 0)
    : 0;
  // Remove bestMonth calculation, use highestDeal instead

  // Render charts using echarts from npm
  useEffect(() => {
    if (loading) return;
    // Use setTimeout to ensure CSS variables are updated before reading them
    const timeout = setTimeout(() => {
      const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--phoenix-card-bg').trim();
      const cardColor = getComputedStyle(document.documentElement).getPropertyValue('--phoenix-card-color').trim();
  
      // Line Chart (Revenue Trend)
      if (lineChartRef.current) {
        const chart = echarts.getInstanceByDom(lineChartRef.current) || echarts.init(lineChartRef.current);
        const months = Array.isArray(revenueByMonth) ? revenueByMonth.map(r => r.month) : [];
        const revenueData = Array.isArray(revenueByMonth) ? revenueByMonth.map(r => r.revenue) : [];
        chart.setOption({
          backgroundColor: cardBg,
          tooltip: {
            trigger: 'axis',
            padding: [7, 10],
            backgroundColor: cardBg,
            borderColor: cardColor,
            textStyle: { color: cardColor },
            borderWidth: 1,
            transitionDuration: 0,
            axisPointer: { type: 'none' }
          },
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
        chart.resize();
      }
  
      // Bar Chart (Deals Closed)
      if (barChartRef.current) {
        const chart = echarts.getInstanceByDom(barChartRef.current) || echarts.init(barChartRef.current);
        // Map backend data to bar chart format and assign colors
        const stageColorMap = {
          'Prospecting': '#3874ff',
          'Qualified': '#6fcf97',
          'Proposal': '#f2c94c',
          'Negotiation': '#eb5757',
          'Closed Won': '#9b51e0',
          'Closed Lost': '#56ccf2',
        };
        const defaultColors = ['#3874ff', '#6fcf97', '#f2c94c', '#eb5757', '#9b51e0', '#56ccf2', '#f2994a'];
        const stages = Array.isArray(dealsByStage) ? dealsByStage.map((d, idx) => d.stage || d.name || `Stage ${idx+1}`) : [];
        const counts = Array.isArray(dealsByStage) ? dealsByStage.map(d => d.deal_count || d.value || d.count || 0) : [];
        const barColors = Array.isArray(dealsByStage) && dealsByStage.length > 0
          ? dealsByStage.map((d, idx) => stageColorMap[d.stage || d.name] || defaultColors[idx % defaultColors.length])
          : [defaultColors[0]];
        chart.setOption({
          backgroundColor: cardBg,
          tooltip: {
            trigger: 'axis',
            padding: [7, 10],
            backgroundColor: cardBg,
            borderColor: cardColor,
            textStyle: { color: cardColor },
            borderWidth: 1,
            transitionDuration: 0,
            axisPointer: { type: 'none' }
          },
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
            data: counts.map((value, idx) => ({ value, itemStyle: { color: barColors[idx], borderRadius: [3, 3, 0, 0] } })),
            type: 'bar',
            label: { show: false }
          }]
        });
        chart.resize();
      }
  
      // Pie Chart (Leads by Status)
      if (pieChartRef.current) {
        if (pieChartRef.current._echarts_instance_) {
          echarts.dispose(pieChartRef.current);
        }
        const chart = echarts.init(pieChartRef.current);
        // Map backend data to pie chart format and assign colors
        const statusColorMap = {
          Facebook: '#3874ff',
          Youtube: '#eb5757',
          Twitter: '#56ccf2',
          Linkedin: '#6fcf97',
          Github: '#f2c94c',
        };
        const defaultColors = ['#3874ff', '#eb5757', '#56ccf2', '#6fcf97', '#f2c94c', '#9b51e0', '#f2994a'];
        const pieData = Array.isArray(leadsByStatus) && leadsByStatus.length > 0
          ? leadsByStatus.map((item, idx) => ({
              value: item.lead_count || item.value || item.count || 0,
              name: item.status || item.name || `Status ${idx+1}`,
              itemStyle: { color: statusColorMap[item.status || item.name] || defaultColors[idx % defaultColors.length] }
            }))
          : [
              { value: 1, name: 'No Data', itemStyle: { color: '#ccc' } }
            ];
        chart.setOption({
          legend: {
            left: 'left',
            textStyle: { color: cardColor }
          },
          series: [
            {
              type: 'pie',
              radius: window.innerWidth < 530 ? '45%' : '60%',
              label: { color: cardColor },
              center: ['50%', '55%'],
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0,0,0,0.2)'
                }
              }
            }
          ],
          tooltip: {
            trigger: 'item',
            padding: [7, 10],
            backgroundColor: cardBg,
            borderColor: cardColor,
            textStyle: { color: cardColor },
            borderWidth: 1,
            transitionDuration: 0,
            axisPointer: { type: 'none' }
          }
        });
        setTimeout(() => {
          chart.resize();
        }, 100);
      }
    }, 0);
    return () => clearTimeout(timeout);
  }, [loading, dealsByStage, leadsByStatus, revenueByMonth, theme]);

  return (
    <>
      <style>{`
        .analytics-section-title {
          color: var(--phoenix-emphasis-color);
          font-weight: 800;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        .analytics-legend {
          color: var(--phoenix-tertiary-color);
          font-size: 1rem;
          font-weight: 600;
        }
        .analytics-legend .legend-item {
          display: inline-flex;
          align-items: center;
          margin-right: 1.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .analytics-legend .legend-item:hover,
        .analytics-legend .legend-item.active {
          color: var(--phoenix-link-hover-color);
          text-decoration: underline;
        }
        .analytics-card {
          background: var(--phoenix-card-bg);
          color: var(--phoenix-card-color);
          border: 1px solid var(--phoenix-card-border-color);
          box-shadow: var(--phoenix-shadow-light);
        }
        .analytics-card .card-body {
          background: transparent;
        }
      `}</style>
      <nav className="mb-3" aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><a href="#!" style={{ color: 'var(--phoenix-link-color)' }}>Dashboard</a></li>
          <li className="breadcrumb-item"><a href="#!" style={{ color: 'var(--phoenix-link-color)' }}>Analytics</a></li>
          <li className="breadcrumb-item active" style={{ color: 'var(--phoenix-emphasis-color)' }}>Overview</li>
        </ol>
      </nav>
      <div className="pb-6">
        <div className="analytics-section-title">Analytics Dashboard</div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{height: 320}}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
        <>
        {error && <ErrorMessage message={error} />}
        {/* Charts Row */}
        <div className="row g-3 mb-6">
          <div className="col-lg-4">
            <div className="card analytics-card">
              <div className="card-header bg-card-header border-bottom border-card-border"><h5 className="mb-0">Revenue Trend</h5></div>
              <div className="card-body"><div ref={lineChartRef} style={{height: 300, width: '100%'}}></div></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card analytics-card">
              <div className="card-header bg-card-header border-bottom border-card-border"><h5 className="mb-0">Deals Closed by Stage</h5></div>
              <div className="card-body"><div ref={barChartRef} style={{height: 300, width: '100%'}}></div></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card analytics-card">
              <div className="card-header bg-card-header border-bottom border-card-border"><h5 className="mb-0">Leads by Status</h5></div>
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
            <div className="card analytics-card">
              <div className="card-header bg-card-header border-bottom border-card-border"><h5 className="mb-0">Revenue Overview</h5></div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-4">
                  <div>
                    <div className="fw-bold" style={{ color: 'var(--phoenix-emphasis-color)' }}>Total Revenue</div>
                    <div className="fs-4" style={{ color: 'var(--phoenix-link-color)' }}>${Number(totalRevenue).toLocaleString()}</div>
                  </div>
                  {/* Removed highestDeal display */}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card analytics-card">
              <div className="card-header bg-card-header border-bottom border-card-border"><h5 className="mb-0">Top Performers</h5></div>
                             <div className="card-body p-0">
                 {topPerformers.length > 0 ? (
                   <div className="list-group list-group-flush">
                     {topPerformers.map((performer, index) => (
                       <div key={performer.name} className="list-group-item border-0 px-3 py-3">
                         <div className="d-flex align-items-center">
                           {/* Rank Badge */}
                           <div className="me-3">
                             <div 
                               className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                               style={{
                                 width: '28px',
                                 height: '28px',
                                 fontSize: '12px',
                                 backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#6c757d',
                                 color: 'white'
                               }}
                             >
                               {index + 1}
                             </div>
                           </div>
                           
                           
                           
                           {/* User Info */}
                           <div className="flex-grow-1">
                             <div className="fw-bold mb-1" style={{ color: 'var(--phoenix-emphasis-color)', fontSize: '14px' }}>
                               {performer.name}
                             </div>
                             <div className="text-muted" style={{ fontSize: '12px' }}>
                               {index === 0 ? '🥇 Gold' : index === 1 ? '🥈 Silver' : index === 2 ? '🥉 Bronze' : 'Performer'}
                             </div>
                           </div>
                           
                           {/* Revenue */}
                           <div className="text-end">
                             <div className="fw-bold mb-1" style={{ color: 'var(--phoenix-link-color)', fontSize: '14px' }}>
                               ${Number(performer.total_revenue).toLocaleString()}
                             </div>
                             <div className="text-muted" style={{ fontSize: '11px' }}>
                               Revenue
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-4">
                     <div className="mb-3">
                       <i className="fas fa-trophy" style={{ fontSize: '2rem', color: 'var(--phoenix-tertiary-color)' }}></i>
                     </div>
                     <div className="text-muted" style={{ fontSize: '14px' }}>
                       No performance data available
                     </div>
                   </div>
                 )}
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
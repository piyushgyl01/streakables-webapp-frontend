import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Code, Layout, User } from 'lucide-react';
import useFetch from '../useFetch.jsx';

const MonthlyStats = () => {
  const { data, loading, error } = useFetch("http://localhost:3000/api/wakatime-stats/monthly");

  if (loading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="spinner-grow text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4">Error: {error}</div>
    );
  }

  const stats = data?.data;
  const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4'];

  const projectData = stats?.projects?.slice(0, 8).map(project => ({
    name: project.name.split('/').pop(),
    value: project.percent
  })) || [];

  const editorData = stats?.editors?.map(editor => ({
    name: editor.name,
    value: editor.percent
  })) || [];

  return (
    <>
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-0">Monthly Overview</h4>
            <small className="text-muted">{stats?.human_readable_range}</small>
          </div>
          <div className="badge bg-success">Best Day: {stats?.best_day?.text}</div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Total Time</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.human_readable_total_including_other_language}</h3>
                <small className="text-muted">Daily Avg: {stats?.human_readable_daily_average_including_other_language}</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                    <Code className="text-success" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Coding Time</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.categories?.find(c => c.name === "Coding")?.text}</h3>
                <small className="text-muted">{stats?.categories?.find(c => c.name === "Coding")?.percent.toFixed(1)}% of total</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
                    <Layout className="text-warning" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Projects</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.projects?.length}</h3>
                <small className="text-muted">Most Active: {stats?.projects?.[0]?.name.split('/').pop()}</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-2 rounded-3 me-3">
                    <User className="text-info" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Active Days</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.days_including_holidays} days</h3>
                <small className="text-muted">Total coding sessions</small>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-4">
          {/* Project Chart */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Top Projects</h5>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {projectData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4" style={{maxHeight: '200px', overflowY: 'auto'}}>
                  {projectData.map((project, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center p-2 mb-2 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <div className="rounded me-2" style={{width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length]}}></div>
                        <span className="text-truncate" style={{maxWidth: '200px'}}>{project.name}</span>
                      </div>
                      <span className="badge bg-dark">{project.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor Usage */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Editor Usage</h5>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={editorData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  {stats?.languages?.slice(0, 5).map((lang, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">{lang.name}</span>
                        <span className="badge bg-primary-subtle text-primary">{lang.text}</span>
                      </div>
                      <div className="progress" style={{height: '6px'}}>
                        <div 
                          className="progress-bar" 
                          style={{
                            width: `${lang.percent}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default MonthlyStats;
import React from 'react';
import useFetch from '../useFetch.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Clock, Code, Globe, Laptop } from 'lucide-react';

const DailySummary = () => {
  const { data, loading, error } = useFetch("http://localhost:3000/api/wakatime-stats");

  if (loading) {
    return (
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm m-4" role="alert">
        <i className="bi bi-exclamation-circle me-2"></i>
        Error: {error}
      </div>
    );
  }

  const stats = data?.data[0];
  const COLORS = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4', '#14b8a6'];

  const projectData = stats?.projects.map(project => ({
    name: project.name.split('/').pop(),
    value: project.percent
  })) || [];

  const languageData = stats?.languages.map(lang => ({
    name: lang.name,
    value: lang.percent
  })) || [];

  const activityData = [
    { name: 'Coding', value: stats?.categories.find(c => c.name === "Coding")?.percent || 0 },
    { name: 'Browsing', value: stats?.categories.find(c => c.name === "Browsing")?.percent || 0 }
  ];

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center">
              <h4 className="mb-0 text-primary fw-bold">Daily Summary</h4>
              <span className="ms-3 badge bg-primary-subtle text-primary">{stats?.range.text}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Total Time</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.grand_total.text}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                    <Code className="text-success" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Coding Time</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.categories.find(c => c.name === "Coding")?.text}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
                    <Globe className="text-warning" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Top Language</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.languages[0]?.name}</h3>
                <small className="text-muted">{stats?.languages[0]?.percent.toFixed(1)}% usage</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100 hover-shadow">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info bg-opacity-10 p-2 rounded-3 me-3">
                    <Laptop className="text-info" size={24} />
                  </div>
                  <h6 className="text-muted mb-0">Primary Editor</h6>
                </div>
                <h3 className="fw-bold mb-0">{stats?.editors[0]?.name}</h3>
                <small className="text-muted">{stats?.editors[0]?.percent.toFixed(1)}% usage</small>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4 fw-bold">Projects Breakdown</h5>
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
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: COLORS[index % COLORS.length],
                            marginRight: '12px'
                          }}
                        ></div>
                        <span className="text-truncate" style={{maxWidth: '200px'}}>{project.name}</span>
                      </div>
                      <span className="badge bg-dark">{project.value.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title mb-4 fw-bold">Languages & Activity</h5>
                <div style={{ height: '200px' }} className="mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Languages Distribution</h6>
                    {languageData.map((lang, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-muted">{lang.name}</span>
                          <span className="badge bg-primary-subtle text-primary">{lang.value.toFixed(1)}%</span>
                        </div>
                        <div className="progress" style={{height: '8px'}}>
                          <div 
                            className="progress-bar" 
                            style={{
                              width: `${lang.value}%`,
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
      </div>
    </div>
  );
};

export default DailySummary;
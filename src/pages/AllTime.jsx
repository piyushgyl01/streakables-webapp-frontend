import React, { useState, useEffect } from 'react';
import { Clock, Calendar, TrendingUp, Timer } from 'lucide-react';

const AllTime = () => {
  const [allTime, setAllTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllTimeStats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/wakatime-stats/all_time');
        const result = await response.json();
        setAllTime(result.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchAllTimeStats();
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateDaysActive = (startDate) => {
    const start = new Date(startDate);
    const end = new Date();
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  if (!allTime) return null;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container-fluid px-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h4 className="mb-0 text-primary fw-bold">Career Statistics</h4>
                <small className="text-muted">
                  Since {allTime.range.start_text}
                </small>
              </div>
              <div className="badge bg-primary-subtle text-primary">
                {calculateDaysActive(allTime.range.start)} Days Active
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="text-muted mb-0">Total Coding Time</h6>
                    <h3 className="fw-bold mb-0">{allTime.text}</h3>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-success">
                    Daily Average: {formatTime(allTime.daily_average)}
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

export default AllTime;
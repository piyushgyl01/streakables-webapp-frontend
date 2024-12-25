import React, { useState } from "react";
import useFetch from "../useFetch";
import StreakManager from "./StreakManager";

export default function StreakablesApp() {
  const [selectedApp, setSelectedApp] = useState("");
  const [selectedAppId, setSelectedAppId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  const {
    data: monthlyData,
    loading: monthlyLoading,
    error: monthlyError,
  } = useFetch("http://localhost:3000/api/wakatime-stats");

  const {
    data: streakData,
    loading: streakLoading,
    error: streakError,
  } = useFetch("http://localhost:3000/api/streaks");

  const handleSelectChange = (e) => {
    const appName = e.target.value;
    setSelectedApp(appName);
    const selectedCategoryId = streakData?.find(
      (data) => data?.targetName === appName
    );
    setSelectedAppId(selectedCategoryId?._id);
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    const goalValue = document.getElementById("goalInp").value;

    try {
      const response = await fetch(
        `http://localhost:3000/api/streaks/${selectedAppId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dailyGoal: parseInt(goalValue) }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update goal");
      }

      setError(`Goal updated to ${goalValue} minutes for ${selectedApp}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStreak = async () => {
    const selectedData = streakData?.find(
      (data) => data.targetName === selectedApp
    );
    const lastUpdate = localStorage.getItem(`lastUpdate_${selectedData._id}`);
    const lastMinutes = localStorage.getItem(`lastMinutes_${selectedData._id}`);
    const today = new Date().toDateString();

    try {
      const response = await fetch(`http://localhost:3000/api/wakatime-stats`);
      const data = await response.json();
      const activity = data.data[0].categories.find(
        (category) => category.name === selectedApp
      );

      if (activity) {
        const minutes = Math.floor(activity.total_seconds / 60);
        const willUpdateStreak =
          lastUpdate !== today && minutes >= selectedData.dailyGoal;

        setProgress({
          current: minutes,
          goal: selectedData.dailyGoal,
          status: minutes >= selectedData.dailyGoal ? "success" : "warning",
          streakUpdated:
            lastUpdate === today
              ? "Already updated today"
              : willUpdateStreak
              ? "Streak will update"
              : `Need ${
                  selectedData.dailyGoal - minutes
                } more minutes to maintain streak`,
          lastMinutes: lastMinutes ? parseInt(lastMinutes) : 0,
        });
      }
    } catch (err) {
      setProgress({ error: true });
    }
  };

  return (
    <div className="container p-4">
      <div className="card mb-4">
        <div className="card-header">
          <h3>Track Your Goals</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Select Activity</label>
              <select
                className="form-select"
                value={selectedApp}
                onChange={handleSelectChange}
              >
                <option value="">Choose activity...</option>
                {monthlyData?.data?.[0]?.categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Goal in minutes</label>
              <div className="input-group">
                <input
                  placeholder="Write the duration"
                  type="number"
                  id="goalInp"
                  className="form-control"
                />
                <button onClick={handleUpdate} className="btn btn-primary">
                  Update Goal
                </button>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-info">{error}</div>}

          {streakData
            ?.filter((data) => selectedApp === data.targetName)
            .map((data) => (
              <div key={data._id} className="mt-4">
                <StreakManager
                  targetId={data._id}
                  targetName={data.targetName}
                  dailyGoal={data.dailyGoal}
                  currentStreak={data.currentStreak}
                  longestStreak={data.longestStreak}
                />

                <div className="card">
                  <div className="card-body">
                    <h4>{data.targetName} Stats</h4>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded mb-2">
                          <h5>Daily Goal</h5>
                          <h2>{data.dailyGoal} min</h2>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded mb-2">
                          <h5>Current Streak</h5>
                          <h2>{data.currentStreak} days</h2>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-center p-3 border rounded mb-2">
                          <h5>Longest Streak</h5>
                          <h2>{data.longestStreak} days</h2>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckStreak}
                      className="btn btn-outline-primary mt-3"
                    >
                      Check Progress
                    </button>
                    {progress && (
                      <div
                        className={`alert alert-${
                          progress.error ? "danger" : progress.status
                        } mt-3`}
                      >
                        {progress.error
                          ? "Error checking progress"
                          : `Today's progress: ${progress.current} minutes / ${
                              progress.goal
                            } minutes goal
                           (${
                             progress.current >= progress.goal
                               ? "Goal achieved! 🎉"
                               : `${
                                   progress.goal - progress.current
                                 } minutes remaining`
                           })`}
                        {progress.streakUpdated && (
                          <div className="mt-2 text-muted">
                            {progress.streakUpdated}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

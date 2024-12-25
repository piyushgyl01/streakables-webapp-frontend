import React, { useEffect } from "react";

const StreakManager = ({
  targetId,
  targetName,
  dailyGoal,
  currentStreak,
  longestStreak,
}) => {
  const checkAndUpdateStreak = async (dailyTime) => {
    try {
      const lastUpdate = localStorage.getItem(`lastUpdate_${targetId}`);
      const lastMinutes = localStorage.getItem(`lastMinutes_${targetId}`);
      const today = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      // If last update was before yesterday, check if goal was met
      if (lastUpdate !== yesterdayString && lastUpdate !== today) {
        const shouldReset = !lastMinutes || parseInt(lastMinutes) < dailyGoal;
        if (shouldReset) {
          await fetch(`http://localhost:3000/api/streaks/${targetId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentStreak: 0, longestStreak }),
          });
          localStorage.removeItem(`lastMinutes_${targetId}`);
          return;
        }
      }

      // Store current progress
      localStorage.setItem(`lastMinutes_${targetId}`, dailyTime.toString());

      // Only update streak if not already updated today
      if (lastUpdate !== today) {
        const response = await fetch(
          `http://localhost:3000/api/streaks/${targetId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentStreak: dailyTime >= dailyGoal ? currentStreak + 1 : 0,
              longestStreak:
                dailyTime >= dailyGoal
                  ? Math.max(currentStreak + 1, longestStreak)
                  : longestStreak,
            }),
          }
        );

        if (response.ok) {
          localStorage.setItem(`lastUpdate_${targetId}`, today);
        }
      }
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  useEffect(() => {
    const checkDailyProgress = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/wakatime-stats`
        );
        const data = await response.json();

        const todayActivity = data.data[0].categories.find(
          (category) => category.name === targetName
        );

        if (todayActivity) {
          const dailyMinutes = Math.floor(todayActivity.total_seconds / 60);
          await checkAndUpdateStreak(dailyMinutes);
        }
      } catch (error) {
        console.error("Error checking daily progress:", error);
      }
    };

    // Check every hour
    const interval = setInterval(checkDailyProgress, 3600000);
    checkDailyProgress();

    return () => clearInterval(interval);
  }, [targetId, dailyGoal, currentStreak, targetName, longestStreak]);

  return null;
};

export default StreakManager;

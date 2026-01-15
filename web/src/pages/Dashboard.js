import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Flame, 
  Dumbbell, 
  Apple, 
  Trophy,
  Target,
  Calendar,
  ArrowRight
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [todayMeals, setTodayMeals] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, workoutRes, mealsRes, achievementsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/stats`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/workouts/today`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/nutrition/today`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/users/achievements/recent`)
      ]);

      setStats(statsRes.data);
      setTodayWorkout(workoutRes.data);
      setTodayMeals(mealsRes.data);
      setRecentAchievements(achievementsRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateXPToNextLevel = () => {
    const currentLevel = user.stats.level;
    const xpForNextLevel = currentLevel * 1000;
    const currentXP = user.stats.xp % 1000;
    return { current: currentXP, total: xpForNextLevel };
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  const xpProgress = calculateXPToNextLevel();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}! 💪</h1>
          <p>Let's crush today's goals together</p>
        </div>
        
        <div className="level-card">
          <div className="level-badge">
            <Trophy size={24} />
            <span>Level {user.stats.level}</span>
          </div>
          <div className="xp-progress">
            <div className="xp-bar">
              <motion.div 
                className="xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(xpProgress.current / xpProgress.total) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <span className="xp-text">{xpProgress.current} / {xpProgress.total} XP</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon streak">
            <Flame size={32} />
          </div>
          <div className="stat-content">
            <h3>{user.stats.currentStreak}</h3>
            <p>Day Streak</p>
            <span className="stat-detail">Best: {user.stats.longestStreak} days</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon workouts">
            <Dumbbell size={32} />
          </div>
          <div className="stat-content">
            <h3>{user.stats.totalWorkouts}</h3>
            <p>Total Workouts</p>
            <span className="stat-detail">This month: {stats?.thisMonthWorkouts || 0}</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon calories">
            <TrendingUp size={32} />
          </div>
          <div className="stat-content">
            <h3>{user.stats.totalCaloriesBurned}</h3>
            <p>Calories Burned</p>
            <span className="stat-detail">Keep going!</span>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="stat-icon achievements">
            <Trophy size={32} />
          </div>
          <div className="stat-content">
            <h3>{user.achievements?.length || 0}</h3>
            <p>Achievements</p>
            <span className="stat-detail">Unlock more!</span>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-content">
        <div className="main-section">
          <div className="today-workout card">
            <div className="card-header">
              <h2><Dumbbell size={24} /> Today's Workout</h2>
              {todayWorkout && !todayWorkout.completed && (
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/workouts/log')}
                >
                  Start Workout <ArrowRight size={18} />
                </button>
              )}
            </div>
            
            {todayWorkout ? (
              todayWorkout.completed ? (
                <div className="completed-message">
                  <div className="checkmark">✓</div>
                  <h3>Workout Complete!</h3>
                  <p>Great job! You've earned {todayWorkout.xpEarned} XP</p>
                </div>
              ) : (
                <div className="workout-preview">
                  <h3>{todayWorkout.name}</h3>
                  <p className="workout-description">{todayWorkout.description}</p>
                  <div className="exercise-list">
                    {todayWorkout.exercises.slice(0, 3).map((exercise, index) => (
                      <div key={index} className="exercise-item">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-sets">{exercise.sets} x {exercise.reps}</span>
                      </div>
                    ))}
                    {todayWorkout.exercises.length > 3 && (
                      <p className="more-exercises">+{todayWorkout.exercises.length - 3} more exercises</p>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="rest-day">
                <Calendar size={48} />
                <h3>Rest Day</h3>
                <p>Recovery is just as important as training!</p>
              </div>
            )}
          </div>

          <div className="today-nutrition card">
            <div className="card-header">
              <h2><Apple size={24} /> Today's Nutrition</h2>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/nutrition/log')}
              >
                Log Meal
              </button>
            </div>
            
            {todayMeals ? (
              <div className="nutrition-summary">
                <div className="calorie-ring">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" className="ring-background" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      className="ring-progress"
                      style={{
                        strokeDashoffset: `${283 - (283 * (todayMeals.totalCalories / todayMeals.targetCalories))}`
                      }}
                    />
                  </svg>
                  <div className="ring-content">
                    <span className="calories">{todayMeals.totalCalories}</span>
                    <span className="target">/ {todayMeals.targetCalories}</span>
                  </div>
                </div>
                
                <div className="macros-grid">
                  <div className="macro-item protein">
                    <div className="macro-bar">
                      <div 
                        className="macro-fill"
                        style={{ width: `${(todayMeals.protein / todayMeals.targetProtein) * 100}%` }}
                      />
                    </div>
                    <span className="macro-label">Protein</span>
                    <span className="macro-value">{todayMeals.protein}g / {todayMeals.targetProtein}g</span>
                  </div>
                  
                  <div className="macro-item carbs">
                    <div className="macro-bar">
                      <div 
                        className="macro-fill"
                        style={{ width: `${(todayMeals.carbs / todayMeals.targetCarbs) * 100}%` }}
                      />
                    </div>
                    <span className="macro-label">Carbs</span>
                    <span className="macro-value">{todayMeals.carbs}g / {todayMeals.targetCarbs}g</span>
                  </div>
                  
                  <div className="macro-item fats">
                    <div className="macro-bar">
                      <div 
                        className="macro-fill"
                        style={{ width: `${(todayMeals.fats / todayMeals.targetFats) * 100}%` }}
                      />
                    </div>
                    <span className="macro-label">Fats</span>
                    <span className="macro-value">{todayMeals.fats}g / {todayMeals.targetFats}g</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-meals">
                <p>No meals logged yet today</p>
                <button className="btn-primary" onClick={() => navigate('/nutrition/log')}>
                  Log Your First Meal
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="achievements-card card">
            <h3><Trophy size={20} /> Recent Achievements</h3>
            {recentAchievements.length > 0 ? (
              <div className="achievements-list">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className="achievement-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.title}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="no-achievements">Complete workouts to unlock achievements!</p>
            )}
          </div>

          <div className="goals-card card">
            <h3><Target size={20} /> Weekly Goals</h3>
            <div className="goals-list">
              <div className="goal-item">
                <span className="goal-label">Workouts</span>
                <div className="goal-progress">
                  <div className="goal-bar">
                    <div 
                      className="goal-fill"
                      style={{ width: `${(stats?.weekWorkouts / 4) * 100}%` }}
                    />
                  </div>
                  <span>{stats?.weekWorkouts || 0}/4</span>
                </div>
              </div>
              
              <div className="goal-item">
                <span className="goal-label">Meal Tracking</span>
                <div className="goal-progress">
                  <div className="goal-bar">
                    <div 
                      className="goal-fill"
                      style={{ width: `${(stats?.weekMeals / 21) * 100}%` }}
                    />
                  </div>
                  <span>{stats?.weekMeals || 0}/21</span>
                </div>
              </div>
              
              <div className="goal-item">
                <span className="goal-label">Water Intake</span>
                <div className="goal-progress">
                  <div className="goal-bar">
                    <div 
                      className="goal-fill"
                      style={{ width: `${(stats?.todayWater / 2000) * 100}%` }}
                    />
                  </div>
                  <span>{stats?.todayWater || 0}ml/2000ml</span>
                </div>
              </div>
            </div>
          </div>

          {!isPremium() && (
            <div className="upgrade-card card">
              <h3>🚀 Upgrade to Premium</h3>
              <ul>
                <li>✓ AI Form Analysis</li>
                <li>✓ Barcode Scanning</li>
                <li>✓ Advanced Analytics</li>
                <li>✓ Personalized Coaching</li>
                <li>✓ No Ads</li>
              </ul>
              <button 
                className="btn-premium"
                onClick={() => navigate('/premium')}
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
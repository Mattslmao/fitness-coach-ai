import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var authManager: AuthManager
    @StateObject private var viewModel = DashboardViewModel()
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header
                HStack {
                    VStack(alignment: .leading) {
                        Text("Welcome back, \(authManager.user?.firstName ?? "")! 💪")
                            .font(.title)
                            .fontWeight(.bold)
                        Text("Let's crush today's goals together")
                            .foregroundColor(.secondary)
                    }
                    Spacer()
                }
                .padding()
                
                // Level Card
                LevelCard(level: authManager.user?.stats.level ?? 1,
                         xp: authManager.user?.stats.xp ?? 0)
                
                // Stats Grid
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 15) {
                    StatCard(icon: "flame.fill",
                            value: "\(authManager.user?.stats.currentStreak ?? 0)",
                            label: "Day Streak",
                            color: .orange)
                    
                    StatCard(icon: "dumbbell.fill",
                            value: "\(authManager.user?.stats.totalWorkouts ?? 0)",
                            label: "Workouts",
                            color: .blue)
                    
                    StatCard(icon: "chart.line.uptrend.xyaxis",
                            value: "\(authManager.user?.stats.totalCaloriesBurned ?? 0)",
                            label: "Calories",
                            color: .green)
                    
                    StatCard(icon: "trophy.fill",
                            value: "\(authManager.user?.achievements.count ?? 0)",
                            label: "Achievements",
                            color: .yellow)
                }
                .padding(.horizontal)
                
                // Today's Workout
                if let workout = viewModel.todayWorkout {
                    TodayWorkoutCard(workout: workout)
                        .padding(.horizontal)
                }
                
                // Today's Nutrition
                if let nutrition = viewModel.todayNutrition {
                    NutritionCard(nutrition: nutrition)
                        .padding(.horizontal)
                }
                
                // Recent Achievements
                if let achievements = authManager.user?.achievements.prefix(3) {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Recent Achievements")
                            .font(.headline)
                        
                        ForEach(Array(achievements)) { achievement in
                            AchievementRow(achievement: achievement)
                        }
                    }
                    .padding()
                    .background(Color(.systemBackground))
                    .cornerRadius(15)
                    .shadow(radius: 5)
                    .padding(.horizontal)
                }
                
                // Premium Upgrade (for free users)
                if authManager.user?.subscription.plan == "free" {
                    PremiumBanner()
                        .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
        .onAppear {
            viewModel.loadDashboard()
        }
    }
}

struct LevelCard: View {
    let level: Int
    let xp: Int
    
    var progress: Double {
        let xpForNextLevel = level * 1000
        let currentXP = xp % 1000
        return Double(currentXP) / Double(xpForNextLevel)
    }
    
    var body: some View {
        VStack(spacing: 10) {
            HStack {
                Image(systemName: "trophy.fill")
                    .foregroundColor(.yellow)
                Text("Level \(level)")
                    .font(.title2)
                    .fontWeight(.bold)
            }
            
            ProgressView(value: progress)
                .progressViewStyle(LinearProgressViewStyle(tint: .yellow))
            
            Text("\(xp % 1000) / \(level * 1000) XP")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(
            LinearGradient(gradient: Gradient(colors: [Color.yellow.opacity(0.3), Color.orange.opacity(0.3)]),
                         startPoint: .topLeading,
                         endPoint: .bottomTrailing)
        )
        .cornerRadius(15)
        .padding(.horizontal)
    }
}

struct StatCard: View {
    let icon: String
    let value: String
    let label: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: icon)
                .font(.system(size: 30))
                .foregroundColor(color)
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
            
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(15)
        .shadow(radius: 5)
    }
}
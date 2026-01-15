import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let firstName: String
    let lastName: String
    var profile: Profile
    var subscription: Subscription
    var stats: Stats
    var achievements: [Achievement]
    
    struct Profile: Codable {
        var age: Int?
        var gender: String?
        var height: Double?
        var currentWeight: Double?
        var targetWeight: Double?
        var activityLevel: String?
        var fitnessGoal: String?
        var dietaryPreferences: [String]?
        var injuries: [String]?
    }
    
    struct Subscription: Codable {
        var plan: String
        var status: String
        var billingCycle: String?
        var startDate: Date?
        var endDate: Date?
    }
    
    struct Stats: Codable {
        var totalWorkouts: Int
        var totalCaloriesBurned: Int
        var currentStreak: Int
        var longestStreak: Int
        var level: Int
        var xp: Int
    }
    
    struct Achievement: Codable, Identifiable {
        let id: String
        let title: String
        let description: String
        let icon: String
        let unlockedAt: Date
    }
}
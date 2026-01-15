// FitnessCoachAI/FitnessCoachAIApp.swift
import SwiftUI

@main
struct FitnessCoachAIApp: App {
    @StateObject private var authManager = AuthManager()
    @StateObject private var dataSync = DataSyncManager()
    
    var body: some Scene {
        WindowGroup {
            if authManager.isAuthenticated {
                MainTabView()
                    .environmentObject(authManager)
                    .environmentObject(dataSync)
            } else {
                LoginView()
                    .environmentObject(authManager)
            }
        }
    }
}
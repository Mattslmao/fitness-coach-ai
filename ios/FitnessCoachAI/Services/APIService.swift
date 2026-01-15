import Foundation

class APIService {
    static let shared = APIService()
    private let baseURL = "https://your-api-url.com/api"
    
    private var token: String? {
        get { UserDefaults.standard.string(forKey: "authToken") }
        set { UserDefaults.standard.set(newValue, forKey: "authToken") }
    }
    
    // MARK: - Authentication
    
    func login(email: String, password: String) async throws -> (token: String, user: User) {
        let endpoint = "\(baseURL)/auth/login"
        let body = ["email": email, "password": password]
        
        let (data, response) = try await URLSession.shared.upload(
            for: createRequest(url: endpoint, method: "POST"),
            from: try JSONSerialization.data(withJSONObject: body)
        )
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let result = try JSONDecoder().decode(LoginResponse.self, from: data)
        token = result.token
        return (result.token, result.user)
    }
    
    func register(userData: RegistrationData) async throws -> (token: String, user: User) {
        let endpoint = "\(baseURL)/auth/register"
        
        let (data, response) = try await URLSession.shared.upload(
            for: createRequest(url: endpoint, method: "POST"),
            from: try JSONEncoder().encode(userData)
        )
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }
        
        let result = try JSONDecoder().decode(LoginResponse.self, from: data)
        token = result.token
        return (result.token, result.user)
    }
    
    // MARK: - Workouts
    
    func getTodayWorkout() async throws -> Workout? {
        let endpoint = "\(baseURL)/workouts/today"
        return try await performRequest(url: endpoint)
    }
    
    func logWorkout(_ workout: WorkoutLog) async throws -> Workout {
        let endpoint = "\(baseURL)/workouts"
        return try await performRequest(url: endpoint, method: "POST", body: workout)
    }
    
    // MARK: - Nutrition
    
    func getTodayNutrition() async throws -> NutritionLog? {
        let endpoint = "\(baseURL)/nutrition/today"
        return try await performRequest(url: endpoint)
    }
    
    func logMeal(_ meal: MealLog) async throws -> MealLog {
        let endpoint = "\(baseURL)/nutrition/log"
        return try await performRequest(url: endpoint, method: "POST", body: meal)
    }
    
    func scanBarcode(_ barcode: String) async throws -> Food {
        let endpoint = "\(baseURL)/nutrition/barcode/\(barcode)"
        return try await performRequest(url: endpoint)
    }
    
    // MARK: - Check-ins
    
    func submitCheckIn(_ checkIn: CheckIn) async throws -> CheckIn {
        let endpoint = "\(baseURL)/checkins"
        return try await performRequest(url: endpoint, method: "POST", body: checkIn)
    }
    
    func getAIAnalysis(checkInId: String) async throws -> AIAnalysis {
        let endpoint = "\(baseURL)/ai/analyze-checkin"
        let body = ["checkInId": checkInId]
        return try await performRequest(url: endpoint, method: "POST", body: body)
    }
    
    // MARK: - Helper Methods
    
    private func createRequest(url: String, method: String = "GET") -> URLRequest {
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let token = token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        return request
    }
    
    private func performRequest<T: Decodable>(
        url: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {
        var request = createRequest(url: url, method: method)
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }
}

enum APIError: Error {
    case invalidResponse
    case unauthorized
    case notFound
}

struct LoginResponse: Codable {
    let token: String
    let user: User
}
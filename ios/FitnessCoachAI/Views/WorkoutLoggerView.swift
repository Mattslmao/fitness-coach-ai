import SwiftUI

struct WorkoutLoggerView: View {
    @StateObject private var viewModel = WorkoutLoggerViewModel()
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // Timer
                    WorkoutTimer(duration: viewModel.duration)
                    
                    // Exercise List
                    ForEach(viewModel.exercises.indices, id: \.self) { index in
                        ExerciseCard(
                            exercise: viewModel.exercises[index],
                            onSetComplete: { setIndex in
                                viewModel.completeSet(exerciseIndex: index, setIndex: setIndex)
                            }
                        )
                    }
                    
                    // Notes
                    TextEditor(text: $viewModel.notes)
                        .frame(height: 100)
                        .padding()
                        .background(Color(.systemGray6))
                        .cornerRadius(10)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                        )
                    
                    // Complete Button
                    Button(action: {
                        viewModel.completeWorkout()
                        dismiss()
                    }) {
                        Text("Complete Workout")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                }
                .padding()
            }
            .navigationTitle("Today's Workout")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

struct ExerciseCard: View {
    let exercise: Exercise
    let onSetComplete: (Int) -> Void
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(exercise.name)
                .font(.headline)
            
            ForEach(exercise.sets.indices, id: \.self) { index in
                HStack {
                    Text("Set \(index + 1)")
                        .frame(width: 60, alignment: .leading)
                    
                    Text("\(exercise.sets[index].reps) reps")
                        .frame(width: 80, alignment: .leading)
                    
                    if let weight = exercise.sets[index].weight {
                        Text("\(Int(weight)) kg")
                            .frame(width: 80, alignment: .leading)
                    }
                    
                    Spacer()
                    
                    Button(action: {
                        onSetComplete(index)
                    }) {
                        Image(systemName: exercise.sets[index].completed ? "checkmark.circle.fill" : "circle")
                            .foregroundColor(exercise.sets[index].completed ? .green : .gray)
                            .font(.title2)
                    }
                }
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(10)
        .shadow(radius: 2)
    }
}
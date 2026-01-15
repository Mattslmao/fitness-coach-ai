const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profile: {
    age: Number,
    gender: String,
    height: Number,
    currentWeight: Number,
    targetWeight: Number,
    activityLevel: String,
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'hyrox', 'running', 'general_fitness']
    },
    dietaryPreferences: [String],
    injuries: [String]
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual']
    },
    startDate: Date,
    endDate: Date
  },
  stats: {
    totalWorkouts: { type: Number, default: 0 },
    totalCaloriesBurned: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 }
  },
  achievements: [{
    title: String,
    description: String,
    icon: String,
    unlockedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
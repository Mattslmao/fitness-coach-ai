const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const auth = require('../middleware/auth');
const premium = require('../middleware/premium');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');
const Workout = require('../models/Workout');
const MealLog = require('../models/MealLog');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate personalized program
router.post('/generate-program', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { fitnessGoal, trainingFrequency, dietaryPreferences } = req.body;

    const prompt = `Create a detailed fitness program for a person with the following details:
- Goal: ${fitnessGoal}
- Age: ${user.profile.age}
- Current Weight: ${user.profile.currentWeight}kg
- Target Weight: ${user.profile.targetWeight}kg
- Training Frequency: ${trainingFrequency} days per week
- Activity Level: ${user.profile.activityLevel}
- Dietary Preferences: ${dietaryPreferences.join(', ')}

Please provide:
1. A complete weekly training program with exercises, sets, reps
2. Daily calorie target and macro breakdown (protein, carbs, fats)
3. Sample meal plan with 3 meals and 2 snacks per day
4. Expected timeline to reach goal

Format the response as JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness coach and nutritionist."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const programData = JSON.parse(completion.choices[0].message.content);
    res.json(programData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating program' });
  }
});

// Analyze check-in and provide recommendations
router.post('/analyze-checkin', [auth, premium], async (req, res) => {
  try {
    const { checkInId } = req.body;
    const checkIn = await CheckIn.findById(checkInId);
    
    if (!checkIn || checkIn.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Check-in not found' });
    }

    // Get recent workouts and meals
    const recentWorkouts = await Workout.find({
      userId: req.userId,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const recentMeals = await MealLog.find({
      userId: req.userId,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const user = await User.findById(req.userId).populate('currentProgram');

    const prompt = `Analyze this weekly check-in and provide coaching recommendations:

User Profile:
- Goal: ${user.profile.fitnessGoal}
- Target Weight: ${user.profile.targetWeight}kg

Check-in Data:
- Current Weight: ${checkIn.weight}kg
- Training Days Completed: ${checkIn.questions.trainingDays}/7
- Missed Meals: ${checkIn.questions.missedMeals}
- Mental Energy: ${checkIn.questions.mentalEnergy}/10
- Physical Energy: ${checkIn.questions.physicalEnergy}/10
- Sleep Quality: ${checkIn.questions.sleepQuality}/10
- Stress Level: ${checkIn.questions.stressLevel}/10
- Notes: ${checkIn.questions.notes}

Recent Performance:
- Workouts Completed: ${recentWorkouts.length}
- Average Calories: ${recentMeals.reduce((sum, m) => sum + m.totalCalories, 0) / recentMeals.length}

Please provide:
1. Overall progress assessment
2. Calorie adjustment recommendation (if needed)
3. Macro adjustments (if needed)
4. Training intensity adjustment
5. Motivational message
6. Specific action items for next week

Format as JSON with keys: summary, calorieAdjustment, macroAdjustments, trainingAdjustment, motivationalMessage, actionItems`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness coach providing personalized feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const recommendations = JSON.parse(completion.choices[0].message.content);
    
    // Update check-in with AI recommendations
    checkIn.aiRecommendations = recommendations;
    await checkIn.save();

    res.json(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error analyzing check-in' });
  }
});

// Analyze form video (Premium feature)
router.post('/analyze-form', [auth, premium], async (req, res) => {
  try {
    const { videoUrl, exerciseName } = req.body;

    // In production, you'd use OpenAI's vision API or a specialized form analysis service
    const prompt = `Analyze the form for ${exerciseName} exercise and provide detailed feedback on:
1. Posture and alignment
2. Range of motion
3. Common mistakes observed
4. Specific corrections needed
5. Safety concerns

Provide constructive, detailed feedback.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert personal trainer analyzing exercise form."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error analyzing form' });
  }
});

module.exports = router;
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('theme-toggle');
    const weightForm = document.getElementById('weight-form');
    const resultsSection = document.getElementById('results-section');
    const weatherSection = document.getElementById('weather-section');
    const allExercisesContainer = document.getElementById('all-exercises');
    const cardioExercisesContainer = document.getElementById('cardio-exercises');
    const strengthExercisesContainer = document.getElementById('strength-exercises');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loadingIndicator = document.getElementById('loading');
    const weatherInfo = document.getElementById('weather-info');
    const weatherDetails = document.getElementById('weather-details');
    const weatherRecommendations = document.getElementById('weather-recommendations');
    
    // API Keys 
    const EXERCISE_API_KEY = 'https://wger.de/api/v2/exerciseinfo/';
    const WEATHER_API_KEY = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY'; 

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save theme preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    // Load saved theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Tab Functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-exercises-tab`).classList.add('active');
        });
    });

    const data = null;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener('readystatechange', function () {
	if (this.readyState === this.DONE) {
		console.log(this.responseText);
	}
});

xhr.open('GET', 'https://exercises2.p.rapidapi.com/?bodyPart=back&muscleTarget=abductors&equipmentUsed=assisted');
xhr.setRequestHeader('x-rapidapi-key', '30ae5a3578mshacb79e76bb3f4f2p179d25jsna29616fd7684');
xhr.setRequestHeader('x-rapidapi-host', 'exercises2.p.rapidapi.com');

xhr.send(data);
    
    // Form Submission
    weightForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        
        // Get form values
        const weight = parseFloat(document.getElementById('weight').value);
        const unit = document.querySelector('input[name="unit"]:checked').value;
        
        // Convert weight to kg if needed
        const weightInKg = unit === 'lbs' ? weight * 0.453592 : weight;
        
        try {
            // Generate exercise recommendations
            const exercises = await generateExerciseRecommendations(weightInKg);
            
            // Display exercises
            displayExercises(exercises);
            
            // Get weather-based recommendations
            await getWeatherRecommendations();
            
            // Show results
            resultsSection.classList.remove('hidden');
            weatherSection.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
        }
    });
// Generate Exercise Recommendations
async function generateExerciseRecommendations(weightInKg) {
    // Base exercises (fallback if API fails)
    const baseExercises = [
        {
            name: "Walking",
            description: "Low-impact cardio that's great for beginners",
            intensity: "Low",
            duration: "30-45 minutes",
            icon: "fa-person-walking",
            type: "cardio"
        },
        {
            name: "Swimming",
            description: "Full-body workout with minimal joint stress",
            intensity: "Moderate",
            duration: "20-30 minutes",
            icon: "fa-person-swimming",
            type: "cardio"
        },
        {
            name: "Cycling",
            description: "Great cardio with lower impact on joints",
            intensity: "Moderate",
            duration: "30-45 minutes",
            icon: "fa-bicycle",
            type: "cardio"
        }
    ];
    
    try {
        // Try to fetch exercises from API
        const apiExercises = await fetchExercisesFromAPI(weightInKg);
        
        // If API returns exercises, use those
        if (apiExercises && apiExercises.length > 0) {
            return apiExercises;
        }
    } catch (error) {
        console.error('API Error:', error);
        // If API fails, fall back to local recommendations
    }
    
    // Weight-specific recommendations (fallback)
    if (weightInKg < 60) {
        return [
            ...baseExercises,
            {
                name: "Strength Training",
                description: "Focus on building muscle with moderate weights",
                intensity: "Moderate",
                duration: "45 minutes, 3x per week",
                icon: "fa-dumbbell",
                type: "strength"
            },
            {
                name: "HIIT Workouts",
                description: "High-intensity interval training to build endurance",
                intensity: "High",
                duration: "20 minutes, 2-3x per week",
                icon: "fa-heart-pulse",
                type: "cardio"
            }
        ];
    } else if (weightInKg >= 60 && weightInKg < 80) {
        return [
            ...baseExercises,
            {
                name: "Circuit Training",
                description: "Combination of strength and cardio exercises",
                intensity: "Moderate to High",
                duration: "40 minutes, 3x per week",
                icon: "fa-dumbbell",
                type: "strength"
            },
            {
                name: "Yoga",
                description: "Improves flexibility and core strength",
                intensity: "Low to Moderate",
                duration: "30-60 minutes, 2-3x per week",
                icon: "fa-person-praying",
                type: "strength"
            }
        ];
    } else if (weightInKg >= 80 && weightInKg < 100) {
        return [
            ...baseExercises,
            {
                name: "Elliptical Training",
                description: "Low-impact cardio that's easier on the joints",
                intensity: "Moderate",
                duration: "30-45 minutes, 3-4x per week",
                icon: "fa-person-walking",
                type: "cardio"
            },
            {
                name: "Resistance Training",
                description: "Focus on building strength with proper form",
                intensity: "Moderate to High",
                duration: "45 minutes, 3x per week",
                icon: "fa-dumbbell",
                type: "strength"
            }
        ];
    } else {
        return [
            ...baseExercises,
            {
                name: "Water Aerobics",
                description: "Low-impact exercise that reduces stress on joints",
                intensity: "Low to Moderate",
                duration: "45 minutes, 3x per week",
                icon: "fa-person-swimming",
                type: "cardio"
            },
            {
                name: "Strength Training",
                description: "Focus on compound movements with proper form",
                intensity: "Moderate",
                duration: "30-45 minutes, 3x per week",
                icon: "fa-dumbbell",
                type: "strength"
            }
        ];
    }
}

// Fetch Exercises from API
async function fetchExercisesFromAPI(weightInKg) {
    try {
        // This is a placeholder for the actual API call
        // In a real application, you would use your API key and make a proper request
        
        // Example using ExerciseDB API (requires subscription)
        const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': EXERCISE_API_KEY,
                'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch exercises');
        }
        
        const data = await response.json();
        
        // Process and filter exercises based on weight
        // This is a simplified example - you would need to implement proper filtering logic
        const processedExercises = data.slice(0, 6).map(exercise => ({
            name: exercise.name,
            description: `${exercise.bodyPart} exercise targeting ${exercise.target}`,
            intensity: getIntensityForWeight(weightInKg, exercise),
            duration: getDurationForWeight(weightInKg),
            icon: getIconForExercise(exercise.bodyPart),
            type: exercise.bodyPart.includes('cardio') ? 'cardio' : 'strength'
        }));
        
        return processedExercises;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        // Return empty array to fall back to local recommendations
        return [];
    }
}

// Helper functions for API data processing
function getIntensityForWeight(weight, exercise) {
    // Logic to determine intensity based on weight and exercise type
    if (weight < 60) {
        return 'Low to Moderate';
    } else if (weight < 80) {
        return 'Moderate';
    } else {
        return 'Moderate to High';
    }
}

function getDurationForWeight(weight) {
    // Logic to determine recommended duration based on weight
    if (weight < 70) {
        return '30-45 minutes, 3x per week';
    } else {
        return '20-30 minutes, 4x per week';
    }
}

function getIconForExercise(bodyPart) {
    // Map body parts to Font Awesome icons
    const iconMap = {
        'cardio': 'fa-heart-pulse',
        'chest': 'fa-dumbbell',
        'back': 'fa-dumbbell',
        'shoulders': 'fa-dumbbell',
        'upper arms': 'fa-dumbbell',
        'lower arms': 'fa-dumbbell',
        'upper legs': 'fa-person-walking',
        'lower legs': 'fa-person-walking',
        'waist': 'fa-person-praying',
        'default': 'fa-dumbbell'
    };
    
    return iconMap[bodyPart] || iconMap.default;
}

// Display Exercises
function displayExercises(exercises) {
    // Clear previous results
    allExercisesContainer.innerHTML = '';
    cardioExercisesContainer.innerHTML = '';
    strengthExercisesContainer.innerHTML = '';
    
    // Display all exercises
    exercises.forEach(exercise => {
        const exerciseCard = createExerciseCard(exercise);
        
        // Add to all exercises tab
        allExercisesContainer.appendChild(exerciseCard.cloneNode(true));
        
        // Add to appropriate category tab
        if (exercise.type === 'cardio') {
            cardioExercisesContainer.appendChild(exerciseCard.cloneNode(true));
        } else if (exercise.type === 'strength') {
            strengthExercisesContainer.appendChild(exerciseCard.cloneNode(true));
        }
    });
}

// Create Exercise Card
function createExerciseCard(exercise) {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    
    card.innerHTML = `
        <div class="exercise-icon">
            <i class="fas ${exercise.icon}"></i>
        </div>
        <div class="exercise-details">
            <h3 class="exercise-name">${exercise.name}</h3>
            <p class="exercise-description">${exercise.description}</p>
            <div class="exercise-meta">
                <div>
                    <div class="meta-label">Intensity</div>
                    <div class="meta-value">${exercise.intensity}</div>
                </div>
                <div>
                    <div class="meta-label">Duration</div>
                    <div class="meta-value">${exercise.duration}</div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Get Weather Recommendations
async function getWeatherRecommendations() {
    try {
        // Get user's location
        const position = await getUserLocation();
        const { latitude, longitude } = position.coords;
        
        // Fetch weather data
        const weatherData = await fetchWeatherData(latitude, longitude);
        
        // Display weather info
        displayWeatherInfo(weatherData);
        
        // Generate weather-based recommendations
        const recommendations = generateWeatherRecommendations(weatherData);
        
        // Display recommendations
        displayWeatherRecommendations(recommendations);
    } catch (error) {
        console.error('Weather error:', error);
        weatherSection.classList.add('hidden');
    }
}

// Get User Location
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Fetch Weather Data
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Display Weather Info
function displayWeatherInfo(weatherData) {
    const weatherIcon = document.getElementById('weather-icon');
    const iconCode = weatherData.weather[0].icon;
    
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
    
    weatherDetails.innerHTML = `
        <div class="weather-temp">${Math.round(weatherData.main.temp)}°C</div>
        <div class="weather-desc">${weatherData.weather[0].description} in ${weatherData.name}</div>
    `;
}

// Generate Weather Recommendations
function generateWeatherRecommendations(weatherData) {
    const temp = weatherData.main.temp;
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const recommendations = [];
    
    // Temperature-based recommendations
    if (temp < 5) {
        recommendations.push({
            text: "It's very cold outside. Consider indoor exercises like gym workouts or home fitness routines.",
            icon: "fa-house"
        });
    } else if (temp < 15) {
        recommendations.push({
            text: "Cool weather is great for running or brisk walking. Wear appropriate layers.",
            icon: "fa-person-running"
        });
    } else if (temp < 25) {
        recommendations.push({
            text: "Perfect weather for outdoor activities like hiking, cycling, or team sports.",
            icon: "fa-bicycle"
        });
    } else {
        recommendations.push({
            text: "It's hot outside. Consider swimming, early morning workouts, or indoor air-conditioned facilities.",
            icon: "fa-person-swimming"
        });
    }
    
    // Weather condition-based recommendations
    if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        recommendations.push({
            text: "Rainy weather. Try indoor activities like yoga, pilates, or gym workouts.",
            icon: "fa-cloud-rain"
        });
    } else if (weatherCondition.includes('snow')) {
        recommendations.push({
            text: "Snowy conditions. Consider indoor workouts or winter sports if properly equipped.",
            icon: "fa-snowflake"
        });
    } else if (weatherCondition.includes('clear')) {
        recommendations.push({
            text: "Clear skies are perfect for outdoor runs, hikes, or cycling.",
            icon: "fa-sun"
        });
    } else if (weatherCondition.includes('cloud')) {
        recommendations.push({
            text: "Cloudy but dry conditions are good for most outdoor activities.",
            icon: "fa-cloud"
        });
    }
    
    return recommendations;
}

// Display Weather Recommendations
function displayWeatherRecommendations(recommendations) {
    weatherRecommendations.innerHTML = '';
    
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'weather-recommendation';
        recElement.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${rec.icon} mr-2"></i>
                <span>${rec.text}</span>
            </div>
        `;
        weatherRecommendations.appendChild(recElement);
    });
}

// API Info Modal
document.getElementById('api-info').addEventListener('click', function(e) {
    e.preventDefault();
    alert('This application uses ExerciseDB API for exercise data and OpenWeather API for weather information. In a production environment, these would be properly integrated with secure API keys.');
});
});

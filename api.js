// API related functions
const API = {
    // Replace with your actual API keys
    ADZUNA_APP_ID: 'YOUR_ADZUNA_APP_ID',
    ADZUNA_API_KEY: 'YOUR_ADZUNA_API_KEY',
    
    // Get job listings from Adzuna API
    async getJobs(keyword, location, sortBy = 'relevance', page = 1) {
        try {
            const url = `https://api.adzuna.com/v1/api/jobs/gb/search/${page}?app_id=${this.ADZUNA_APP_ID}&app_key=${this.ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(keyword)}&where=${encodeURIComponent(location)}&sort_by=${sortBy}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },
    
    // Get skills analysis
    async getSkillsAnalysis(keyword) {
        try {
            // This is a mock function since we don't have a real Open Skills API key
            // In a real application, you would make an actual API call
            return {
                skills: [
                    { name: 'JavaScript', demand: 85, growth: 'High' },
                    { name: 'HTML/CSS', demand: 75, growth: 'Stable' },
                    { name: 'React', demand: 90, growth: 'High' },
                    { name: 'Node.js', demand: 80, growth: 'High' },
                    { name: 'SQL', demand: 70, growth: 'Stable' },
                ]
            };
        } catch (error) {
            console.error('Error fetching skills analysis:', error);
            throw error;
        }
    }
};
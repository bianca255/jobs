// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const keywordInput = document.getElementById('keyword');
    const locationInput = document.getElementById('location');
    const searchBtn = document.getElementById('search-btn');
    const sortBySelect = document.getElementById('sort-by');
    const jobListingsEl = document.getElementById('job-listings');
    const skillsAnalysisEl = document.getElementById('skills-analysis');
    
    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    sortBySelect.addEventListener('change', () => {
        if (keywordInput.value) {
            performSearch();
        }
    });
    
    // Functions
    async function performSearch() {
        const keyword = keywordInput.value.trim();
        const location = locationInput.value.trim();
        const sortBy = sortBySelect.value;
        
        if (!keyword) {
            alert('Please enter a job title, skill, or company.');
            return;
        }
        
        try {
            // Show loading state
            jobListingsEl.innerHTML = '<p>Loading job listings...</p>';
            skillsAnalysisEl.innerHTML = '<p>Loading skills analysis...</p>';
            
            // Fetch jobs and skills
            const jobsData = await API.getJobs(keyword, location, sortBy);
            const skillsData = await API.getSkillsAnalysis(keyword);
            
            // Display jobs
            if (jobsData.results && jobsData.results.length > 0) {
                const jobsHTML = jobsData.results.map(job => Utils.createJobCard(job)).join('');
                jobListingsEl.innerHTML = `
                    <h2>Job Listings (${jobsData.count} results)</h2>
                    ${jobsHTML}
                `;
            } else {
                jobListingsEl.innerHTML = '<p>No job listings found. Try different keywords.</p>';
            }
            
            // Display skills
            if (skillsData.skills && skillsData.skills.length > 0) {
                skillsAnalysisEl.innerHTML = `
                    <h2>Skills in Demand</h2>
                    <p>Based on job market analysis for "${keyword}"</p>
                    ${Utils.createSkillsAnalysis(skillsData.skills)}
                `;
            } else {
                skillsAnalysisEl.innerHTML = '<p>No skills analysis available for this search.</p>';
            }
        } catch (error) {
            jobListingsEl.innerHTML = '<p>Error loading job listings. Please try again.</p>';
            skillsAnalysisEl.innerHTML = '<p>Error loading skills analysis. Please try again.</p>';
            console.error(error);
        }
    }
});
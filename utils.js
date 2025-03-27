// Utility functions
const Utils = {
    // Format date to readable format
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },
    
    // Format salary
    formatSalary(min, max) {
        if (!min && !max) return 'Salary not specified';
        if (min && !max) return `£${min.toLocaleString()} per annum`;
        if (!min && max) return `Up to £${max.toLocaleString()} per annum`;
        return `£${min.toLocaleString()} - £${max.toLocaleString()} per annum`;
    },
    
    // Create HTML for job listing
    createJobCard(job) {
        return `
            <div class="job-card" data-id="${job.id}">
                <h3>${job.title}</h3>
                <div class="job-company">${job.company.display_name}</div>
                <div class="job-details">
                    <span>${job.location.display_name}</span>
                    <span>${this.formatSalary(job.salary_min, job.salary_max)}</span>
                    <span>${this.formatDate(job.created)}</span>
                </div>
                <div class="job-description">${job.description.substring(0, 200)}...</div>
                <div class="job-tags">
                    ${job.category.label ? `<span class="job-tag">${job.category.label}</span>` : ''}
                    ${job.contract_time ? `<span class="job-tag">${job.contract_time}</span>` : ''}
                </div>
            </div>
        `;
    },
    
    // Create HTML for skills analysis
    createSkillsAnalysis(skills) {
        return skills.map(skill => `
            <div class="skill-item">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-demand">
                    <div class="skill-demand-bar">
                        <div class="skill-demand-fill" style="width: ${skill.demand}%"></div>
                    </div>
                    <span>${skill.growth}</span>
                </div>
            </div>
        `).join('');
    }
};
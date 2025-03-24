import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/careers.css';

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState('openings');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    resume: null,
    coverLetter: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Sample job listings
  const jobListings = [
    {
      id: 1,
      title: 'Senior Technician - TV & Display Repairs',
      department: 'Technical',
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      salary: '₹30,000 - ₹45,000/month',
      posted: '2 weeks ago',
      description: 'We are looking for an experienced technician specialized in TV and display repairs including LED, LCD, OLED, and Plasma technologies.',
      responsibilities: [
        'Diagnose and repair complex issues in TVs and display devices',
        'Perform component-level repairs on various brands',
        'Install and configure smart TV features',
        'Maintain proper documentation of repairs',
        'Manage inventory of parts and tools'
      ],
      requirements: [
        'Minimum 3 years of experience in TV repair',
        'Certification in electronics repair',
        'Knowledge of various TV brands and technologies',
        'Problem-solving skills and attention to detail',
        'Good customer service skills'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Performance bonuses',
        'Training and certification opportunities',
        'Career growth opportunities'
      ]
    },
    {
      id: 2,
      title: 'Mobile Phone Repair Specialist',
      department: 'Technical',
      location: 'Delhi NCR',
      type: 'Full-time',
      salary: '₹25,000 - ₹40,000/month',
      posted: '1 week ago',
      description: 'Join our team as a Mobile Phone Repair Specialist to diagnose and repair a wide range of smartphone issues for all major brands.',
      responsibilities: [
        'Repair smartphones from various manufacturers (Apple, Samsung, OnePlus, etc.)',
        'Replace screens, batteries, and other components',
        'Diagnose hardware and software problems',
        'Perform data recovery when possible',
        'Maintain repair records and inventory'
      ],
      requirements: [
        'At least 2 years of experience in mobile repair',
        'Knowledge of iOS and Android operating systems',
        'Experience with microsoldering preferred',
        'Excellent troubleshooting skills',
        'Customer service orientation'
      ],
      benefits: [
        'Competitive salary with incentives',
        'Medical coverage',
        'Paid time off',
        'Flexible work schedule',
        'Employee discounts'
      ]
    },
    {
      id: 3,
      title: 'Customer Service Representative',
      department: 'Customer Support',
      location: 'Remote/Work from Home',
      type: 'Full-time',
      salary: '₹20,000 - ₹30,000/month',
      posted: '3 days ago',
      description: 'We are hiring Customer Service Representatives to handle customer inquiries, bookings, and provide support through multiple channels.',
      responsibilities: [
        'Handle incoming customer calls and messages',
        'Process service bookings and schedule appointments',
        'Resolve customer complaints and issues',
        'Coordinate with technicians for service delivery',
        'Maintain customer records in CRM system'
      ],
      requirements: [
        'Previous customer service experience preferred',
        'Excellent communication skills in English and Hindi',
        'Basic computer skills and familiarity with CRM software',
        'Ability to work in shifts',
        'Empathetic and patient attitude'
      ],
      benefits: [
        'Performance incentives',
        'Health and wellness programs',
        'Career advancement opportunities',
        'Training and development',
        'Work-from-home flexibility'
      ]
    },
    {
      id: 4,
      title: 'AC & Refrigeration Technician',
      department: 'Technical',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      salary: '₹25,000 - ₹35,000/month',
      posted: '1 month ago',
      description: 'Experienced AC and Refrigeration Technician needed to join our growing team in Bangalore. Handle installations, repairs, and maintenance.',
      responsibilities: [
        'Install, repair, and maintain AC units and refrigerators',
        'Diagnose mechanical and electrical issues',
        'Perform preventive maintenance services',
        'Handle refrigerant management and disposal',
        'Educate customers on proper usage and maintenance'
      ],
      requirements: [
        'ITI certification in refrigeration and air conditioning',
        '2+ years of hands-on experience',
        'Knowledge of various AC brands and technologies',
        'Valid driving license',
        'Ability to lift and move heavy equipment'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance for employee and family',
        'Two-wheeler allowance',
        'Tools and uniform provided',
        'Technical training and certification support'
      ]
    }
  ];
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedJob(null);
    setShowForm(false);
  };
  
  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setFormData({
      ...formData,
      position: job.title
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleApplyClick = () => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your server
    console.log('Application submitted:', formData);
    
    // Show success message
    setFormSuccess(true);
    setShowForm(false);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: selectedJob ? selectedJob.title : '',
        experience: '',
        resume: null,
        coverLetter: ''
      });
    }, 300);
  };
  
  return (
    <div className="careers-page">
      <div className="careers-hero">
        <div className="container">
          <h1>Join Our Team</h1>
          <p>Build your career with RepairAIHub, India's leading repair service provider</p>
        </div>
      </div>
      
      <div className="container">
        <div className="careers-tabs">
          <button 
            className={`tab-btn ${activeTab === 'openings' ? 'active' : ''}`}
            onClick={() => handleTabChange('openings')}
          >
            Current Openings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'benefits' ? 'active' : ''}`}
            onClick={() => handleTabChange('benefits')}
          >
            Benefits & Culture
          </button>
          <button 
            className={`tab-btn ${activeTab === 'process' ? 'active' : ''}`}
            onClick={() => handleTabChange('process')}
          >
            Hiring Process
          </button>
        </div>
        
        {activeTab === 'openings' && (
          <div className="careers-content">
            {formSuccess && (
              <div className="application-success">
                <div className="success-icon">✓</div>
                <h3>Application Submitted Successfully!</h3>
                <p>Thank you for your interest in joining our team. Our HR department will review your application and contact you soon.</p>
                <button 
                  className="back-btn"
                  onClick={() => {
                    setFormSuccess(false);
                    setSelectedJob(null);
                  }}
                >
                  Back to Job Listings
                </button>
              </div>
            )}
            
            {!formSuccess && (
              <>
                {selectedJob ? (
                  <div className="job-details">
                    <button 
                      className="back-to-listings"
                      onClick={() => setSelectedJob(null)}
                    >
                      ← Back to All Listings
                    </button>
                    
                    <div className="job-header">
                      <h2>{selectedJob.title}</h2>
                      <div className="job-meta">
                        <span className="job-department">{selectedJob.department}</span>
                        <span className="job-location">{selectedJob.location}</span>
                        <span className="job-type">{selectedJob.type}</span>
                      </div>
                      <div className="job-salary">{selectedJob.salary}</div>
                      <button 
                        className="apply-btn"
                        onClick={handleApplyClick}
                      >
                        Apply Now
                      </button>
                    </div>
                    
                    <div className="job-body">
                      <div className="job-section">
                        <h3>Job Description</h3>
                        <p>{selectedJob.description}</p>
                      </div>
                      
                      <div className="job-section">
                        <h3>Responsibilities</h3>
                        <ul>
                          {selectedJob.responsibilities.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="job-section">
                        <h3>Requirements</h3>
                        <ul>
                          {selectedJob.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="job-section">
                        <h3>Benefits</h3>
                        <ul>
                          {selectedJob.benefits.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {showForm && (
                      <div className="application-form-container" id="application-form">
                        <h3>Apply for {selectedJob.title}</h3>
                        <form onSubmit={handleSubmit} className="application-form">
                          <div className="form-row">
                            <div className="form-group">
                              <label>Full Name *</label>
                              <input 
                                type="text" 
                                name="fullName" 
                                value={formData.fullName} 
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Email *</label>
                              <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label>Phone Number *</label>
                              <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label>Years of Experience *</label>
                              <select 
                                name="experience" 
                                value={formData.experience} 
                                onChange={handleInputChange}
                                required
                              >
                                <option value="">Select Experience</option>
                                <option value="0-1">Less than 1 year</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5+">5+ years</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label>Resume/CV (PDF, DOC, DOCX) *</label>
                            <input 
                              type="file" 
                              name="resume" 
                              accept=".pdf,.doc,.docx" 
                              onChange={handleFileChange}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Cover Letter</label>
                            <textarea 
                              name="coverLetter" 
                              value={formData.coverLetter} 
                              onChange={handleInputChange}
                              rows="5"
                              placeholder="Tell us why you're interested in this position and what makes you a good fit..."
                            ></textarea>
                          </div>
                          
                          <div className="form-actions">
                            <button type="submit" className="submit-btn">Submit Application</button>
                            <button 
                              type="button" 
                              className="cancel-btn"
                              onClick={() => setShowForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {!showForm && (
                      <div className="job-footer">
                        <button 
                          className="apply-btn"
                          onClick={handleApplyClick}
                        >
                          Apply for this Position
                        </button>
                        <p className="job-posted">Posted: {selectedJob.posted}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="job-listings">
                    <h2>Current Job Openings</h2>
                    <p className="listings-intro">Join our team of dedicated professionals and grow your career with us.</p>
                    
                    <div className="jobs-container">
                      {jobListings.map(job => (
                        <div className="job-card" key={job.id} onClick={() => handleJobSelect(job)}>
                          <h3 className="job-title">{job.title}</h3>
                          <div className="job-info">
                            <span className="job-department">{job.department}</span>
                            <span className="job-location">{job.location}</span>
                            <span className="job-type">{job.type}</span>
                          </div>
                          <p className="job-description">{job.description}</p>
                          <div className="job-card-footer">
                            <div className="job-salary">{job.salary}</div>
                            <button className="view-job-btn">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        
        {activeTab === 'benefits' && (
          <div className="careers-content">
            <div className="benefits-section">
              <h2>Why Work With Us</h2>
              <p className="section-intro">At RepairAIHub, we believe in creating a positive work environment where employees can thrive and grow. Here are some benefits of joining our team:</p>
              
              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <h3>Health & Wellness</h3>
                  <p>Comprehensive health insurance for you and your family, wellness programs, and paid sick leave.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3>Learning & Development</h3>
                  <p>Regular training sessions, certification support, and opportunities to learn new technologies.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3>Career Growth</h3>
                  <p>Clear career paths, regular performance reviews, and opportunities for advancement within the company.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-coins"></i>
                  </div>
                  <h3>Competitive Compensation</h3>
                  <p>Market-competitive salaries, performance bonuses, and incentive programs.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-balance-scale"></i>
                  </div>
                  <h3>Work-Life Balance</h3>
                  <p>Flexible working hours, paid time off, and family-friendly policies.</p>
                </div>
                
                <div className="benefit-card">
                  <div className="benefit-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>Inclusive Culture</h3>
                  <p>Diverse and inclusive workplace where everyone's opinions are valued and respected.</p>
                </div>
              </div>
              
              <div className="culture-section">
                <h2>Our Culture</h2>
                <div className="culture-values">
                  <div className="value-item">
                    <h3>Excellence</h3>
                    <p>We strive for excellence in everything we do, from customer service to technical repairs.</p>
                  </div>
                  
                  <div className="value-item">
                    <h3>Innovation</h3>
                    <p>We embrace new technologies and innovative solutions to stay ahead in the industry.</p>
                  </div>
                  
                  <div className="value-item">
                    <h3>Integrity</h3>
                    <p>We operate with honesty, transparency, and ethical business practices.</p>
                  </div>
                  
                  <div className="value-item">
                    <h3>Teamwork</h3>
                    <p>We believe in collaboration and supporting each other to achieve common goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'process' && (
          <div className="careers-content">
            <div className="process-section">
              <h2>Our Hiring Process</h2>
              <p className="section-intro">We have a structured hiring process designed to identify the best talent and ensure a good fit for both candidates and our company.</p>
              
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Application Review</h3>
                    <p>Our HR team reviews all applications to identify candidates whose skills and experience match our requirements.</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Phone Screening</h3>
                    <p>Selected candidates will have a brief phone interview to discuss their experience, skills, and job expectations.</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Technical Assessment</h3>
                    <p>For technical roles, candidates will complete a skills assessment or practical test relevant to the position.</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>In-Person Interview</h3>
                    <p>Qualified candidates will be invited for an in-person or video interview with the hiring manager and team members.</p>
                  </div>
                </div>
                
                <div className="process-step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>Final Decision</h3>
                    <p>After evaluating all candidates, we'll make a decision and extend an offer to the selected candidate.</p>
                  </div>
                </div>
              </div>
              
              <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                
                <div className="faq-item">
                  <h3>How long does the hiring process usually take?</h3>
                  <p>Our hiring process typically takes 2-3 weeks from application to final decision, although this may vary depending on the position and number of applicants.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Do you offer internships or opportunities for freshers?</h3>
                  <p>Yes, we offer internship programs and entry-level positions for fresh graduates throughout the year. Check our current openings or contact us for more information.</p>
                </div>
                
                <div className="faq-item">
                  <h3>What should I wear to the interview?</h3>
                  <p>We recommend business casual attire for interviews. For technical roles, the dress code is slightly more relaxed, but still professional.</p>
                </div>
                
                <div className="faq-item">
                  <h3>Can I apply for multiple positions at once?</h3>
                  <p>Yes, you can apply for multiple positions if you meet the qualifications. However, we recommend focusing on roles that best match your skills and career goals.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="careers-cta">
        <div className="container">
          <h2>Don't See the Right Fit?</h2>
          <p>We're always looking for talented individuals to join our team. Send us your resume and we'll keep it on file for future opportunities.</p>
          <Link to="/contact" className="contact-btn">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default CareersPage; 
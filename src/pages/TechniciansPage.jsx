import React from 'react';
import Hero from '../components/common/Hero';
import { Link } from 'react-router-dom';

const TechniciansPage = () => {
  // Sample technicians data - In a real app, this would come from an API or database
  const technicians = [
    {
      id: 1,
      name: "Ajay Sharma",
      role: "Senior Mobile Repair Technician",
      experience: 8,
      specialization: "Smartphone Screen & Battery Replacements",
      certification: "Apple Certified Technician, Samsung Authorized Service",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Ajay has over 8 years of experience in mobile phone repairs. He specializes in complex screen replacements and logic board repairs for all major smartphone brands."
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "TV & Display Specialist",
      experience: 6,
      specialization: "LED/LCD TV Repairs, Display Calibration",
      certification: "LG Certified Technician, Sony Professional Service",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Priya is our display expert with a deep understanding of TV panel technologies. She handles everything from simple settings adjustments to complex board-level repairs for all major TV brands."
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "AC & Refrigeration Expert",
      experience: 10,
      specialization: "HVAC Systems, Refrigerant Handling",
      certification: "HVAC Certified, Daikin Authorized Technician",
      image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=876&q=80",
      bio: "With a decade of experience in AC and refrigeration systems, Rajesh can diagnose and fix cooling issues efficiently. He's certified in refrigerant handling and specializes in energy efficiency optimization."
    },
    {
      id: 4,
      name: "Sunita Verma",
      role: "Home Appliances Technician",
      experience: 7,
      specialization: "Washing Machines, Dishwashers, Microwaves",
      certification: "Whirlpool Certified, Bosch Service Partner",
      image: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Sunita is our home appliance expert who specializes in washing machines and kitchen appliances. Her attention to detail and problem-solving skills make her excellent at diagnosing complex appliance issues."
    },
    {
      id: 5,
      name: "Mohan Singh",
      role: "Water Purifier Specialist",
      experience: 5,
      specialization: "RO Systems, UV Purifiers",
      certification: "Aquaguard Certified Technician, Kent Service Expert",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Mohan specializes in water purification systems including RO, UV, and UF technologies. He's known for his meticulous maintenance work and ability to optimize water quality through proper calibration."
    },
    {
      id: 6,
      name: "Anjali Desai",
      role: "Computer & Laptop Technician",
      experience: 6,
      specialization: "Hardware Troubleshooting, Data Recovery",
      certification: "CompTIA A+, Microsoft Certified",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
      bio: "Anjali has expertise in computer hardware and software repairs. She excels at data recovery operations and motherboard-level repairs for laptops and desktops of all major brands."
    }
  ];

  return (
    <div className="technicians-page">
      <Hero 
        title="Our Expert Technicians" 
        subtitle="Meet the skilled professionals who'll repair your devices"
        backgroundImage="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />
      
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Our Technicians Stand Out</h2>
            <p className="section-subtitle">We take pride in our team of certified and experienced repair specialists</p>
          </div>
          
          <div className="tech-benefits">
            <div className="tech-benefit">
              <div className="benefit-icon">
                <i className="fas fa-certificate"></i>
              </div>
              <h3>Certified Experts</h3>
              <p>All our technicians hold professional certifications from leading manufacturers and industry organizations.</p>
            </div>
            
            <div className="tech-benefit">
              <div className="benefit-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Continuous Training</h3>
              <p>Regular training on the latest technologies and repair techniques ensures our team stays ahead of the curve.</p>
            </div>
            
            <div className="tech-benefit">
              <div className="benefit-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3>Experienced Professionals</h3>
              <p>With an average of 7+ years of experience, our technicians have seen and solved thousands of repair challenges.</p>
            </div>
            
            <div className="tech-benefit">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Quality Guaranteed</h3>
              <p>We stand behind our work with comprehensive warranties and a commitment to customer satisfaction.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section technicians-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Repair Specialists</h2>
            <p className="section-subtitle">The skilled professionals who make your repairs quick and reliable</p>
          </div>
          
          <div className="technicians-grid">
            {technicians.map(tech => (
              <div className="technician-card" key={tech.id}>
                <div className="technician-image">
                  <img src={tech.image} alt={tech.name} />
                </div>
                <div className="technician-info">
                  <h3>{tech.name}</h3>
                  <div className="technician-role">{tech.role}</div>
                  <div className="technician-exp">
                    <i className="fas fa-briefcase"></i> {tech.experience} years experience
                  </div>
                  <div className="technician-cert">
                    <i className="fas fa-award"></i> {tech.certification.split(',')[0]}
                  </div>
                  <p className="technician-bio">{tech.bio}</p>
                  <div className="technician-specialization">
                    <h4>Specializes in:</h4>
                    <p>{tech.specialization}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section join-team-section">
        <div className="container">
          <div className="join-team-content">
            <div className="join-team-text">
              <h2>Join Our Team of Technicians</h2>
              <p>Are you a skilled repair technician? We're always looking for talented professionals to join our growing team. Enjoy competitive pay, flexible hours, and continuous training opportunities.</p>
              <Link to="/careers" className="btn-secondary">View Careers</Link>
            </div>
            <div className="join-team-image">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" alt="Join our team" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Expert Repair Services?</h2>
            <p>Our technicians are ready to solve your device problems with professional expertise</p>
            <Link to="/book-service" className="btn-primary">Book a Service</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechniciansPage; 
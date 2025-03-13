import Hero from '../components/common/Hero';

const techniciansData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Senior TV & Electronics Repair Specialist",
    experience: "12+ years",
    expertise: ["Smart TVs", "Home Theater Systems", "Gaming Consoles"],
    certifications: ["LG Certified Technician", "Samsung Electronics Specialist"],
    imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Rajesh has been repairing electronics for over 12 years and specializes in modern smart TVs and home entertainment systems. His detailed knowledge of circuitry and diagnostic skills make him our go-to expert for complex TV repairs."
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Mobile Device Repair Expert",
    experience: "8+ years",
    expertise: ["Smartphones", "Tablets", "Data Recovery"],
    certifications: ["Apple Certified Technician", "Samsung Mobile Repair Specialist"],
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    bio: "Priya is our mobile repair expert with specialized training in iPhone and Samsung Galaxy repairs. She excels at microsoldering, screen replacements, and data recovery from damaged devices."
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "HVAC & AC Systems Specialist",
    experience: "15+ years",
    expertise: ["Split AC Systems", "Inverter ACs", "Commercial Cooling"],
    certifications: ["Daikin Certified Technician", "Blue Star Service Expert"],
    imageUrl: "https://images.unsplash.com/photo-1618151313441-bc79b11e5090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    bio: "Vikram brings 15 years of HVAC experience and specializes in diagnosing and repairing all major AC brands. His expertise in refrigerant handling and electrical systems ensures reliable repairs even for the most complicated AC issues."
  },
  {
    id: 4,
    name: "Ananya Patel",
    role: "Customer Relations Manager",
    experience: "6+ years",
    expertise: ["Service Coordination", "Customer Support", "Quality Assurance"],
    certifications: ["Customer Experience Management", "Service Excellence Certification"],
    imageUrl: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    bio: "Ananya ensures that our customers receive exceptional service from start to finish. She coordinates our technician schedules, handles customer inquiries, and follows up on all service calls to ensure complete satisfaction."
  },
  {
    id: 5,
    name: "Arjun Mehta",
    role: "Refrigeration Systems Expert",
    experience: "10+ years",
    expertise: ["Side-by-Side Refrigerators", "Inverter Technology", "Commercial Units"],
    certifications: ["Whirlpool Master Technician", "LG Refrigeration Specialist"],
    imageUrl: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
    bio: "Arjun specializes in refrigeration systems with deep knowledge of both residential and commercial refrigerators. His extensive experience with modern inverter technology refrigerators makes him invaluable for complex cooling issues."
  },
  {
    id: 6,
    name: "Deepak Verma",
    role: "Water Purification Specialist",
    experience: "9+ years",
    expertise: ["RO Systems", "UV Purifiers", "Water Softeners"],
    certifications: ["Kent RO Certified Technician", "Aquaguard Specialist"],
    imageUrl: "https://images.unsplash.com/photo-1635975229704-dba4c66c33b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Deepak is our water purification expert with specialized training in all major RO system brands. He's known for his meticulous attention to detail and commitment to ensuring clean, safe drinking water for all our customers."
  }
];

const TechniciansPage = () => {
  return (
    <div className="technicians-page">
      <Hero 
        title="Our Expert Technicians" 
        subtitle="Meet our team of certified professionals dedicated to providing exceptional repair services"
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80"
      />
      
      <section className="section">
        <div className="container">
          <div className="technicians-intro">
            <h2 className="section-title">The RepairAIHub Team</h2>
            <p className="technicians-description">
              Our team consists of highly trained and certified technicians with expertise across various appliances and electronics. 
              Each specialist brings years of hands-on experience, ongoing training, and a commitment to excellence. 
              When you choose RepairAIHub, you're working with professionals who take pride in their craft and are dedicated to 
              providing lasting solutions to your repair needs.
            </p>
          </div>
          
          <div className="technicians-grid">
            {techniciansData.map(technician => (
              <div key={technician.id} className="technician-card">
                <div className="technician-image">
                  <img src={technician.imageUrl} alt={technician.name} />
                </div>
                <div className="technician-details">
                  <h3 className="technician-name">{technician.name}</h3>
                  <p className="technician-role">{technician.role}</p>
                  <p className="technician-experience">Experience: {technician.experience}</p>
                  <div className="technician-expertise">
                    <h4>Specializations:</h4>
                    <ul>
                      {technician.expertise.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="technician-bio">{technician.bio}</p>
                  <div className="technician-certifications">
                    {technician.certifications.map((cert, index) => (
                      <span key={index} className="certification-badge">{cert}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Why Our Technicians Stand Out</h2>
          <div className="technician-features">
            <div className="technician-feature">
              <h3>Certified & Trained</h3>
              <p>All our technicians undergo rigorous training and certification programs to stay updated with the latest repair techniques and technologies.</p>
            </div>
            <div className="technician-feature">
              <h3>Experienced Specialists</h3>
              <p>With an average of 10+ years of hands-on experience, our team has encountered and successfully resolved virtually every repair scenario.</p>
            </div>
            <div className="technician-feature">
              <h3>Background Verified</h3>
              <p>For your peace of mind, all our technicians undergo thorough background checks and are fully vetted before joining our team.</p>
            </div>
            <div className="technician-feature">
              <h3>Customer-Focused</h3>
              <p>Beyond technical skills, our technicians are selected for their communication skills and customer-first approach to service.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechniciansPage; 
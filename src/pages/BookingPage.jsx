import Hero from '../components/common/Hero';
import ContactForm from '../components/common/ContactForm';
import { getAllServices } from '../data/services';

const BookingPage = () => {
  const services = getAllServices();
  
  return (
    <div className="booking-page">
      <Hero 
        title="Book a Repair Service" 
        subtitle="Schedule a repair service with our expert technicians"
        backgroundImage="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        ctaText="View Our Services"
        ctaLink="/services"
      />
      
      <section className="section">
        <div className="container">
          <div className="booking-container">
            <div className="booking-info">
              <h2 className="section-title">How It Works</h2>
              
              <div className="booking-steps">
                <div className="booking-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Fill Out the Form</h3>
                    <p>Complete the booking form with your contact details and information about your repair needs.</p>
                  </div>
                </div>
                
                <div className="booking-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Get a Confirmation</h3>
                    <p>We'll review your request and send you a confirmation email with the appointment details.</p>
                  </div>
                </div>
                
                <div className="booking-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Expert Service</h3>
                    <p>Our technician will arrive at the scheduled time to diagnose and repair your device.</p>
                  </div>
                </div>
                
                <div className="booking-step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Enjoy Your Repaired Device</h3>
                    <p>Once the repair is complete, you can get back to using your device with our repair warranty.</p>
                  </div>
                </div>
              </div>
              
              <div className="service-highlights">
                <h3>Our Services Include:</h3>
                <ul>
                  {services.map(service => (
                    <li key={service.id}>{service.title}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="booking-form-container">
              <ContactForm isBooking={true} />
            </div>
          </div>
        </div>
      </section>
      
      <section className="section bg-light">
        <div className="container">
          <h2 className="section-title">Booking FAQs</h2>
          <div className="booking-faqs">
            <div className="booking-faq">
              <h3>How soon can I get an appointment?</h3>
              <p>In most cases, we can schedule appointments within 24-48 hours of your request. For emergency repairs, we offer same-day service when available.</p>
            </div>
            
            <div className="booking-faq">
              <h3>Do I need to be present during the repair?</h3>
              <p>For most repairs, we recommend that someone be present to provide access to the device and discuss any specific issues. However, arrangements can be made if you cannot be present.</p>
            </div>
            
            <div className="booking-faq">
              <h3>What if I need to reschedule my appointment?</h3>
              <p>You can reschedule your appointment by calling our customer service line at least 24 hours before your scheduled time. Late cancellations may incur a small fee.</p>
            </div>
            
            <div className="booking-faq">
              <h3>How do I prepare for my repair appointment?</h3>
              <p>Please ensure the device is accessible and, if possible, make a note of when and how the issue occurs. For data-containing devices like phones or computers, we recommend backing up your data before the appointment.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage; 
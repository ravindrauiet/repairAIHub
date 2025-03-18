// Navigation dropdown and mobile menu handling
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Dropdown handling for desktop
  const dropdowns = document.querySelectorAll('.dropdown');
  
  if (dropdowns.length > 0) {
    dropdowns.forEach(dropdown => {
      // Desktop hover effect
      if (window.innerWidth > 768) {
        dropdown.addEventListener('mouseenter', function() {
          this.classList.add('show');
        });
        
        dropdown.addEventListener('mouseleave', function() {
          this.classList.remove('show');
        });
      }
      
      // Toggle dropdown on click (especially for mobile)
      const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
          
          if (window.innerWidth <= 768) {
            // Close other open dropdowns
            dropdowns.forEach(item => {
              if (item !== dropdown && item.classList.contains('show')) {
                item.classList.remove('show');
              }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('show');
            
            // Change toggle icon
            const icon = dropdownToggle.querySelector('.dropdown-icon');
            if (icon) {
              if (dropdown.classList.contains('show')) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
              } else {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
              }
            }
          }
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown') && window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('show');
          
          const icon = dropdown.querySelector('.dropdown-icon');
          if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
          }
        });
      }
    });
  }
  
  // Close mobile menu when clicking outside
  if (navMenu) {
    document.addEventListener('click', function(e) {
      if (
        navMenu.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.mobile-menu-toggle')
      ) {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Reset mobile menu state when returning to desktop
      if (navMenu) {
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
      
      // Reset any open dropdowns in desktop mode
      if (dropdowns.length > 0) {
        dropdowns.forEach(dropdown => {
          if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            
            const icon = dropdown.querySelector('.dropdown-icon');
            if (icon) {
              icon.classList.remove('fa-chevron-up');
              icon.classList.add('fa-chevron-down');
            }
          }
        });
      }
    }
  });
}); 
'use strict';

/**
 * navbar toggle
 */
const header = document.querySelector("[data-header]");
const navToggleBtn = document.querySelector("[data-nav-toggle-btn]");

navToggleBtn.addEventListener("click", function () {
  header.classList.toggle("nav-active");
  this.classList.toggle("active");
});


/**
 * toggle the navbar when click any navbar link
 */
const navbarLinks = document.querySelectorAll("[data-nav-link]");

navbarLinks.forEach(link => {
  link.addEventListener("click", function () {
    header.classList.toggle("nav-active");
    navToggleBtn.classList.toggle("active");
  });
});

/**
 * back to top & header
 */
const backTopBtn = document.querySelector("[data-back-to-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * Contact Form Submission
 */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formResponse = document.getElementById("formResponse");
    
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formResponse.innerHTML = '';
    formResponse.className = 'form-response';
    
    try {
      const formData = new FormData(contactForm);
      const response = await fetch("https://formspree.io/f/keerthanakoya10@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        formResponse.className = 'form-response success';
        formResponse.innerHTML = 'Thank you! Your message has been sent. I will contact you soon.';
        contactForm.reset();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      formResponse.className = 'form-response error';
      formResponse.innerHTML = 'Oops! Something went wrong. Please try again later.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Message";
    }
  });
}
// Plans Section Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselInner = document.getElementById('carouselInner');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const plansCarousel = document.getElementById('plansCarousel');
  
  // Fetch plans from API
  fetch('/api/plans')
    .then(response => response.json())
    .then(plans => {
      loadingSpinner.classList.add('d-none');
      
      if (plans.length === 0) {
        carouselInner.innerHTML = '<div class="carousel-item active"><p>No plans available</p></div>';
        return;
      }
      
      // Group plans into chunks of 3 for carousel items
      const chunkSize = 3;
      const chunks = [];
      for (let i = 0; i < plans.length; i += chunkSize) {
        chunks.push(plans.slice(i, i + chunkSize));
      }
      
      // Create carousel items
      chunks.forEach((chunk, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        const row = document.createElement('div');
        row.className = 'row g-4';
        
        chunk.forEach(plan => {
          const col = document.createElement('div');
          col.className = 'col-md-4';
          
          col.innerHTML = `
            <div class="card plan-card h-100" onclick="showPlanDetails('${plan._id}')">
              <div class="card-body">
                <h5 class="card-title">${plan.planName}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Plan No: ${plan.planNumber}</h6>
                <p class="card-text"><span class="badge bg-primary">${plan.policyType}</span></p>
                <hr>
                <p class="card-text"><i class="fas fa-user me-2"></i>Entry Age: ${plan.minEntryAge}-${plan.maxEntryAge} years</p>
                <p class="card-text"><i class="fas fa-calendar-alt me-2"></i>Term: ${plan.policyTerm.min}-${plan.policyTerm.max} years</p>
                <p class="card-text"><i class="fas fa-rupee-sign me-2"></i>Sum Assured: ₹${plan.sumAssured.min.toLocaleString()}+</p>
              </div>
              <div class="card-footer bg-transparent">
                <small class="text-muted">Click for details</small>
              </div>
            </div>
          `;
          
          row.appendChild(col);
        });
        
        carouselItem.appendChild(row);
        carouselInner.appendChild(carouselItem);
      });
      
      plansCarousel.classList.remove('d-none');
      
      // Initialize carousel
      new bootstrap.Carousel(plansCarousel);
    })
    .catch(err => {
      console.error('Error fetching plans:', err);
      loadingSpinner.innerHTML = '<div class="alert alert-danger">Failed to load plans. Please try again later.</div>';
    });
});

// Global function to show plan details in modal
window.showPlanDetails = async function(planId) {
  try {
    const response = await fetch(`/api/plans/${planId}`);
    const plan = await response.json();
    
    // Update the modal with plan details
    document.getElementById('detailPlanName').textContent = plan.planName;
    document.getElementById('detailPlanNumber').textContent = `Plan No: ${plan.planNumber}`;
    document.getElementById('detailPolicyType').textContent = plan.policyType;
    document.getElementById('detailEntryAge').textContent = `${plan.minEntryAge} - ${plan.maxEntryAge} years`;
    document.getElementById('detailPolicyTerm').textContent = `${plan.policyTerm.min} - ${plan.policyTerm.max} years`;
    document.getElementById('detailSumAssured').textContent = `₹${plan.sumAssured.min.toLocaleString()} (minimum)`;
    document.getElementById('detailPremiumTerm').textContent = plan.premiumPaymentTerm;
    
    // Render features
    const featuresContainer = document.getElementById('detailFeatures');
    featuresContainer.innerHTML = plan.features.map(feature => 
      `<span class="badge feature-badge bg-info text-dark">${feature}</span>`
    ).join('');
    
    // Render benefits
    const benefitsContainer = document.getElementById('detailBenefits');
    benefitsContainer.innerHTML = '<ul>' + plan.benefits.map(benefit => 
      `<li>${benefit}</li>`
    ).join('') + '</ul>';
    
    // Show the modal
    const planModal = new bootstrap.Modal(document.getElementById('planModal'));
    planModal.show();
  } catch (err) {
    console.error('Error fetching plan details:', err);
    alert('Failed to load plan details. Please try again.');
  }
};
// First increment the count
fetch('http://localhost:5000/api/visit', {
  method: 'POST'
});

// Then get and show the count
fetch('http://localhost:5000/api/visit')
  .then(res => res.json())
  .then(data => {
    document.getElementById('visitorCount').innerText = data.count;
  });


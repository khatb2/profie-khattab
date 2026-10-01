document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. LANGUAGE SETTINGS & SWITCHER
  // ==========================================================================
  const langSwitchBtn = document.getElementById('langSwitchBtn');
  const langToggleLinks = document.querySelectorAll('.lang-toggle-link');
  
  // Set language function
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'ar') lang = 'en';
    
    // Save to local storage
    localStorage.setItem('khattab_lang', lang);
    
    // Apply body classes
    if (lang === 'ar') {
      document.body.classList.remove('lang-en');
      document.body.classList.add('lang-ar');
      document.body.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      document.body.classList.remove('lang-ar');
      document.body.classList.add('lang-en');
      document.body.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
    
    // Update active nav link underlines or language-dependent elements if any
    updateLangBtnText(lang);
  }
  
  function updateLangBtnText(lang) {
    if (!langSwitchBtn) return;
    
    // Update the button text to show the toggle target
    if (lang === 'en') {
      langSwitchBtn.innerHTML = '<span class="lang-en">AR</span>';
    } else {
      langSwitchBtn.innerHTML = '<span class="lang-ar">EN</span>';
    }
  }

  // Toggle button click listener (Navbar)
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentLang = document.body.classList.contains('lang-ar') ? 'ar' : 'en';
      const targetLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(targetLang);
    });
  }

  // Language links click listener (Footer)
  langToggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = link.getAttribute('data-target-lang');
      setLanguage(targetLang);
      
      // Smooth scroll back to top if changing language to see the changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Initialize Language on load
  const savedLang = localStorage.getItem('khattab_lang') || 'en';
  setLanguage(savedLang);


  // ==========================================================================
  // 2. MOBILE NAVIGATION MENU
  // ==========================================================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    
    // Close menu when clicking on nav link (specifically for anchor links on same page)
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }


  // ==========================================================================
  // 3. FAQ ACCORDION LOGIC
  // ==========================================================================
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentNode;
      const isOpen = faqItem.classList.contains('open');
      
      // Close all other FAQ items for a cleaner presentation
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.faq-question-btn').setAttribute('aria-expanded', false);
      });
      
      // Toggle current item
      if (!isOpen) {
        faqItem.classList.add('open');
        button.setAttribute('aria-expanded', true);
      }
    });
  });


  // ==========================================================================
  // 4. HASH-BASED ROUTING FOR DETAILS DASHBOARD
  // ==========================================================================
  // Function to switch view on details page
  function handleHashChange() {
    // Only proceed if we are on the details page (has subviews)
    const subviews = document.querySelectorAll('.details-subview');
    if (subviews.length === 0) return;
    
    const hash = window.location.hash.substring(1) || 'overview';
    let matched = false;
    
    subviews.forEach(view => {
      if (view.id === hash) {
        view.classList.add('active');
        matched = true;
      } else {
        view.classList.remove('active');
      }
    });
    
    // Fallback to overview dashboard if invalid hash is supplied
    if (!matched) {
      const overviewElement = document.getElementById('overview');
      if (overviewElement) {
        overviewElement.classList.add('active');
      }
    }
    
    // Smooth scroll back to page main area
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Expose global navigation handler
  window.navigateToSection = function(sectionId) {
    if (sectionId === 'overview') {
      window.location.hash = '';
      // Also update history to clean hash if supported
      if (history.pushState) {
        history.pushState('', document.title, window.location.pathname);
      }
    } else {
      window.location.hash = sectionId;
    }
  };

  // Bind hashchange events
  window.addEventListener('hashchange', handleHashChange);
  
  // Run on page load for deep linking
  handleHashChange();


  // ==========================================================================
  // 5. ACCORDION LOGIC FOR EXPANDABLE TIMELINES (WORK EXPERIENCE)
  // ==========================================================================
  window.toggleAccordion = function(element) {
    const isOpen = element.classList.contains('open');
    
    // Close other items in the same experience list
    const parentContainer = element.closest('.exp-list');
    if (parentContainer) {
      parentContainer.querySelectorAll('.exp-item').forEach(item => {
        item.classList.remove('open');
      });
    }
    
    // Toggle current item
    if (!isOpen) {
      element.classList.add('open');
    }
  };


  // ==========================================================================
  // 6. AUTO COPYRIGHT YEAR
  // ==========================================================================
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  // ==========================================================================
  // 7. CAROUSEL LOGIC
  // ==========================================================================
  const carousels = document.querySelectorAll('.project-carousel');
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const images = track.querySelectorAll('img');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');
    
    if (images.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }
    
    let currentIndex = 0;
    
    function updateCarousel() {
      const isRtl = document.body.classList.contains('lang-ar');
      const translateValue = isRtl ? currentIndex * 100 : -(currentIndex * 100);
      track.style.transform = `translateX(${translateValue}%)`;
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0; // loop back
        }
        updateCarousel();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = images.length - 1; // loop to end
        }
        updateCarousel();
      });
    }
    
    // Listen for language change to update transform direction
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateCarousel();
        }
      });
    });
    observer.observe(document.body, { attributes: true });
  });

});

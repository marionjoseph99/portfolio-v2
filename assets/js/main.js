/**
* Template Name: MyResume
* Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();




























  const typedText = document.getElementById("typed-text");

  function type() {
    if (charIndex < words[wordIndex].length) {
      typedText.textContent += words[wordIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newWordDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedText.textContent = words[wordIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, typingDelay);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, 1000);
  });

  // Optional: Hide loader when page fully loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
    }, 4000); // adjust this as needed
  });







  window.addEventListener("load", () => {
    const loader = document.getElementById("loader-overlay");
    const mainContent = document.getElementById("main-content");
    const circle = document.getElementById("circle-transition");
  
    setTimeout(() => {
      loader.classList.add("fade-out");
  
      setTimeout(() => {
        circle.classList.add("expand-circle"); // trigger circle expand
        setTimeout(() => {
          loader.style.display = "none"; // hide the loader completely
          mainContent.style.display = "block";
        }, 800); // wait for circle expand to finish
      }, 500); // slight delay after fade out
    }, 3000); // initial loader display duration
  });






  

  
  // Function to trigger animation when the progress bar comes into view
const skillProgressBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries, skillObserver) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target.querySelector('.skill-progress-bar');
      const progress = entry.target.getAttribute('data-progress');
      
      // Start the animation (smoothly increasing width)
      progressBar.style.width = progress;
      entry.target.style.opacity = 1; // Make the progress bar visible
      entry.target.style.transform = 'translateY(0)'; // Make the progress bar slide into view

      // Stop observing the element after it has been animated
      skillObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5, // Trigger when 50% of the element is in the viewport
});

// Observe each progress bar element
skillProgressBars.forEach(skillProgressBar => {
  skillObserver.observe(skillProgressBar);
});







/* chatbot java */
document.addEventListener('DOMContentLoaded', () => {
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    const chatDisplay = document.getElementById('chatDisplay');
    const chatLoadingSpinner = document.getElementById('chatLoadingSpinner');
    const chatSendText = document.getElementById('chatSendText'); // Get the send text span

    // Initially hide the spinner and show the text
    chatLoadingSpinner.style.display = 'none';
    chatSendText.style.display = 'inline-block';

    // Information about Marjo to be used by the AI
    const marjoInfo = `
        Name: Marjo Paguia
        Age: 27
        Gender: Male
        Birthday: June 06, 1998
        Birth place: Sierra Bullones, Bohol
        Location: General Trias, Cavite, Philippines
        Timezone: GMT+8
        Contact:
          Email: noroniomarjo@gmail.com
          Phone: +639917484985
          Website: www.marjo.site
        Current Role: Computer-aided Design Drafter
        Program: Bachelot of Science in Architecture
        School: National University PH – Calamba, Laguna Campus
        Education:
          - College: National University PH – Calamba, Laguna Campus, BS Architecture (2019–2025)
          - Senior High & Junior High: Mandaluyong City High School (2013–2019)
          - Elementary: Felimon P. Javier Elementary School (2006–2013)
        Summary: Aspiring architect and visual artist with a strong foundation in design, rendering, and creative visualization. Specializes in architectural renderings, spatial planning, and digital illustrations using tools like Revit, AutoCAD, SketchUp, Blender, and Adobe Creative Suite. Passionate about combining technical precision with artistry to create inspiring, functional spaces.
        Skills: Autodesk AutoCAD, Autodesk Revit, SketchUp Pro, D5 Render, Lumion, Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro
        Tools: AutoCAD, Revit, SketchUp, Blender, Photoshop, Illustrator, Premiere Pro, D5 Render, Lumion
        Work Experience:
          - Solar Proposal Designer at Beehive BPO (San Pedro, Laguna, 2023–2024)
          - Freelance Architectural Student under the brand M.Studio (General Trias, Cavite, 2019–present)
        Awards:
          - Grand Prize – National Anthem Music Video Making Contest (Mandaluyong High School)
          - Gov. Neptali Gonzales Awardee (Mandaluyong High School)
          - Academic Excellence Award – With Honors (Mandaluyung High School)
          - Specific Discipline Award – Technical Drafting (Mandaluyong High School)
          - Top Three – Architectural Design 6 Top Performer (EARIST)
          - Grand Prize – Institutional T-shirt Design Competition (EARIST)
        Services:
          - 3D Modelling: Crafting high-quality 3D models for architecture, product visualization, and creative projects.
          - Rendering: Producing photorealistic renderings for architectural and interior design.
          - Manual Drawings: Hand-drawn architectural and artistic sketches with detail and authenticity.
          - Presentation Board Layout: Clean, professional boards for architectural design presentations.
          - Upcoming Services: New creative and professional services in development—stay tuned!
        Personality:
          Traits: Visual artist, Detail-oriented, Creative and technical thinker, Emotionally aware, Professional and respectful communicator
          Communication Style: Professional but conversational; prefers clear, direct language without jargon or corporate buzzwords.
        Goals: Build a long-term career in architectural design and drafting, eventually run an architectural firm, and continue blending art and architecture to create meaningful designs.
        Social Media Accounts:
          - Facebook: https://www.facebook.com/people/MStudio/100093286052861/
          - Instagram: https://www.instagram.com/13_1_18_jo/?next=%2F
          - LinkedIn: https://www.linkedin.com/in/marjo-paguia-6b5839144/
          - Behance: https://www.behance.net/marjopaguia
          - Tiktok: https://www.tiktok.com/@m.studio24?is_from_webapp=1&sender_device=pc
        Availability for commission:
          - anytime Every Saturday and Sunday 
        Freelance/ Commission prices
          - send me a message for quotation
    `;

    // Function for typewriter effect
    // This function will now ONLY receive plain text.
    function typeWriterEffect(element, text, delay = 20) {
        let i = 0;
        element.textContent = ''; // Use textContent for plain text
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    chatDisplay.scrollTop = chatDisplay.scrollHeight;
                } else {
                    clearInterval(interval);
                    resolve(); // Resolve the promise when typing is complete
                }
            }, delay);
        });
    }

    // Function to process message content: extract buttons and return remaining text
    function processMessageContent(text) {
        const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s]+?)\)/g;
        let plainText = text;
        const buttons = [];
        let match;

        // Collect all button data and remove markdown links from the text
        while ((match = linkRegex.exec(plainText)) !== null) {
            buttons.push({ text: match[1], url: match[2] });
        }
        // Remove markdown links from the text for the typewriter effect
        plainText = plainText.replace(linkRegex, '');

        return { plainText, buttons };
    }


    // Function to add a message to the chat display with animation and typewriter effect
    async function addMessage(sender, rawText, isAnimated = true) { // Renamed 'text' to 'rawText' for clarity
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        if (isAnimated) {
            messageDiv.classList.add('animated');
        }

        const bubbleSpan = document.createElement('span');
        bubbleSpan.classList.add('message-bubble');
        messageDiv.appendChild(bubbleSpan); // Append the bubble first

        chatDisplay.appendChild(messageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll to bottom


        if (sender === 'gemini') {
            const { plainText, buttons } = processMessageContent(rawText);

            // 1. Apply typewriter effect to the plain text part
            if (plainText.trim().length > 0) {
                await typeWriterEffect(bubbleSpan, plainText); // Wait for typing to complete
            }

            // 2. Add buttons AFTER the typing effect is done
            if (buttons.length > 0) {
                // Create a container for buttons to ensure proper layout
                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('chat-buttons-container');
                bubbleSpan.appendChild(buttonsContainer); // Append container inside the bubble

                buttons.forEach(buttonData => {
                    const button = document.createElement('button');
                    button.classList.add('chat-button');
                    button.textContent = buttonData.text;
                    button.onclick = () => window.open(buttonData.url, '_blank');
                    buttonsContainer.appendChild(button);
                });
            }
            chatDisplay.scrollTop = chatDisplay.scrollHeight; // Scroll again in case buttons add height

        } else {
            bubbleSpan.textContent = rawText; // User messages appear instantly
        }
        return messageDiv;
    }

    // Function to add a typing indicator
    function addTypingIndicator() {
        const typingMessageDiv = document.createElement('div');
        typingMessageDiv.classList.add('chat-message', 'gemini', 'typing-indicator');
        typingMessageDiv.id = 'typingIndicator';

        const bubbleSpan = document.createElement('span');
        bubbleSpan.classList.add('message-bubble');
        bubbleSpan.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        typingMessageDiv.appendChild(bubbleSpan);
        chatDisplay.appendChild(typingMessageDiv);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // Function to remove the typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to send a message to Gemini API
    async function sendMessageToGemini() {
        const userQuestion = chatInput.value.trim();
        if (!userQuestion) return;

        addMessage('user', userQuestion);
        chatInput.value = '';

        chatLoadingSpinner.style.display = 'inline-block';
        chatSendText.style.display = 'none';
        chatSendBtn.disabled = true;
        chatInput.disabled = true;

        addTypingIndicator();

        try {
            const prompt = `You are an AI assistant representing Marjo Paguia, an architecture graduate. Your goal is to answer questions about Marjo in a friendly, conversational, and concise manner. Use *only* the provided information about Marjo. When providing social media links, format them using Markdown like this: [Account Name](URL). For example, [My LinkedIn](https://linkedin.com/in/marjopaguia). Avoid starting responses with phrases like "Based on the information provided," "According to the data," or similar formal introductions. If a question cannot be answered solely from the given details, respond with "I apologize, I don't have information on that specific topic about Marjo." Do not invent or assume any information. Make sure information that needs to be bulleted must in in bullet format like the services, skills, etc...

            Here is the information about Marjo:
            ${marjoInfo}

            User's Question: "${userQuestion}"`;

            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];

            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyAzseidssxw0OO1TLdC-O5BXu3EncHf56I";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();

            removeTypingIndicator();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponse = result.candidates[0].content.parts[0].text;
                await addMessage('gemini', aiResponse); // Await the message adding to ensure typing is done
            } else {
                await addMessage('gemini', 'I apologize, I could not generate a response at this time. Please try again.');
            }
        } catch (error) {
            removeTypingIndicator();
            console.error('Error communicating with Gemini API:', error);
            await addMessage('gemini', `An error occurred: ${error.message}. Please try again.`);
        } finally {
            chatLoadingSpinner.style.display = 'none';
            chatSendText.style.display = 'inline-block';
            chatSendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // Event listeners
    chatSendBtn.addEventListener('click', sendMessageToGemini);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageToGemini();
        }
    });

    const chatModal = document.getElementById('chatModal');
    chatModal.addEventListener('shown.bs.modal', () => {
        chatInput.focus();
    });
});

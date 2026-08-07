/* ==========================================================================
   INK & CODE - INTERACTIVE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. INK PARTICLE CANVAS ANIMATION
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ink-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 2.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw faint lines between close particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ------------------------------------------------------------------------
     2. HEADER SCROLL & MOBILE MENU TOGGLE
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. INTERACTIVE AI CHATBOT PLAYGROUND ("INKBOT")
     ------------------------------------------------------------------------ */
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');
  const clearChatBtn = document.getElementById('clear-chat');
  const quickChips = document.querySelectorAll('.quick-chip');

  const botResponses = {
    web: "🌐 <strong>Web Development:</strong> I build ultra-fast, responsive web apps and static landing pages using Modern HTML5, Vanilla CSS, JS, and React/Vite. All sites are optimized for mobile, SEO, and lightning performance. Prices start around $450.",
    ai: "🤖 <strong>AI Chatbots:</strong> I create intelligent conversational bots powered by OpenAI/LLM APIs. They can be embedded directly onto your website to automate FAQs, qualify incoming leads, or guide visitors 24/7!",
    poster: "🎨 <strong>Poster Design:</strong> I design high-impact minimalist & brutalist posters, typography visuals, and event collaterals in high resolution print formats (300 DPI). Perfect for tech events, branding, or digital artwork.",
    pricing: "💰 <strong>Pricing & Services:</strong><br>• Poster Design & Branding<br>• Web Development & Web Apps<br>• Custom AI Chatbot Integrations<br>Fill out the contact form below or reach us directly at <strong>shakthiisivakumar@gmail.com</strong> / <strong>+91 9566656841</strong> for custom quotes!",
    start: "🚀 <strong>Starting a Project:</strong> Simply scroll down to the Contact section, pick your service, fill in your details, and submit your inquiry! You can also email <strong>shakthiisivakumar@gmail.com</strong> or call <strong>9566656841</strong>.",
    default: "Thank you for reaching out! As your AI assistant, I can help answer questions regarding Web Development, Custom AI Chatbots, or Poster Designs. Feel free to use the quick chips below or send a message!"
  };

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text;

    msgDiv.appendChild(bubble);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function handleUserChat(userText) {
    if (!userText.trim()) return;

    // Append User Message
    appendMessage('user', userText);
    chatInput.value = '';

    // Show Typing Indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot';
    typingDiv.innerHTML = `<div class="msg-bubble" style="font-style: italic; color: #888;">InkBot is typing...</div>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      typingDiv.remove();

      // Determine response logic
      const lower = userText.toLowerCase();
      let responseText = botResponses.default;

      if (lower.includes('web') || lower.includes('site') || lower.includes('landing') || lower.includes('frontend')) {
        responseText = botResponses.web;
      } else if (lower.includes('ai') || lower.includes('bot') || lower.includes('chat') || lower.includes('gpt')) {
        responseText = botResponses.ai;
      } else if (lower.includes('poster') || lower.includes('design') || lower.includes('graphic') || lower.includes('print')) {
        responseText = botResponses.poster;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('package')) {
        responseText = botResponses.pricing;
      } else if (lower.includes('start') || lower.includes('hire') || lower.includes('contact') || lower.includes('book')) {
        responseText = botResponses.start;
      }

      appendMessage('bot', responseText);
    }, 750);
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserChat(chatInput.value);
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        handleUserChat(prompt);
      }
    });
  });

  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      chatBody.innerHTML = `
        <div class="chat-msg bot">
          <div class="msg-bubble">
            Chat cleared! How can I assist you with your web, AI, or poster project today?
          </div>
        </div>
      `;
    });
  }

  /* ------------------------------------------------------------------------
     4. PORTFOLIO FILTERING LOGIC
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     5. LIGHTBOX IMAGE MODAL FOR POSTERS
     ------------------------------------------------------------------------ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.getElementById('lightbox-close');

  const lightboxTriggers = document.querySelectorAll('.open-lightbox');

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgPath = trigger.getAttribute('data-img');
      const title = trigger.getAttribute('data-title');

      if (lightboxImg && lightboxModal) {
        lightboxImg.src = imgPath;
        if (lightboxTitle) lightboxTitle.textContent = title;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });

  /* ------------------------------------------------------------------------
     6. CONTACT FORM SUBMISSION (EMAIL TO shakthiisivakumar@gmail.com)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" size="20"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => { toast.classList.add('show'); }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.remove(); }, 300);
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phoneInput = document.getElementById('contact-phone');
      const phone = phoneInput ? phoneInput.value : '';
      const service = document.getElementById('contact-service').value;
      const message = document.getElementById('contact-msg').value;

      // Construct mailto URL to send directly to shakthiisivakumar@gmail.com
      const targetEmail = 'shakthiisivakumar@gmail.com';
      const subject = `[INK & CODE Project Inquiry] ${service} - ${name}`;
      const body = `Hi Shakthii,\n\nYou have received a new project inquiry from your website:\n\n` +
                   `• Name: ${name}\n` +
                   `• Email: ${email}\n` +
                   `• Phone Number: ${phone || 'Not provided'}\n` +
                   `• Service Required: ${service}\n\n` +
                   `• Project Details:\n${message}\n\n` +
                   `Sent via INK & CODE Web Inquiry Form`;

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Trigger mailto link for direct emailing
      window.location.href = mailtoUrl;

      showToast(`Thank you, ${name}! Your inquiry is opening in your email app for sending to ${targetEmail}.`);
      contactForm.reset();
    });
  }

});

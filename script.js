/**
 * ABSOLUTE EVENT & TRAVEL SERVICES — EDITORIAL WHITE THEME SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHomeHero();
  initInquiryTabs();
  initVisaChecker();
  initModalHandlers();
  initFormSubmissions();
});

/* --------------------------------------------------------------------------
   0. MOBILE NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('open'));
  });

  // Close after tapping a link.
  menu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });
}

/* --------------------------------------------------------------------------
   0b. HOME HERO — transparent nav solidifies on scroll + subtle image parallax.
   Only present on index.html (#home / #home-hero-image); no-ops elsewhere so
   visa.html/fleet.html's plain sticky navbar is unaffected.
   -------------------------------------------------------------------------- */
function initHomeHero() {
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('home');
  const heroImage = document.getElementById('home-hero-image');
  if (!navbar || !hero) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    if (!reduceMotion && heroImage) {
      heroImage.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
    }
    ticking = false;
  }

  document.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
}

/* --------------------------------------------------------------------------
   1. HERO INQUIRY TABS
   -------------------------------------------------------------------------- */
function initInquiryTabs() {
  const tabs = document.querySelectorAll('.pill-tab');
  const container = document.getElementById('dynamic-inquiry-form');

  const tabFields = {
    corporate: `
      <div class="field-group">
        <label>Event / Trip Type</label>
        <select class="input-light" id="corp-type">
          <option>Corporate Summit & MICE</option>
          <option>Employee Incentive Trip</option>
          <option>Product Launch / Gala</option>
          <option>Destination Wedding</option>
        </select>
      </div>
      <div class="field-group">
        <label>Destination</label>
        <input type="text" class="input-light" placeholder="e.g. Dubai, Switzerland, Goa" id="corp-dest">
      </div>
      <div class="field-group">
        <label>Delegates / Guests</label>
        <input type="number" class="input-light" placeholder="e.g. 120 Attendees" id="corp-guests">
      </div>
      <div class="field-group">
        <label>Month</label>
        <input type="month" class="input-light" id="corp-date">
      </div>
      <button class="btn btn-navy" style="margin-top: 18px;" onclick="triggerQuickInquiry('corporate')">
        Plan Event <i class="fas fa-arrow-right"></i>
      </button>
    `,
    holiday: `
      <div class="field-group">
        <label>Destination</label>
        <input type="text" class="input-light" placeholder="e.g. Maldives, Europe, Bali" id="hol-dest">
      </div>
      <div class="field-group">
        <label>Travelers</label>
        <select class="input-light" id="hol-travelers">
          <option>Couple / Honeymoon</option>
          <option>Family (3-5 Guests)</option>
          <option>Group of Friends</option>
          <option>Solo Traveler</option>
        </select>
      </div>
      <div class="field-group">
        <label>Duration</label>
        <select class="input-light" id="hol-duration">
          <option>3 - 5 Days</option>
          <option>7 - 10 Days</option>
          <option>2 Weeks+</option>
        </select>
      </div>
      <div class="field-group">
        <label>Dietary Care</label>
        <select class="input-light" id="hol-diet">
          <option>Standard Meals</option>
          <option>Authentic Indian Meals</option>
          <option>Jain Culinary Care</option>
        </select>
      </div>
      <button class="btn btn-navy" style="margin-top: 18px;" onclick="triggerQuickInquiry('holiday')">
        Explore Vacations <i class="fas fa-arrow-right"></i>
      </button>
    `,
    visa: `
      <div class="field-group">
        <label>Country</label>
        <select class="input-light" id="visa-country">
          <option>Schengen Area (Europe)</option>
          <option>United States (USA)</option>
          <option>United Kingdom (UK)</option>
          <option>UAE / Dubai</option>
          <option>Singapore</option>
          <option>Japan</option>
        </select>
      </div>
      <div class="field-group">
        <label>Visa Category</label>
        <select class="input-light" id="visa-category">
          <option>Tourist Visa</option>
          <option>Business / Summit Visa</option>
          <option>Family Visitor</option>
        </select>
      </div>
      <div class="field-group">
        <label>Applicants</label>
        <input type="number" class="input-light" value="1" min="1" id="visa-count">
      </div>
      <div class="field-group">
        <label>Urgency</label>
        <select class="input-light" id="visa-urgency">
          <option>Standard Audit</option>
          <option>Fast-Track Slot</option>
        </select>
      </div>
      <button class="btn btn-navy" style="margin-top: 18px;" onclick="triggerQuickInquiry('visa')">
        Check Requirements <i class="fas fa-arrow-right"></i>
      </button>
    `,
    car: `
      <div class="field-group">
        <label>Service Type</label>
        <select class="input-light" id="car-type">
          <option>Airport Pick & Drop</option>
          <option>Local Full Day Chauffeur</option>
          <option>Outstation Journey</option>
          <option>Wedding Convoy</option>
        </select>
      </div>
      <div class="field-group">
        <label>Vehicle Class</label>
        <select class="input-light" id="car-veh">
          <option>Innova Crysta / Fortuner SUV</option>
          <option>Luxury Sedan (BMW / Mercedes)</option>
          <option>Executive Coach (Tempo)</option>
          <option>Swift Dzire / Etios</option>
        </select>
      </div>
      <div class="field-group">
        <label>Pickup Location</label>
        <input type="text" class="input-light" value="Delhi NCR" id="car-city">
      </div>
      <div class="field-group">
        <label>Date</label>
        <input type="date" class="input-light" id="car-date">
      </div>
      <button class="btn btn-navy" style="margin-top: 18px;" onclick="triggerQuickInquiry('car')">
        Reserve Vehicle <i class="fas fa-arrow-right"></i>
      </button>
    `
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      if (container && tabFields[target]) {
        container.innerHTML = tabFields[target];
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. VISA & PASSPORT DATA
   -------------------------------------------------------------------------- */
const visaData = {
  schengen: {
    title: "Schengen Visa (Europe)",
    processing: "10 - 15 Working Days",
    validity: "Up to 90 Days",
    docs: [
      "Valid Original Passport (at least 6 months validity)",
      "Bank Statements (Last 6 Months with Bank Seal)",
      "Income Tax Returns (ITR Acknowledgements - Last 3 Years)",
      "Confirmed Flight & Hotel Cover Itinerary"
    ]
  },
  usa: {
    title: "United States (B1/B2 Visitor Visa)",
    processing: "Appointment Slot Dependent + 3 Days",
    validity: "10 Years Multiple Entry",
    docs: [
      "DS-160 Confirmation Page",
      "Valid Passport & Old Passports",
      "Financial Proof & Property / Investment Documents",
      "Employment / Business Ownership Proof"
    ]
  },
  uk: {
    title: "United Kingdom Standard Visitor",
    processing: "15 - 20 Working Days",
    validity: "6 Months / 2 Years Multiple Entry",
    docs: [
      "Passport with 2 blank pages",
      "6 Months Bank Statements showing clear funds",
      "Pay Slips (Last 6 Months) or Business Reg",
      "Covering Letter detailing trip itinerary"
    ]
  },
  uae: {
    title: "Dubai / UAE Express eVisa",
    processing: "24 - 48 Hours Express",
    validity: "30 / 60 Days Tourist",
    docs: [
      "Clear Passport Front & Back Scan",
      "Passport Size Photo (White Background)",
      "Confirmed Flight Return Ticket"
    ]
  },
  singapore: {
    title: "Singapore Tourist & Business Visa",
    processing: "3 - 4 Working Days",
    validity: "Up to 2 Years Multiple Entry",
    docs: [
      "Form 14A duly signed",
      "2 Passport photos (35x45mm, matte finish)",
      "6 Months Bank Statement with seal",
      "Covering Letter detailing trip"
    ]
  },
  japan: {
    title: "Japan Tourist eVisa / Sticker",
    processing: "4 - 5 Working Days",
    validity: "90 Days Single / Multiple Entry",
    docs: [
      "Original Passport",
      "ITR last 1 year",
      "Bank Statement last 6 months",
      "Day-wise Detailed Itinerary in Japan"
    ]
  }
};

function initVisaChecker() {
  const countryBtns = document.querySelectorAll('.country-pill-btn');
  countryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      countryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const countryKey = btn.getAttribute('data-country');
      renderVisaDetails(countryKey);
    });
  });
}

function renderVisaDetails(key) {
  const data = visaData[key];
  if (!data) return;

  const titleEl = document.getElementById('visa-detail-title');
  const procEl = document.getElementById('visa-detail-processing');
  const docsList = document.getElementById('visa-detail-docs');

  if (titleEl) titleEl.innerText = data.title;
  if (procEl) procEl.innerText = `Average Processing: ${data.processing} | Validity: ${data.validity}`;

  if (docsList) {
    docsList.innerHTML = data.docs.map(doc => `
      <li style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 0.95rem; color: #1E293B;">
        <i class="fas fa-check" style="color: #C5A059;"></i> ${doc}
      </li>
    `).join('');
  }
}

/* --------------------------------------------------------------------------
   3. MODAL & INQUIRY POPUP
   -------------------------------------------------------------------------- */
function openModal() {
  const modal = document.getElementById('inquiry-modal');
  if (modal) modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('inquiry-modal');
  if (modal) modal.classList.remove('active');
}

function initModalHandlers() {
  const modal = document.getElementById('inquiry-modal');
  const closeBtn = document.querySelector('.modal-close');
  const openBtns = document.querySelectorAll('.trigger-modal');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on ESC.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Read a field's trimmed value by id (returns '' if missing/empty). */
function fieldVal(id) {
  const el = document.getElementById(id);
  return el && el.value ? el.value.trim() : '';
}

/* Build a readable summary from whichever hero-tab fields the user filled. */
function buildInquirySummary(category) {
  const map = {
    corporate: [['Type', 'corp-type'], ['Destination', 'corp-dest'], ['Delegates', 'corp-guests'], ['Month', 'corp-date']],
    holiday:   [['Destination', 'hol-dest'], ['Travelers', 'hol-travelers'], ['Duration', 'hol-duration'], ['Dietary', 'hol-diet']],
    visa:      [['Country', 'visa-country'], ['Category', 'visa-category'], ['Applicants', 'visa-count'], ['Urgency', 'visa-urgency']],
    car:       [['Service', 'car-type'], ['Vehicle', 'car-veh'], ['Pickup', 'car-city'], ['Date', 'car-date']]
  };
  const rows = (map[category] || [])
    .map(([label, id]) => [label, fieldVal(id)])
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${v}`);
  return rows.join('\n');
}

function triggerQuickInquiry(category) {
  const select = document.getElementById('modal-service-type');
  const notes = document.getElementById('modal-notes');

  if (select) select.value = category;

  // Carry the hero-form details into the modal instead of discarding them.
  const summary = buildInquirySummary(category);
  if (notes && summary) {
    notes.value = notes.value ? `${summary}\n\n${notes.value}` : summary;
  }

  openModal();
}

/* --------------------------------------------------------------------------
   4. FORM SUBMISSION — EMAIL (Web3Forms) + WHATSAPP
   -------------------------------------------------------------------------- */
function setStatus(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = 'modal-status' + (type ? ` ${type}` : '');
}

function initFormSubmissions() {
  const mainForm = document.getElementById('modal-inquiry-form');
  if (!mainForm) return;

  mainForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const status = document.getElementById('modal-status');
    const name = fieldVal('modal-name');
    const phone = fieldVal('modal-phone');
    const service = fieldVal('modal-service-type');
    const notes = fieldVal('modal-notes');

    const message = `Hello Pravesh & Absolute Travels Team! I would like to inquire about: ${service}.\nName: ${name}\nPhone: ${phone}\nDetails: ${notes}`;
    const whatsappUrl = `https://wa.me/919990445127?text=${encodeURIComponent(message)}`;

    const keyField = mainForm.querySelector('[name="access_key"]');
    const accessKey = keyField ? keyField.value : '';
    const keyIsReal = accessKey && !accessKey.startsWith('REPLACE_');

    // Email capture runs in the background so it never blocks the WhatsApp
    // hand-off (which must fire synchronously to avoid popup blockers).
    if (keyIsReal) {
      setStatus(status, 'Sending your inquiry…', '');
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(mainForm),
        keepalive: true
      })
        .then(r => r.json())
        .then(d => setStatus(
          status,
          d.success ? 'Inquiry received — our team will reach out shortly.' : 'Please also confirm your request on WhatsApp.',
          d.success ? 'success' : 'error'
        ))
        .catch(() => setStatus(status, 'Couldn’t email us — please confirm on WhatsApp.', 'error'));
    }

    // Always open WhatsApp (synchronous → preserves the user gesture).
    window.open(whatsappUrl, '_blank');

    if (keyIsReal) {
      mainForm.reset();
    } else {
      closeModal();
    }
  });
}

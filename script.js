/**
 * ABSOLUTE EVENT & TRAVEL SERVICES — EDITORIAL WHITE THEME SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initHomeHero();
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
   0b. HOME HERO — transparent nav solidifies on scroll.
   Only present on index.html (#home); no-ops elsewhere so visa.html/
   fleet.html's plain sticky navbar is unaffected.
   (No image parallax here on purpose — it needed a scale(1.06) overscale to
   have room to pan, which just made the image look zoomed in for no real
   benefit. Simpler and it looks like what was actually approved.)
   -------------------------------------------------------------------------- */
function initHomeHero() {
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('home');
  if (!navbar || !hero) return;

  let ticking = false;

  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
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
      <li class="doc-checklist-item">
        <i class="fas fa-check"></i> ${doc}
      </li>
    `).join('');
  }
}

/* --------------------------------------------------------------------------
   3. MODAL & INQUIRY POPUP
   -------------------------------------------------------------------------- */
let modalLastTrigger = null;

function openModal(triggerEl) {
  const modal = document.getElementById('inquiry-modal');
  if (!modal) return;
  modalLastTrigger = triggerEl || document.activeElement;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // scroll lock — background no longer scrolls behind the modal
  const firstField = modal.querySelector('input, select, textarea');
  if (firstField) firstField.focus();
}

function closeModal() {
  const modal = document.getElementById('inquiry-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  if (modalLastTrigger && typeof modalLastTrigger.focus === 'function') {
    modalLastTrigger.focus(); // return focus to whatever opened it
  }
  modalLastTrigger = null;
}

function initModalHandlers() {
  const modal = document.getElementById('inquiry-modal');
  const closeBtn = document.querySelector('.modal-close');
  const openBtns = document.querySelectorAll('.trigger-modal');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Every entry point used to open the same modal always defaulted to
      // whichever <option> is first ("Corporate MICE") — "Consult Visa Desk"
      // and every other CTA on the site all landed on the wrong category.
      // data-category on the button (see index/fleet/visa.html) fixes this.
      const category = btn.getAttribute('data-category');
      const select = document.getElementById('modal-service-type');
      if (category && select) select.value = category;
      openModal(btn);
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

  // Basic focus trap: Tab/Shift+Tab cycle within the modal while it's open.
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('active')) return;
      const focusable = modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
}

/* Read a field's trimmed value by id (returns '' if missing/empty). */
function fieldVal(id) {
  const el = document.getElementById(id);
  return el && el.value ? el.value.trim() : '';
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

/**
 * PORTAFOLIO L.L.S — MARÍA ALEJANDRA ACOSTA
 * Interactivity: Navbar, Scroll-Spy, Lightbox Image Viewer, Document PDF Modal, and Microinteractions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Navbar Glassmorphism on Scroll & Scroll Spy
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar__link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const mobileToggle = document.getElementById('navbar-toggle');
  const navMenu = document.getElementById('navbar-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // Scroll-Spy detection
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // ------------------------------------------------------------------------
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Scroll to Top Button
  // ------------------------------------------------------------------------
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('is-visible');
      } else {
        scrollTopBtn.classList.remove('is-visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. Lightbox Modal Gallery (RULE 4 COMPLIANT)
  // Controls strictly float inside image frame, never clipping screen borders
  // ------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Gallery items index
  const galleryItems = [
    {
      src: 'assets/images/infografia-oxford-lls.jpg',
      caption: 'Infographic: Rebecca Oxford’s Language Learning Strategies (Memory, Cognitive & Social)'
    },
    {
      src: 'assets/images/sill-profile-graph.jpg',
      caption: 'SILL Profile & Strategic Averages: Strategy Inventory for Language Learning'
    },
    {
      src: 'assets/images/zimmerman-model-reflection.jpg',
      caption: 'Zimmerman Self-Regulated Learning Model: Guiding Questions & Song Reflection'
    }
  ];

  let currentGalleryIndex = 0;

  function updateLightbox() {
    const item = galleryItems[currentGalleryIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
  }

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightbox();
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox();
  }

  // Event triggers for images
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-index]');
  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = parseInt(trigger.getAttribute('data-lightbox-index'), 10);
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Click outside image stage to close
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Document PDF Modal Viewer
  // ------------------------------------------------------------------------
  const docModal = document.getElementById('doc-modal');
  const docModalTitle = document.getElementById('doc-modal-title');
  const docModalIframe = document.getElementById('doc-modal-iframe');
  const docModalClose = document.getElementById('doc-modal-close');
  const docModalDownload = document.getElementById('doc-modal-download');

  function openDocModal(docUrl, title) {
    if (!docModal || !docModalIframe) return;
    docModalTitle.textContent = title;
    docModalIframe.src = docUrl;
    docModalDownload.href = docUrl;
    docModalDownload.setAttribute('download', title);
    docModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    docModalClose.focus();
  }

  function closeDocModal() {
    if (!docModal) return;
    docModal.classList.remove('is-open');
    if (docModalIframe) docModalIframe.src = '';
    document.body.style.overflow = '';
  }

  // Global listeners for doc viewer buttons
  const docViewBtns = document.querySelectorAll('[data-doc-view]');
  docViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-doc-view');
      const title = btn.getAttribute('data-doc-title') || 'Document Preview';
      openDocModal(url, title);
    });
  });

  if (docModalClose) docModalClose.addEventListener('click', closeDocModal);
  if (docModal) {
    docModal.addEventListener('click', (e) => {
      if (e.target === docModal) {
        closeDocModal();
      }
    });
  }

  // Quick Preview Inline Toggles
  const quickPreviewBtns = document.querySelectorAll('[data-quick-preview-target]');
  quickPreviewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-quick-preview-target');
      const embedWrapper = document.getElementById(targetId);
      if (embedWrapper) {
        const isOpen = embedWrapper.classList.toggle('is-open');
        btn.textContent = isOpen ? '✕ Close Preview' : '👁 Quick Preview';
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Keyboard Accessibility (Escape, Left, Right)
  // ------------------------------------------------------------------------
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
      if (docModal && docModal.classList.contains('is-open')) {
        closeDocModal();
      }
      if (navMenu && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
      }
    } else if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });
});

/**
 * PORTAFOLIO L.L.S | MARÍA ALEJANDRA ACOSTA
 * Interactivity: 3D Tilt Cards, Glassmorphism Navbar, Lightbox Gallery, Document Modal, and In-Page Viewers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Interactive 3D Tilt Effect (FreeFrontend & Apple HIG)
  // ------------------------------------------------------------------------
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !isReducedMotion) {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
      let isHovered = false;

      el.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      el.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
        const rotateY = ((x - centerX) / centerX) * 6;  // Max 6 deg

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 2. Navbar Glassmorphism on Scroll & Scroll-Spy
  // ------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.navbar__item');
  const sections = document.querySelectorAll('section[id], section.hero-section[id]');
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
    const scrollPos = window.scrollY + 160;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentId}`) {
          item.classList.add('active');
        }
      });
    }
  });

  // ------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // ------------------------------------------------------------------------
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. In-Page Inline Document Preview Toggles
  // ------------------------------------------------------------------------
  const inlineToggles = document.querySelectorAll('.inline-toggle-btn');
  inlineToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetViewer = document.getElementById(targetId);
      if (targetViewer) {
        const isHidden = targetViewer.style.display === 'none' || targetViewer.style.display === '';
        targetViewer.style.display = isHidden ? 'block' : 'none';
        const spanText = btn.querySelector('span');
        if (spanText) {
          spanText.textContent = isHidden ? 'Hide Preview' : 'In-Page Preview';
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. Fullscreen PDF Document Modal Viewer
  // ------------------------------------------------------------------------
  const docModal = document.getElementById('doc-modal');
  const docModalTitle = document.getElementById('doc-modal-title');
  const docModalIframe = document.getElementById('doc-modal-iframe');
  const docModalDownload = document.getElementById('doc-modal-download');
  const docModalClose = document.getElementById('doc-modal-close');
  const docTriggers = document.querySelectorAll('.doc-preview-trigger');

  function openDocModal(pdfUrl, title) {
    if (!docModal || !docModalIframe) return;
    docModalTitle.textContent = title;
    docModalIframe.src = pdfUrl;
    docModalDownload.setAttribute('href', pdfUrl);
    docModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDocModal() {
    if (!docModal || !docModalIframe) return;
    docModal.classList.remove('is-open');
    docModalIframe.src = '';
    document.body.style.overflow = '';
  }

  docTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const pdf = btn.getAttribute('data-pdf');
      const title = btn.getAttribute('data-title') || 'Document Viewer';
      openDocModal(pdf, title);
    });
  });

  if (docModalClose) {
    docModalClose.addEventListener('click', closeDocModal);
  }

  if (docModal) {
    docModal.addEventListener('click', (e) => {
      if (e.target === docModal) closeDocModal();
    });
  }

  // ------------------------------------------------------------------------
  // 6. Apple-Style Image Lightbox Gallery
  // ------------------------------------------------------------------------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  const galleryItems = [
    {
      src: 'assets/images/infografia-oxford-lls.jpg',
      caption: 'Infographic: Rebecca Oxford’s Language Learning Strategies'
    },
    {
      src: 'assets/images/sill-profile-graph.jpg',
      caption: 'Diagnostic Breakdown: Strategy Inventory for Language Learning (SILL)'
    },
    {
      src: 'assets/images/zimmerman-model-reflection.jpg',
      caption: 'Zimmerman’s Cyclical Self-Regulation Model Reflection Sheet'
    }
  ];

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    currentGalleryIndex = index;
    const item = galleryItems[index];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function nextGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  function prevGalleryItem() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  }

  document.querySelectorAll('[data-lightbox-index]').forEach(box => {
    box.addEventListener('click', () => {
      const idx = parseInt(box.getAttribute('data-lightbox-index'), 10);
      openLightbox(idx);
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(box.getAttribute('data-lightbox-index'), 10);
        openLightbox(idx);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextGalleryItem);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevGalleryItem);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard Navigation for Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('is-open')) closeLightbox();
      if (docModal && docModal.classList.contains('is-open')) closeDocModal();
    }
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') nextGalleryItem();
      if (e.key === 'ArrowLeft') prevGalleryItem();
    }
  });

  // ------------------------------------------------------------------------
  // 7. Scroll to Top Floating Button
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
});

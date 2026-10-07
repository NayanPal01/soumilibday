/**
 * ==========================================================================
 * SOUMILI ROYAL BIRTHDAY - COMPREHENSIVE CONTROLLER
 * Section 1: Cinematic Full-Screen Video Scroll (0 - 144 Frames)
 * Section 2: Luxury Royal Palace Birthday Experience
 * Includes: Close Cut Buttons, Picture Lightbox, and Smooth Text Scrolling
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 144;
  const FRAME_PATH = (idx) => `frames/frame_${String(idx).padStart(5, '0')}.jpg`;

  // State
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let targetScroll = 0;
  let currentScroll = 0;
  let displayedFrame = -1;
  let naturalWidth = 720;
  let naturalHeight = 1280;

  // DOM Elements - Section 1
  const scrollStage = document.getElementById('scroll-stage');
  const canvas = document.getElementById('visual-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const transitionBtn = document.getElementById('transition-btn');
  const scrollyHint = document.getElementById('scrolly-hint');

  // Editorial Text Blocks
  const blocks = [
    document.getElementById('block-happy'),
    document.getElementById('block-birthday'),
    document.getElementById('block-soumili'),
    document.getElementById('block-grand')
  ];

  // Exact Scroll Ranges (in frame numbers)
  const RANGES = [
    { start: 3,   end: 36 },   // 1. HAPPY (Right)
    { start: 39,  end: 72 },   // 2. BIRTHDAY (Left)
    { start: 75,  end: 108 },  // 3. SOUMILI (Right)
    { start: 111, end: 143 }   // 4. GRAND LOCKUP
  ];

  let currentActiveIndex = -1;

  // DOM Elements - Section 2 Modals & Lightbox
  const openLetterBtn = document.getElementById('open-letter-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const bottomCloseLetterBtn = document.getElementById('bottom-close-letter-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const letterModal = document.getElementById('letter-modal');

  const openSurpriseBtn = document.getElementById('open-surprise-btn');
  const closeSurpriseBtn = document.getElementById('close-surprise-btn');
  const surpriseReveal = document.getElementById('surprise-reveal');

  const imageLightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');

  const wishesTrack = document.getElementById('wishes-track');
  const wishPrev = document.getElementById('wish-prev');
  const wishNext = document.getElementById('wish-next');

  const playlistPlayBtn = document.getElementById('playlist-play-btn');
  const playStateIcon = document.getElementById('play-state-icon');
  const audioPlayerCard = document.querySelector('.audio-player-card');
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const audioProgressBar = document.getElementById('audio-progress');
  const progressContainer = document.getElementById('progress-container');
  const timeDisplay = document.getElementById('time-display');
  const vintageGramophoneWrapper = document.querySelector('.vintage-gramophone-wrapper');
  const trackRows = document.querySelectorAll('.track-row');

  /* ==========================================================================
     1. IMAGE PRELOADER (144 Frames)
     ========================================================================== */
  function preloadImages() {
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        if (i === 0) {
          naturalWidth = img.naturalWidth || 720;
          naturalHeight = img.naturalHeight || 1280;
          resizeCanvas();
          renderFrame(0);
        }
      };
      img.onerror = () => {
        loadedCount++;
      };
    }
  }

  /* ==========================================================================
     2. CANVAS RESIZING (Full Bleed Edge-to-Edge)
     ========================================================================== */
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    displayedFrame = -1;
    drawCurrent();
  }

  /* ==========================================================================
     3. FRAME RENDERING (Zero Black Bars)
     ========================================================================== */
  function renderFrame(frameIndex) {
    const idx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = images[idx];
    if (!img || !img.complete) return;

    const cWidth = canvas.width;
    const cHeight = canvas.height;

    const scale = Math.max(cWidth / naturalWidth, cHeight / naturalHeight);
    const drawW = naturalWidth * scale;
    const drawH = naturalHeight * scale;
    const drawX = (cWidth - drawW) / 2;
    const drawY = (cHeight - drawH) / 2;

    ctx.drawImage(img, Math.round(drawX), Math.round(drawY), Math.round(drawW), Math.round(drawH));
    displayedFrame = idx;
  }

  function drawCurrent() {
    renderFrame(currentScroll);
  }

  /* ==========================================================================
     4. SCROLL & EDITORIAL TEXT CHOREOGRAPHY
     ========================================================================== */
  function updateScrollPosition() {
    if (!scrollStage) return;
    const stageHeight = scrollStage.offsetHeight - window.innerHeight;
    if (stageHeight <= 0) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    const progress = Math.max(0, Math.min(1, scrollY / stageHeight));
    targetScroll = progress * (TOTAL_FRAMES - 1);

    // Initial hint fade out
    if (scrollY > 50 && scrollyHint) {
      scrollyHint.style.opacity = '0';
    } else if (scrollyHint) {
      scrollyHint.style.opacity = '0.7';
    }

    // Transition button fade in near end of video (earlier on mobile for convenience)
    const isMobile = window.innerWidth <= 768;
    const threshold = isMobile ? 0.70 : 0.85;
    if (progress >= threshold && transitionBtn) {
      transitionBtn.classList.add('visible');
    } else if (transitionBtn) {
      transitionBtn.classList.remove('visible');
    }
  }

  function updateEditorialText(frame) {
    let activeIdx = -1;

    for (let i = 0; i < RANGES.length; i++) {
      if (frame >= RANGES[i].start && frame <= RANGES[i].end) {
        activeIdx = i;
        break;
      }
    }

    const isMobile = window.innerWidth <= 768;
    const baseTransform = isMobile ? 'translate(-50%, -50%)' : 'translateY(-50%)';

    if (activeIdx !== currentActiveIndex) {
      // Hide previously active block
      if (currentActiveIndex !== -1 && blocks[currentActiveIndex]) {
        const prev = blocks[currentActiveIndex];
        prev.style.opacity = '0';
        prev.style.visibility = 'hidden';
        prev.style.transform = `${baseTransform} scale(0.92)`;
      }

      // Show newly active block
      if (activeIdx !== -1 && blocks[activeIdx]) {
        const next = blocks[activeIdx];
        next.style.visibility = 'visible';
        next.style.opacity = '1';
        next.style.transform = `${baseTransform} scale(1)`;

        // GSAP flair if available
        if (window.gsap) {
          gsap.fromTo(next,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)' }
          );
        }
      }

      currentActiveIndex = activeIdx;
    }
  }

  /* ==========================================================================
     5. SECTION 2 INTERACTIVE EXPERIENCES & CUT SIGNS (✕)
     ========================================================================== */
  function initPalaceInteractions() {
    // 1. Expandable Letter Modal with Clear Cut Signs
    if (openLetterBtn && letterModal) {
      const openModal = () => {
        letterModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        letterModal.classList.add('hidden');
        document.body.style.overflow = '';
      };

      openLetterBtn.addEventListener('click', openModal);
      if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
      if (bottomCloseLetterBtn) bottomCloseLetterBtn.addEventListener('click', closeModal);
      if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    }

    // 2. Broad Picture Full-Screen Lightbox with Clear Cut Sign
    const zoomableElements = document.querySelectorAll('.zoomable-image');
    zoomableElements.forEach((el) => {
      el.addEventListener('click', () => {
        const img = el.querySelector('img');
        if (!img || !imageLightbox) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Enlarged picture';
        const caption = img.getAttribute('data-caption') || img.alt || '';
        if (lightboxCaption) lightboxCaption.textContent = caption;

        imageLightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      if (imageLightbox) {
        imageLightbox.classList.add('hidden');
        document.body.style.overflow = '';
      }
    };

    if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // 3. Floating Crown Navigation Menu (Mobile)
    const crownFab = document.getElementById('crown-fab');
    const crownMenu = document.getElementById('crown-menu');
    let crownMenuOpen = false;
    let crownBackdrop = null;

    function toggleCrownMenu() {
      crownMenuOpen = !crownMenuOpen;
      if (crownFab) crownFab.classList.toggle('open', crownMenuOpen);
      if (crownMenu) crownMenu.classList.toggle('open', crownMenuOpen);

      if (crownMenuOpen) {
        // Create backdrop
        if (!crownBackdrop) {
          crownBackdrop = document.createElement('div');
          crownBackdrop.className = 'crown-menu-backdrop';
          document.body.appendChild(crownBackdrop);
          crownBackdrop.addEventListener('click', toggleCrownMenu);
        }
        requestAnimationFrame(() => {
          crownBackdrop.classList.add('open');
        });
      } else {
        if (crownBackdrop) {
          crownBackdrop.classList.remove('open');
        }
      }
    }

    if (crownFab) {
      crownFab.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCrownMenu();
      });
    }

    // Crown menu item click → close menu & smooth scroll
    document.querySelectorAll('[data-crown-nav]').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          if (crownMenuOpen) toggleCrownMenu();
          setTimeout(() => {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
      });
    });

    // 4. Global Keyboard Escape Key Closes Any Open Modal / Picture
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (letterModal && !letterModal.classList.contains('hidden')) {
          letterModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
        if (imageLightbox && !imageLightbox.classList.contains('hidden')) {
          imageLightbox.classList.add('hidden');
          document.body.style.overflow = '';
        }
      }
    });

    // 5. Birthday Wishes Carousel
    if (wishesTrack && wishPrev && wishNext) {
      wishPrev.addEventListener('click', () => {
        wishesTrack.scrollBy({ left: -240, behavior: 'smooth' });
      });
      wishNext.addEventListener('click', () => {
        wishesTrack.scrollBy({ left: 240, behavior: 'smooth' });
      });
    }

    // 6. Interactive Playlist & Equalizer (Real HTML5 Audio Engine)
    const royalAudio = new Audio();
    let currentTrackIdx = 0;

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function loadTrack(index, autoPlay = false) {
      const rows = Array.from(document.querySelectorAll('.track-row'));
      if (!rows.length || index < 0 || index >= rows.length) return;

      currentTrackIdx = index;
      rows.forEach((r, idx) => {
        r.classList.toggle('active', idx === index);
      });

      const selected = rows[index];
      const src = selected.getAttribute('data-src');
      const title = selected.getAttribute('data-title') || 'Song';
      const artist = selected.getAttribute('data-artist') || 'Royal Melody';

      if (trackTitle) trackTitle.textContent = title;
      if (trackArtist) trackArtist.textContent = artist;
      if (audioProgressBar) audioProgressBar.style.width = '0%';
      if (timeDisplay) timeDisplay.textContent = '0:00 / 0:00';

      if (src) {
        royalAudio.src = src;
        royalAudio.load();
      }

      if (autoPlay) {
        royalAudio.play().catch((err) => {
          console.log('Audio autoplay awaiting user gesture:', err);
        });
      }
    }

    // Preload track 0 metadata
    const initialRows = document.querySelectorAll('.track-row');
    if (initialRows.length > 0) {
      loadTrack(0, false);
    }

    if (playlistPlayBtn) {
      playlistPlayBtn.addEventListener('click', () => {
        if (!royalAudio.src) {
          loadTrack(0, true);
          return;
        }

        if (royalAudio.paused) {
          royalAudio.play().catch((err) => console.log('Playback error:', err));
        } else {
          royalAudio.pause();
        }
      });
    }

    royalAudio.addEventListener('play', () => {
      if (playStateIcon) playStateIcon.textContent = '⏸';
      if (audioPlayerCard) audioPlayerCard.classList.add('playing');
      if (vintageGramophoneWrapper) vintageGramophoneWrapper.classList.add('playing');
    });

    royalAudio.addEventListener('pause', () => {
      if (playStateIcon) playStateIcon.textContent = '▶';
      if (audioPlayerCard) audioPlayerCard.classList.remove('playing');
      if (vintageGramophoneWrapper) vintageGramophoneWrapper.classList.remove('playing');
    });

    royalAudio.addEventListener('timeupdate', () => {
      if (royalAudio.duration && !isNaN(royalAudio.duration)) {
        const pct = (royalAudio.currentTime / royalAudio.duration) * 100;
        if (audioProgressBar) audioProgressBar.style.width = `${pct}%`;
        if (timeDisplay) {
          timeDisplay.textContent = `${formatTime(royalAudio.currentTime)} / ${formatTime(royalAudio.duration)}`;
        }
      }
    });

    royalAudio.addEventListener('ended', () => {
      const rows = document.querySelectorAll('.track-row');
      const nextIdx = (currentTrackIdx + 1) % rows.length;
      loadTrack(nextIdx, true);
    });

    if (progressContainer) {
      progressContainer.addEventListener('click', (e) => {
        if (!royalAudio.duration || isNaN(royalAudio.duration)) return;
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const frac = Math.max(0, Math.min(1, clickX / rect.width));
        royalAudio.currentTime = frac * royalAudio.duration;
      });
    }

    document.querySelectorAll('.track-row').forEach((row, idx) => {
      row.addEventListener('click', () => {
        loadTrack(idx, true);
      });
    });
  }

  /* ==========================================================================
     6. CONTINUOUS RENDER LOOP
     ========================================================================== */
  function animationLoop() {
    const diff = targetScroll - currentScroll;
    if (Math.abs(diff) > 0.001) {
      currentScroll += diff * 0.16;
      const rounded = Math.round(currentScroll);
      if (rounded !== displayedFrame) {
        renderFrame(rounded);
      }
      updateEditorialText(currentScroll);
    } else if (currentScroll !== targetScroll) {
      currentScroll = targetScroll;
      renderFrame(Math.round(currentScroll));
      updateEditorialText(currentScroll);
    }

    requestAnimationFrame(animationLoop);
  }

  /* ==========================================================================
     7. INITIALIZATION
     ========================================================================== */
  function init() {
    resizeCanvas();
    preloadImages();
    initPalaceInteractions();

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    window.addEventListener('resize', () => {
      resizeCanvas();
      updateScrollPosition();
    });

    updateScrollPosition();
    requestAnimationFrame(animationLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

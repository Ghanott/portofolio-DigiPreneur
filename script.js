(() => {
  const VIEWS = ['beranda', 'tentang', 'keahlian', 'portofolio'];

  const navTriggers = document.querySelectorAll('[data-nav]');
  const navTabs = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function setActiveView(target, updateHash = true) {
    if (!VIEWS.includes(target)) return;

    VIEWS.forEach((name) => {
      const panel = document.getElementById(`view-${name}`);
      if (!panel) return;
      const isCurrent = name === target;
      panel.hidden = !isCurrent;
      panel.classList.toggle('is-active', isCurrent);
    });

    navTabs.forEach((tab) => {
      const active = tab.dataset.nav === target;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    mobileLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.nav === target);
    });

    if (mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      menuToggle?.setAttribute('aria-expanded', 'false');
    }

    if (updateHash) {
      history.replaceState(null, '', `#${target}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTriggers.forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = el.dataset.nav;
      if (!target) return;
      event.preventDefault();
      setActiveView(target);
    });
  });

  menuToggle?.addEventListener('click', () => {
    if (!mobileNav) return;
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuToggle.setAttribute('aria-expanded', String(willOpen));
  });

  const initialHash = window.location.hash.replace('#', '');
  if (VIEWS.includes(initialHash)) {
    setActiveView(initialHash, false);
  }

  // Skills filter, row highlight & interactive inspector
  const SKILL_DETAILS = {
    laravel: {
      badge: 'Web Development · 86%',
      title: 'Laravel (PHP & Fullstack Web)',
      note: 'Mengembangkan aplikasi web end-to-end dengan pola MVC, validasi request yang aman, proteksi CSRF bawaan, serta relasi basis data menggunakan Eloquent ORM.',
      tools: ['PHP 8', 'Eloquent ORM', 'Blade', 'Laravel Sanctum', 'MySQL']
    },
    react: {
      badge: 'Web Development · 84%',
      title: 'React (Component & Modern UI)',
      note: 'Merancang antarmuka modular yang cepat dengan komponen reusable, custom hooks, pengelolaan state, dan konsumsi REST API secara efisien.',
      tools: ['React Hooks', 'JSX', 'State Management', 'REST API', 'Vite']
    },
    frontend: {
      badge: 'Web Development · 90%',
      title: 'HTML5, CSS3, JavaScript & Git',
      note: 'Fondasi frontend yang kuat dengan markup semantik, CSS Grid/Flexbox responsif, interaksi DOM murni, dan kolaborasi kode rapi di GitHub.',
      tools: ['HTML5', 'CSS3 / Tailwind', 'JavaScript ES6', 'Git & GitHub', 'Vercel']
    },
    owasp: {
      badge: 'Cyber Security · 90%',
      title: 'Web Application Security (OWASP)',
      note: 'Memahami pola serangan umum OWASP Top 10 serta cara pencegahannya pada aplikasi web, termasuk sanitasi output, prepared statements, dan kontrol akses.',
      tools: ['OWASP Top 10', 'XSS & CSRF Defense', 'SQLi Prevention', 'Security Headers']
    },
    network: {
      badge: 'Cyber Security · 78%',
      title: 'Network & Linux Fundamentals',
      note: 'Mengelola lingkungan server Linux, hak akses berkas, analisis paket jaringan dasar, serta konfigurasi layanan web agar minim celah konfigurasi.',
      tools: ['Linux CLI', 'TCP/IP & HTTP', 'SSH & Permissions', 'Firewall Basics']
    },
    testing: {
      badge: 'Cyber Security · 80%',
      title: 'Security Testing & Reconnaissance',
      note: 'Melakukan pemetaan permukaan serang dasar, inspeksi request/response HTTP, dan latihan eksplorasi celah secara etis pada lab Bug Bounty dan CTF.',
      tools: ['Burp Suite', 'Nmap', 'Chrome DevTools', 'CTF Web Challenges']
    }
  };

  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillsMatrix = document.getElementById('skills-matrix');
  const skillPanels = document.querySelectorAll('.skill-panel');
  const skillRows = document.querySelectorAll('.skill-row');
  const skillInspector = document.getElementById('skill-inspector');
  const inspectorBadge = document.getElementById('inspector-badge');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorNote = document.getElementById('inspector-note');
  const inspectorTools = document.getElementById('inspector-tools');

  function selectSkillRow(row) {
    if (!row) return;
    skillRows.forEach((r) => r.classList.remove('is-highlighted'));
    row.classList.add('is-highlighted');

    const key = row.dataset.skillKey || 'laravel';
    const data = SKILL_DETAILS[key];
    if (!data || !skillInspector) return;

    skillInspector.classList.add('is-updating');
    setTimeout(() => {
      if (inspectorBadge) inspectorBadge.textContent = data.badge;
      if (inspectorTitle) inspectorTitle.textContent = data.title;
      if (inspectorNote) inspectorNote.textContent = data.note;
      if (inspectorTools) {
        inspectorTools.replaceChildren(
          ...data.tools.map((tool) => {
            const chip = document.createElement('span');
            chip.textContent = tool;
            return chip;
          })
        );
      }
      skillInspector.classList.remove('is-updating');
    }, 100);
  }

  function applySkillFilter(filter) {
    filterButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.filter === filter));
    let visibleCount = 0;
    let firstVisibleRow = null;

    skillPanels.forEach((panel) => {
      const match = filter === 'all' || panel.dataset.category === filter;
      panel.hidden = !match;
      if (match) {
        visibleCount += 1;
        if (!firstVisibleRow) firstVisibleRow = panel.querySelector('.skill-row');
      }
    });

    skillsMatrix?.classList.toggle('is-single', visibleCount === 1);

    const currentHighlighted = document.querySelector('.skill-row.is-highlighted');
    const isHighlightedVisible = currentHighlighted && !currentHighlighted.closest('.skill-panel')?.hidden;
    if (!isHighlightedVisible && firstVisibleRow) {
      selectSkillRow(firstVisibleRow);
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applySkillFilter(btn.dataset.filter || 'all');
    });
  });

  skillRows.forEach((row) => {
    row.addEventListener('click', () => {
      selectSkillRow(row);
    });
  });

  // Hero interactive focus switcher
  const FOCUS_COPY = {
    all: {
      summary:
        'Mahasiswa IT yang senang mengeksplorasi pengembangan aplikasi web modern dan keamanan siber, mulai dari merancang antarmuka yang rapi hingga memahami cara kerja keamanan sistem.',
      status: 'Mahasiswa IT · Semester 5',
      waText: 'Halo Ghani, saya melihat halaman profil Anda dan ingin terhubung.',
      waLabel: 'Kirim Pesan WhatsApp'
    },
    web: {
      summary:
        'Berfokus pada pengembangan aplikasi web modern menggunakan Laravel dan React, serta fondasi HTML, CSS, dan JavaScript yang rapi dan responsif.',
      status: 'Web Development · Laravel & React',
      waText: 'Halo Ghani, saya tertarik berdiskusi seputar Web Development.',
      waLabel: 'Diskusi Web Dev via WA'
    },
    security: {
      summary:
        'Aktif mempelajari keamanan aplikasi web, pengujian kerentanan OWASP Top 10, latihan Bug Bounty, serta kompetisi Capture The Flag untuk membangun sistem yang lebih tangguh.',
      status: 'Cyber Security · Bug Bounty & CTF',
      waText: 'Halo Ghani, saya tertarik berdiskusi seputar Cyber Security.',
      waLabel: 'Diskusi Security via WA'
    }
  };

  const focusTabs = document.querySelectorAll('.focus-tab');
  const heroSummary = document.getElementById('hero-summary-text');
  const portraitStatus = document.getElementById('portrait-status');
  const heroWaCta = document.getElementById('hero-wa-cta');
  const heroWaLabel = document.getElementById('hero-wa-label');
  const topicPills = document.querySelectorAll('.topic-pill');

  focusTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.focus || 'all';
      const content = FOCUS_COPY[key] || FOCUS_COPY.all;

      focusTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });

      if (heroSummary) {
        heroSummary.classList.add('is-updating');
        setTimeout(() => {
          heroSummary.textContent = content.summary;
          heroSummary.classList.remove('is-updating');
        }, 120);
      }

      if (portraitStatus) portraitStatus.textContent = content.status;
      if (heroWaCta) {
        heroWaCta.href = `https://wa.me/6285163019551?text=${encodeURIComponent(content.waText)}`;
      }
      if (heroWaLabel) heroWaLabel.textContent = content.waLabel;

      topicPills.forEach((pill) => {
        const isAll = key === 'all';
        const match = pill.dataset.topic === key;
        pill.classList.toggle('is-matched', !isAll && match);
        pill.classList.toggle('is-dimmed', !isAll && !match);
      });
    });
  });

  topicPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const dest = pill.dataset.goto;
      const skillFilter = pill.dataset.skillFilter;
      if (skillFilter) applySkillFilter(skillFilter);
      if (dest) setActiveView(dest);
    });
  });

  // Portrait info overlay toggle & subtle 3D tilt
  const portraitCard = document.getElementById('portrait-card');
  const portraitOverlay = document.getElementById('portrait-overlay');
  const portraitToggle = document.getElementById('portrait-toggle');

  portraitToggle?.addEventListener('click', () => {
    if (!portraitOverlay) return;
    const willShow = portraitOverlay.hidden;
    portraitOverlay.hidden = !willShow;
    portraitToggle.setAttribute('aria-expanded', String(willShow));
    portraitToggle.textContent = willShow ? 'Tutup Info' : 'Info Singkat';
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (portraitCard && !prefersReducedMotion && hasFinePointer) {
    portraitCard.addEventListener('mousemove', (event) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portraitCard.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
      portraitCard.style.setProperty('--ry', `${(x * 6).toFixed(2)}deg`);
    });

    portraitCard.addEventListener('mouseleave', () => {
      portraitCard.style.setProperty('--rx', '0deg');
      portraitCard.style.setProperty('--ry', '0deg');
    });
  }

  // About page interactive interest explorer, surface tabs, & timeline accordion
  const INTEREST_NOTES = {
    web: {
      title: 'Web Development',
      copy: 'Membangun aplikasi web dengan struktur kode yang rapi menggunakan Laravel untuk sisi backend serta React untuk antarmuka yang dinamis dan responsif.'
    },
    security: {
      title: 'Cyber Security',
      copy: 'Mempelajari cara kerja sistem, keamanan aplikasi web, serta langkah mitigasi risiko terhadap kerentanan umum seperti XSS, SQL Injection, dan salah konfigurasi akses.'
    },
    bounty: {
      title: 'Bug Bounty',
      copy: 'Melatih ketelitian dalam membaca alur aplikasi dan mengidentifikasi celah keamanan secara etis pada ruang lingkup program yang diizinkan.'
    },
    ctf: {
      title: 'Capture The Flag (CTF)',
      copy: 'Mengasah logika pemecahan masalah melalui tantangan keamanan web, kriptografi dasar, dan analisis sistem secara terstruktur.'
    }
  };

  const interestPills = document.querySelectorAll('.interest-pill');
  const interestDetailCard = document.querySelector('.interest-detail-card');
  const interestDetailTitle = document.getElementById('interest-detail-title');
  const interestDetailCopy = document.getElementById('interest-detail-copy');

  interestPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.interest || 'web';
      const item = INTEREST_NOTES[key] || INTEREST_NOTES.web;

      interestPills.forEach((p) => {
        const active = p === pill;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-selected', String(active));
      });

      if (interestDetailCard && interestDetailTitle && interestDetailCopy) {
        interestDetailCard.classList.add('is-updating');
        setTimeout(() => {
          interestDetailTitle.textContent = item.title;
          interestDetailCopy.textContent = item.copy;
          interestDetailCard.classList.remove('is-updating');
        }, 110);
      }
    });
  });

  const surfaceTabs = document.querySelectorAll('.surface-tab');
  const aboutPanels = {
    education: document.getElementById('about-panel-education'),
    approach: document.getElementById('about-panel-approach')
  };

  surfaceTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.aboutTab || 'education';
      surfaceTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      Object.entries(aboutPanels).forEach(([key, panel]) => {
        if (panel) panel.hidden = key !== target;
      });
    });
  });

  document.querySelectorAll('.timeline-card').forEach((card) => {
    card.addEventListener('click', () => {
      const willOpen = !card.classList.contains('is-open');
      card.classList.toggle('is-open', willOpen);
      card.setAttribute('aria-expanded', String(willOpen));
    });
  });

  // Portfolio category filter & interactive preview modal
  const portFilterButtons = document.querySelectorAll('.port-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const portfolioGrid = document.getElementById('portfolio-grid');

  portFilterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.portFilter || 'all';
      portFilterButtons.forEach((b) => b.classList.toggle('is-active', b === btn));

      let gridVisibleCount = 0;
      portfolioItems.forEach((item) => {
        const match = filter === 'all' || item.dataset.portCat === filter;
        item.hidden = !match;
        if (match && item.parentElement === portfolioGrid) {
          gridVisibleCount += 1;
        }
      });

      portfolioGrid?.classList.toggle('is-compact', gridVisibleCount > 0 && gridVisibleCount < 3);
    });
  });

  const modal = document.getElementById('project-modal');
  const modalCat = document.getElementById('modal-cat');
  const modalPreview = document.getElementById('modal-preview');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalStack = document.getElementById('modal-stack');
  const modalExtLink = document.getElementById('modal-ext-link');
  const modalClose = document.getElementById('modal-close');

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  document.querySelectorAll('[data-project]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (!modal) return;
      modalTitle.textContent = trigger.dataset.project || '';
      modalCat.textContent = trigger.dataset.projectCat || '';
      modalDesc.textContent = trigger.dataset.projectDesc || '';

      const imgSrc = trigger.dataset.projectImg;
      if (modalPreview && modalImage) {
        if (imgSrc) {
          modalImage.src = imgSrc;
          modalImage.alt = `Pratinjau ${trigger.dataset.project || 'karya'}`;
          modalPreview.hidden = false;
        } else {
          modalImage.removeAttribute('src');
          modalPreview.hidden = true;
        }
      }

      if (modalStack) {
        const stackItems = (trigger.dataset.projectStack || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        modalStack.replaceChildren(
          ...stackItems.map((label) => {
            const chip = document.createElement('span');
            chip.textContent = label;
            return chip;
          })
        );
      }

      if (modalExtLink) {
        const extUrl = trigger.dataset.projectUrl;
        if (extUrl) {
          modalExtLink.href = extUrl;
          modalExtLink.textContent = trigger.dataset.projectUrlLabel || 'Buka Tautan';
          modalExtLink.hidden = false;
        } else {
          modalExtLink.hidden = true;
        }
      }

      modal.hidden = false;
      modalClose?.focus();
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.hidden) {
      closeModal();
    }
  });
})();

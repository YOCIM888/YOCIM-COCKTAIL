/* =========================================================
   YOCIM · 个人特色调酒单
   交互：搜索 / 筛选 / 详情弹窗 / 滚动动效
   ========================================================= */

(function () {
  'use strict';

  const DRINKS = window.DRINKS || [];
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const LANG = window.SITE_LANG === 'en' ? 'en' : 'zh';

  const I18N = {
    zh: {
      filters: [
        { key: 'all', label: '全部' },
        { key: '长饮', label: '长饮' },
        { key: '短饮', label: '短饮' },
        { key: '原创', label: '原创' },
        { key: '经典', label: '经典' },
        { key: '实验', label: '实验' },
        { key: '慎喝', label: '慎喝' }
      ],
      result: (shown, total) => '显示 ' + shown + ' 款 / 共 ' + total + ' 款',
      cardAria: (name) => '查看《' + name + '》的完整配方',
      count: (n) => n + ' 项材料'
    },
    en: {
      filters: [
        { key: 'all', label: 'All' },
        { key: 'Long', label: 'Long' },
        { key: 'Short', label: 'Short' },
        { key: 'Original', label: 'Original' },
        { key: 'Classic', label: 'Classic' },
        { key: 'Experiment', label: 'Experiment' },
        { key: 'Caution', label: 'Caution' }
      ],
      result: (shown, total) => 'Showing ' + shown + ' of ' + total + ' drinks',
      cardAria: (name) => 'View the full recipe for ' + name,
      count: (n) => n + (n === 1 ? ' ingredient' : ' ingredients')
    }
  };

  const T = I18N[LANG];

  function isCaution(tag) {
    return tag === '慎喝' || tag === 'Caution';
  }

  const state = {
    filter: 'all',
    query: ''
  };

  let lastFocused = null;
  let currentIndex = 0;

  const grid = $('#menuGrid');
  const chipsEl = $('#filterChips');
  const resultCount = $('#resultCount');
  const emptyState = $('#emptyState');
  const searchInput = $('#searchInput');
  const header = $('#siteHeader');
  const modal = $('#modal');
  const modalPanel = $('.modal-panel', modal);
  const modalBody = $('.modal-body', modal);

  /* ---------- Render ---------- */

  function tagMarkup(tag) {
    const cls = isCaution(tag) ? 'tag tag-caution' : 'tag';
    return '<span class="' + cls + '">' + tag + '</span>';
  }

  function cardMarkup(drink, index) {
    const tags = drink.tags.map(tagMarkup).join('');
    return (
      '<article class="card" tabindex="0" role="button" data-id="' + drink.id + '"' +
      ' aria-label="' + T.cardAria(drink.name) + '"' +
      ' style="--accent:' + drink.accent + ';--accent2:' + drink.accent2 + ';--card-delay:' + Math.min(index * 45, 400) + 'ms">' +
        '<span class="card-glow" aria-hidden="true"></span>' +
        '<span class="card-watermark" aria-hidden="true">' + drink.num + '</span>' +
        '<div class="card-top">' +
          '<span class="card-no">' + drink.num + '</span>' +
          '<span class="card-tags">' + tags + '</span>' +
        '</div>' +
        '<p class="card-en">' + drink.en + '</p>' +
        '<h3 class="card-name">' + drink.name + '</h3>' +
        '<p class="card-type">' + drink.type + '</p>' +
        '<p class="card-brief">' + drink.brief + '</p>' +
        '<div class="card-foot">' +
          '<span class="glass">' + drink.glass + '</span>' +
          '<span class="card-arrow" aria-hidden="true">→</span>' +
        '</div>' +
      '</article>'
    );
  }

  function matches(drink) {
    if (state.filter !== 'all' && !drink.tags.includes(state.filter)) return false;
    if (!state.query) return true;
    const haystack = [
      drink.name,
      drink.en,
      drink.type,
      drink.glass,
      drink.brief,
      drink.method,
      drink.notes,
      drink.tags.join(' ')
    ].concat(drink.ingredients.map((i) => i[0] + ' ' + i[1] + ' ' + i[2])).join(' ').toLowerCase();
    return state.query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((term) => haystack.indexOf(term) > -1);
  }

  function render() {
    const list = DRINKS.filter(matches);
    grid.innerHTML = list.map(cardMarkup).join('');
    emptyState.hidden = list.length > 0;
    resultCount.textContent = T.result(list.length, DRINKS.length);
  }

  function renderChips() {
    chipsEl.innerHTML = T.filters.map(function (f) {
      const count = f.key === 'all' ? DRINKS.length : DRINKS.filter((d) => d.tags.includes(f.key)).length;
      return (
        '<button type="button" class="chip' + (state.filter === f.key ? ' active' : '') + '"' +
        ' data-filter="' + f.key + '">' + f.label + '<span>' + count + '</span></button>'
      );
    }).join('');
  }

  function setFilter(key) {
    state.filter = key;
    $$('.chip', chipsEl).forEach(function (chip) {
      chip.classList.toggle('active', chip.dataset.filter === key);
    });
    render();
  }

  /* ---------- Modal ---------- */

  function modalTagMarkup(tag) {
    return '<span class="tag' + (isCaution(tag) ? ' tag-caution' : '') + '">' + tag + '</span>';
  }

  function fillModal(drink) {
    modalPanel.style.setProperty('--accent', drink.accent);
    modalPanel.style.setProperty('--accent2', drink.accent2);
    $('#modalNo').textContent = 'NO. ' + drink.num;
    $('#modalTags').innerHTML = drink.tags.map(modalTagMarkup).join('');
    $('#modalEn').textContent = drink.en;
    $('#modalTitle').textContent = drink.name;
    $('#modalType').textContent = drink.type;
    $('#modalBrief').textContent = drink.brief;
    $('#modalGlass').textContent = drink.glass;
    $('#modalCount').textContent = T.count(drink.ingredients.length);
    $('#modalWatermark').textContent = drink.num;

    $('#modalIngredients').innerHTML = drink.ingredients.map(function (item) {
      return (
        '<tr><td>' + item[0] + '</td><td>' + item[1] + '</td><td>' + (item[2] || '—') + '</td></tr>'
      );
    }).join('');

    $('#modalMethod').textContent = drink.method;
    $('#modalNotes').textContent = drink.notes;
    modalBody.scrollTop = 0;
  }

  function openModal(id, trigger) {
    const index = DRINKS.findIndex((d) => d.id === id);
    if (index < 0) return;
    currentIndex = index;
    lastFocused = trigger || document.activeElement;
    fillModal(DRINKS[index]);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('.cursor-glow').style.opacity = '0';
    setTimeout(function () {
      $('.modal-close', modal).focus();
    }, 60);
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    $('.cursor-glow').style.opacity = '';
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }

  function stepModal(direction) {
    currentIndex = (currentIndex + direction + DRINKS.length) % DRINKS.length;
    fillModal(DRINKS[currentIndex]);
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
    const focusables = $$('button, a[href], input, [tabindex]:not([tabindex="-1"])', modal).filter(function (el) {
      return !el.disabled && el.offsetParent !== null;
    });
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------- Events ---------- */

  grid.addEventListener('click', function (event) {
    const card = event.target.closest('.card');
    if (card) openModal(card.dataset.id, card);
  });

  grid.addEventListener('keydown', function (event) {
    const card = event.target.closest('.card');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(card.dataset.id, card);
    }
  });

  chipsEl.addEventListener('click', function (event) {
    const chip = event.target.closest('.chip');
    if (chip) setFilter(chip.dataset.filter);
  });

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value.trim();
    render();
  });

  $('#resetFilter').addEventListener('click', function () {
    state.filter = 'all';
    state.query = '';
    searchInput.value = '';
    $$('.chip', chipsEl).forEach(function (chip) {
      chip.classList.toggle('active', chip.dataset.filter === 'all');
    });
    render();
    searchInput.focus();
  });

  modal.addEventListener('click', function (event) {
    if (event.target.closest('[data-close]')) closeModal();
  });

  $('#prevDrink').addEventListener('click', function () { stepModal(-1); });
  $('#nextDrink').addEventListener('click', function () { stepModal(1); });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (modal.classList.contains('open')) {
        closeModal();
      } else if (document.activeElement === searchInput && searchInput.value) {
        searchInput.value = '';
        state.query = '';
        render();
      }
    }
    if (modal.classList.contains('open')) {
      if (event.key === 'ArrowLeft') stepModal(-1);
      if (event.key === 'ArrowRight') stepModal(1);
      trapFocus(event);
    }
    if (event.key === '/' && document.activeElement !== searchInput && !modal.classList.contains('open')) {
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        event.preventDefault();
        searchInput.focus();
      }
    }
  });

  /* ---------- Header / cursor / parallax ---------- */

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const glow = $('.cursor-glow');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer) {
    let raf = null;
    let mx = 0;
    let my = 0;
    document.addEventListener('mousemove', function (event) {
      mx = event.clientX;
      my = event.clientY;
      if (!modal.classList.contains('open')) glow.style.opacity = '1';
      if (raf) return;
      raf = requestAnimationFrame(function () {
        glow.style.transform = 'translate(' + (mx - 320) + 'px,' + (my - 320) + 'px)';
        raf = null;
      });
    });
    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });
  }

  // 轻微视差：让封面球体跟随鼠标
  const hero = $('.hero');
  const heroArt = $('.hero-art');
  if (hero && heroArt && finePointer) {
    let hRaf = null;
    hero.addEventListener('mousemove', function (event) {
      const rect = hero.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      if (hRaf) return;
      hRaf = requestAnimationFrame(function () {
        heroArt.style.transform = 'translate(' + (dx * 18).toFixed(1) + 'px,' + (dy * 14).toFixed(1) + 'px)';
        hRaf = null;
      });
    });
    hero.addEventListener('mouseleave', function () {
      heroArt.style.transform = '';
    });
  }

  /* ---------- Scroll reveal ---------- */

  const revealTargets = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', Math.min((i % 5) * 70, 280) + 'ms');
      io.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Init ---------- */

  renderChips();
  render();
})();

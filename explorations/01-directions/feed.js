/* Shared behavior for all three directions: place filter, sort, Pack, Follow, Show more. */
(function () {
  const posts = window.HOWL_POSTS;
  const LONG = 280;

  const ICONS = {
    home: '<path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z"/>',
    places: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    alerts: '<path d="M6 17v-6a6 6 0 0112 0v6l2 2H4z"/><path d="M10 21h4"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    reply: '<path d="M21 12a8 8 0 01-11.5 7.2L4 21l1.8-5A8 8 0 1121 12z"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/>',
    paw: '<ellipse cx="6.5" cy="10.5" rx="2" ry="2.6"/><ellipse cx="10" cy="6.5" rx="2" ry="2.8"/><ellipse cx="14" cy="6.5" rx="2" ry="2.8"/><ellipse cx="17.5" cy="10.5" rx="2" ry="2.6"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.8 1.6 2.3 3 1.9 1-.3 1.6-.5 2.5-.5s1.5.2 2.5.5c1.4.4 3-.1 3-1.9C17.5 15 15 12 12 12z"/>',
  };

  const STOP = ['of', 'the'];

  function icon(name) {
    const fill = name === 'paw';
    return '<svg class="icon' + (fill ? ' icon-fill' : '') + '" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function initials(name) {
    return name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  function placeInitials(name) {
    const words = name.split(/[ -]+/).filter(function (w) { return STOP.indexOf(w.toLowerCase()) === -1; });
    if (words.length === 1) return words[0].slice(0, 2);
    return words.map(function (w) { return w[0].toUpperCase(); }).join('').slice(0, 3);
  }

  function placeList() {
    const counts = {};
    posts.forEach(function (p) { if (p.location) counts[p.location] = (counts[p.location] || 0) + 1; });
    const list = Object.keys(counts).map(function (n) {
      return { name: n, label: n, count: counts[n], initials: placeInitials(n) };
    }).sort(function (a, b) { return b.count - a.count || a.name.localeCompare(b.name); });
    list.unshift({ name: '', label: 'All', count: posts.length, initials: 'All' });
    return list;
  }

  function init(cfg) {
    const feed = document.querySelector('[data-feed]');
    const status = document.querySelector('[data-status]');
    const state = { place: '', sort: 'latest', packed: new Set(), followed: new Set() };
    const places = placeList();

    const h = {
      icon: icon,
      esc: esc,
      initials: initials,
      reply: function (p) {
        return '<button class="act reply" type="button">' + icon('reply') + '<span class="sr-only">Replies</span><span>' + p.replies + '</span></button>';
      },
      pack: function (p) {
        const on = state.packed.has(p.id);
        return '<button class="act pack" type="button" data-pack="' + p.id + '" aria-pressed="' + on + '">' + icon('paw') + '<span class="sr-only">Pack</span><span data-count>' + (p.packs + (on ? 1 : 0)) + '</span></button>';
      },
      follow: function (p) {
        const on = state.followed.has(p.author);
        return '<button class="follow" type="button" data-follow="' + esc(p.author) + '" aria-pressed="' + on + '">' + (on ? 'Following' : 'Follow') + '</button>';
      },
      text: function (p, cls) {
        const long = p.text.length > LONG;
        return '<p class="text' + (cls ? ' ' + cls : '') + (long ? ' is-clamped' : '') + '">' + esc(p.text) + '</p>' +
          (long ? '<button class="more" type="button" data-more aria-expanded="false">Show more</button>' : '');
      },
      isLong: function (p) { return p.text.length > LONG; },
    };

    function visible() {
      let list = posts.filter(function (p) { return !state.place || p.location === state.place; });
      if (state.sort === 'loudest') list = list.slice().sort(function (a, b) { return b.packs - a.packs; });
      return list;
    }

    function render() {
      const list = visible();
      feed.innerHTML = list.length
        ? list.map(function (p) { return cfg.post(p, h); }).join('')
        : '<p class="empty">No posts from ' + esc(state.place) + ' yet. <button type="button" class="btn-link" data-place="">Show all posts</button></p>';
      sync();
      status.textContent = 'Showing ' + list.length + ' post' + (list.length === 1 ? '' : 's') + (state.place ? ' from ' + state.place : '');
    }

    function sync() {
      document.querySelectorAll('[data-place]').forEach(function (el) {
        el.setAttribute('aria-pressed', String(el.dataset.place === state.place));
      });
      document.querySelectorAll('[data-sort]').forEach(function (el) {
        el.setAttribute('aria-pressed', String(el.dataset.sort === state.sort));
      });
    }

    document.querySelectorAll('[data-icon]').forEach(function (el) {
      el.outerHTML = icon(el.dataset.icon);
    });

    document.querySelectorAll('[data-places]').forEach(function (el) {
      const build = cfg.places[el.dataset.places];
      el.innerHTML = places.map(function (pl) { return build(pl, h); }).join('');
    });

    document.addEventListener('click', function (e) {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.pack) {
        const id = Number(t.dataset.pack);
        const p = posts.filter(function (x) { return x.id === id; })[0];
        const on = !state.packed.has(id);
        if (on) state.packed.add(id); else state.packed.delete(id);
        t.setAttribute('aria-pressed', String(on));
        t.querySelector('[data-count]').textContent = p.packs + (on ? 1 : 0);
      } else if (t.dataset.follow) {
        const name = t.dataset.follow;
        const on = !state.followed.has(name);
        if (on) state.followed.add(name); else state.followed.delete(name);
        document.querySelectorAll('[data-follow]').forEach(function (b) {
          if (b.dataset.follow === name) {
            b.setAttribute('aria-pressed', String(on));
            b.textContent = on ? 'Following' : 'Follow';
          }
        });
      } else if (t.hasAttribute('data-more')) {
        const text = t.previousElementSibling;
        const open = text.classList.toggle('is-clamped') === false;
        t.setAttribute('aria-expanded', String(open));
        t.textContent = open ? 'Show less' : 'Show more';
      } else if (t.hasAttribute('data-place')) {
        const next = t.dataset.place;
        state.place = next === state.place ? '' : next;
        render();
      } else if (t.dataset.sort) {
        state.sort = t.dataset.sort;
        render();
      }
    });

    render();
  }

  window.HowlFeed = { init: init };
})();

HowlFeed.init({
  post: function (p, h) {
    const size = h.isLong(p) ? 'is-long' : (p.text.length <= 120 ? 'is-short' : 'is-mid');
    return '<article class="card ' + size + '">' +
      '<header class="card-head">' +
        '<div class="avatar" aria-hidden="true">' + h.initials(p.author) + '</div>' +
        '<p class="meta"><strong>' + h.esc(p.handle) + '</strong><span>' + p.time + (p.location ? ' · ' + h.esc(p.location) : '') + '</span></p>' +
        h.follow(p) +
      '</header>' +
      h.text(p) +
      '<div class="actions">' + h.reply(p) + h.pack(p) + '</div>' +
    '</article>';
  },
  places: {
    chips: function (pl, h) {
      return '<button class="chip" type="button" data-place="' + h.esc(pl.name) + '" aria-pressed="false">' + h.esc(pl.label) + '</button>';
    },
    list: function (pl, h) {
      return '<button class="place-row" type="button" data-place="' + h.esc(pl.name) + '" aria-pressed="false"><span>' + h.esc(pl.label) + '</span><span class="count">' + pl.count + '</span></button>';
    },
  },
});

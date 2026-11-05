HowlFeed.init({
  post: function (p, h) {
    return '<article class="post">' +
      '<div class="avatar" aria-hidden="true">' + h.initials(p.author) + '</div>' +
      '<div class="body">' +
        '<p class="meta"><strong>' + h.esc(p.handle) + '</strong><span>' + p.time + (p.location ? ' · ' + h.esc(p.location) : '') + '</span></p>' +
        h.text(p) +
        '<div class="actions">' + h.reply(p) + h.pack(p) + '</div>' +
      '</div></article>';
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

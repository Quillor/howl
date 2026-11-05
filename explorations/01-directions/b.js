HowlFeed.init({
  post: function (p, h) {
    return '<article class="post">' +
      '<div class="avatar" aria-hidden="true">' + h.initials(p.author) + '</div>' +
      '<div class="body">' +
        '<p class="meta"><strong>' + h.esc(p.author) + '</strong><span>@' + h.esc(p.handle) + '</span><span>' + p.time + '</span></p>' +
        (p.location ? '<h2 class="place">' + h.esc(p.location) + '</h2>' : '') +
        h.text(p) +
        '<div class="actions">' + h.reply(p) + h.pack(p) + '</div>' +
      '</div></article>';
  },
  places: {
    circles: function (pl, h) {
      return '<button class="circle" type="button" data-place="' + h.esc(pl.name) + '" aria-pressed="false">' +
        '<span class="disc" aria-hidden="true">' + h.esc(pl.initials) + '</span>' +
        '<span class="label">' + h.esc(pl.label) + '</span></button>';
    },
    list: function (pl, h) {
      return '<button class="place-row" type="button" data-place="' + h.esc(pl.name) + '" aria-pressed="false"><span>' + h.esc(pl.label) + '</span><span class="count">' + pl.count + '</span></button>';
    },
  },
});

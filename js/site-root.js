(function () {
  'use strict';

  /** GitHub Pages 项目站路径根，如 /windy.github.io/ */
  window.SITE_ROOT = (function () {
    var parts = location.pathname.split('/').filter(Boolean);
    if (!parts.length) return '/';
    if (parts[parts.length - 1].indexOf('.') !== -1) parts.pop();
    return '/' + parts.join('/') + '/';
  })();

  window.siteUrl = function (path) {
    return window.SITE_ROOT + String(path).replace(/^\.\//, '');
  };
})();

/*
 * أدوات الرسم متساوي القياس (Isometric) بصيغة SVG.
 * محاور العالم: x نحو أسفل اليمين، y نحو أسفل اليسار، z للأعلى.
 * الجدار الأيسر هو المستوى x=0، والجدار الأيمن هو المستوى y=0.
 */
(function () {
  'use strict';

  const r = (n) => Math.round(n * 10) / 10;

  /** تفتيح (amt > 0) أو تغميق (amt < 0) لون سداسي */
  function shade(hex, amt) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const n = parseInt(c, 16);
    const f = (v) => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
    return '#' + [n >> 16, (n >> 8) & 255, n & 255]
      .map((v) => f(v).toString(16).padStart(2, '0')).join('');
  }

  class Iso {
    constructor(ox, oy) {
      this.ox = ox;
      this.oy = oy;
    }

    /** تحويل نقطة من إحداثيات العالم إلى إحداثيات الشاشة */
    p(x, y, z) {
      return [this.ox + x - y, this.oy + (x + y) / 2 - (z || 0)];
    }

    pts(list) {
      return list.map((q) => {
        const s = this.p(q[0], q[1], q[2]);
        return r(s[0]) + ',' + r(s[1]);
      }).join(' ');
    }

    poly(list, fill, extra) {
      return '<polygon points="' + this.pts(list) + '" fill="' + fill + '" stroke="' + fill +
        '" stroke-width=".6" stroke-linejoin="round"' + (extra ? ' ' + extra : '') + '/>';
    }

    /** صندوق ثلاثي الأبعاد بأوجهه الثلاثة المرئية */
    box(x, y, z, w, d, h, color, opt) {
      opt = opt || {};
      const top = opt.top || shade(color, 0.16);
      const left = opt.left || color;
      const right = opt.right || shade(color, -0.16);
      const X = x + w, Y = y + d, Z = z + h;
      return '<g>' +
        this.poly([[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]], left) +
        this.poly([[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]], right) +
        this.poly([[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]], top) +
        '</g>';
    }

    /** مصفوفة تحويل للرسم المسطح على مستوى x ثابت (مثل الجدار الأيسر) — الأصل أعلى يسار الصورة */
    onPlaneX(x, yMax, zTop) {
      const s = this.p(x, yMax, zTop);
      return 'matrix(1,-0.5,0,1,' + r(s[0]) + ',' + r(s[1]) + ')';
    }

    /** مصفوفة تحويل للرسم المسطح على مستوى y ثابت (مثل الجدار الأيمن أو شاشة مواجهة) */
    onPlaneY(xMin, y, zTop) {
      const s = this.p(xMin, y, zTop);
      return 'matrix(1,0.5,0,1,' + r(s[0]) + ',' + r(s[1]) + ')';
    }

    /** مصفوفة تحويل للرسم المسطح على سطح أفقي (أرضية/سطح طاولة) */
    onPlaneZ(xMin, yMin, z) {
      const s = this.p(xMin, yMin, z);
      return 'matrix(1,0.5,-1,0.5,' + r(s[0]) + ',' + r(s[1]) + ')';
    }
  }

  window.CyberEscape.Iso = Iso;
  window.CyberEscape.shade = shade;
})();

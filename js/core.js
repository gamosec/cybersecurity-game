/* النواة: مساحة الأسماء، سجل السيناريوهات، أدوات مساعدة وأيقونات */
(function () {
  'use strict';

  const scenarios = [];

  const CE = {
    STAGE_W: 1600,
    STAGE_H: 900,
    scenarios,

    /**
     * تسجيل سيناريو جديد. راجع README.md لمعرفة شكل كائن السيناريو.
     */
    registerScenario(def) {
      if (!def || !def.id) throw new Error('Scenario must have an id');
      scenarios.push(def);
      scenarios.sort((a, b) => (a.number || 0) - (b.number || 0));
    },

    getScenario(id) {
      return scenarios.find((s) => s.id === id) || null;
    },

    util: {
      escape(str) {
        return String(str).replace(/[&<>"']/g, (c) => ({
          '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
      },
      formatTime(sec) {
        sec = Math.max(0, Math.round(sec));
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      },
      storageGet(key) {
        try { return window.localStorage.getItem(key); } catch (e) { return null; }
      },
      storageSet(key, value) {
        try { window.localStorage.setItem(key, value); } catch (e) { /* تجاهل */ }
      }
    },

    icons: {
      shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 19.4 5.4V11c0 5-3.1 8.9-7.4 10.5C7.7 19.9 4.6 16 4.6 11V5.4Z"/></svg>',
      shieldCheck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 19.4 5.4V11c0 5-3.1 8.9-7.4 10.5C7.7 19.9 4.6 16 4.6 11V5.4Z"/><path d="m8.6 12 2.4 2.4 4.4-4.8"/></svg>',
      shieldOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6 19.4 5.4V11c0 5-3.1 8.9-7.4 10.5C7.7 19.9 4.6 16 4.6 11V5.4Z"/><path d="M7.4 18.2 16.8 5.8"/></svg>',
      bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M12 3a6 6 0 0 0-6 6v3.6L4.2 15.6c-.4.7.1 1.4.9 1.4h13.8c.8 0 1.3-.7.9-1.4L18 12.6V9a6 6 0 0 0-6-6Z"/><path class="fill" d="M9.5 18.5a2.5 2.5 0 0 0 5 0Z"/></svg>',
      help: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.6 8.4a3.5 3.5 0 1 1 5.6 2.8c-1.3.9-2.2 1.7-2.2 3.3v.6"/><circle class="fill" cx="12" cy="19" r="1.4"/></svg>',
      soundOn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M11 5 6.5 9H3.5v6h3L11 19Z"/><path d="M15 9a4 4 0 0 1 0 6M17.8 6.3a8 8 0 0 1 0 11.4"/></svg>',
      soundOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="fill" d="M11 5 6.5 9H3.5v6h3L11 19Z"/><path d="m15.5 9.5 5 5M20.5 9.5l-5 5"/></svg>',
      check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
      chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>',
      lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="fill" x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/></svg>'
    }
  };

  window.CyberEscape = CE;
})();

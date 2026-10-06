/* سيناريوهات قادمة — تظهر في القائمة كـ "قريبًا" حتى يُضاف محتواها.
 * مثال: { id: 'ransomware', number: 5, icon: 'key', title: '...', heading: '...' }
 * الأيقونات المتاحة: mail, key, users (راجع cardIcons في js/game.js). */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  [].forEach((s) => CE.registerScenario(Object.assign({ comingSoon: true }, s)));
})();

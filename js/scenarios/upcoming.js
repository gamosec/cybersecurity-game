/* سيناريوهات قادمة — تظهر في القائمة كـ "قريبًا" حتى يُضاف محتواها */
(function () {
  'use strict';

  const CE = window.CyberEscape;

  [
    { id: 'social-engineering', number: 4, icon: 'users', title: 'الهندسة الاجتماعية', heading: 'الزائر غير المتوقع' }
  ].forEach((s) => CE.registerScenario(Object.assign({ comingSoon: true }, s)));
})();

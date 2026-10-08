/*
 * مكتبة الأيقونات المرسومة: رسومات مسطحة بألوان زاهية تُستخدم بدل النص المجرد في الخيارات.
 *
 * كل أيقونة = رسم أساسي (base) + شارة صغيرة اختيارية (badge) في الزاوية السفلية.
 *   CyberEscape.Icons.get('doc+eye')     → SVG نصي
 *   CyberEscape.Icons.forText('...')     → يختار الأيقونة المناسبة لنص الخيار تلقائيًا
 * لا تُستخدم معرّفات (id) داخل الرسومات حتى لا تتكرر في الصفحة.
 */
(function () {
  'use strict';

  const CE = window.CyberEscape;
  const NAVY = '#1f3b60';

  const bases = {
    doc: '<path d="M16 6h22l12 12v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M38 6v12h12" fill="#cfe3f3" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M20 28h24M20 36h24M20 44h16" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round"/>',
    mail: '<rect x="6" y="14" width="52" height="38" rx="5" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><path d="M8 18l24 18 24-18" fill="none" stroke="#3fa2e0" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>',
    phone: '<rect x="18" y="5" width="28" height="54" rx="6" fill="#1f2933"/><rect x="21" y="11" width="22" height="38" rx="2" fill="#5db2ee"/><rect x="25" y="17" width="14" height="6" rx="2" fill="#fff"/><rect x="25" y="26" width="10" height="5" rx="2" fill="#fff" opacity=".8"/><circle cx="32" cy="54" r="2" fill="#8995a3"/>',
    handset: '<path d="M14 8l8-2 6 14-7 5c3 7 8 12 15 15l5-7 14 6-2 9c-1 4-4 6-8 6C26 54 8 38 8 18c0-4 2-9 6-10Z" fill="#3fa2e0" stroke="' + NAVY + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 12a14 14 0 0 1 12 12M40 4a22 22 0 0 1 20 20" fill="none" stroke="#f6c23e" stroke-width="4" stroke-linecap="round"/>',
    monitor: '<rect x="6" y="8" width="52" height="36" rx="4" fill="#2f3b48"/><rect x="10" y="12" width="44" height="28" rx="1.5" fill="#5db2ee"/><path d="M32 44v8M20 55h24" stroke="#2f3b48" stroke-width="5" stroke-linecap="round"/>',
    laptop: '<path d="M12 10h40a3 3 0 0 1 3 3v28H9V13a3 3 0 0 1 3-3Z" fill="#2f3b48"/><rect x="13" y="14" width="38" height="23" fill="#5db2ee"/><path d="M3 44h58l-4 9H7Z" fill="#aab3bd"/>',
    person: '<circle cx="32" cy="20" r="10" fill="#e9c6a3"/><path d="M10 58c0-14 9-23 22-23s22 9 22 23Z" fill="#3fa2e0"/>',
    agent: '<circle cx="32" cy="26" r="11" fill="#e9c6a3"/><path d="M10 58c0-13 9-21 22-21s22 8 22 21Z" fill="#1f3b60"/><path d="M19 26a13 13 0 0 1 26 0" fill="none" stroke="#3a4552" stroke-width="4"/><rect x="14" y="24" width="6" height="11" rx="3" fill="#3a4552"/><rect x="44" y="24" width="6" height="11" rx="3" fill="#3a4552"/><path d="M47 34q0 6-10 6" fill="none" stroke="#3a4552" stroke-width="3"/>',
    boss: '<circle cx="32" cy="20" r="10" fill="#e9c6a3"/><path d="M10 58c0-14 9-23 22-23s22 9 22 23Z" fill="#2f3b48"/><path d="M26 36 32 46 38 36Z" fill="#fff"/><path d="M30 38h4l2 14-4 4-4-4Z" fill="#ef4352"/>',
    thief: '<circle cx="32" cy="24" r="12" fill="#f2d3b1"/><path d="M19 22q0-14 13-14t13 14Z" fill="#5d6b79"/><rect x="18" y="22" width="28" height="8" rx="4" fill="#1d232a"/><circle cx="26" cy="26" r="2" fill="#fff"/><circle cx="38" cy="26" r="2" fill="#fff"/><path d="M8 58c0-12 9-20 24-20s24 8 24 20Z" fill="#53606e"/>',
    tech: '<circle cx="32" cy="26" r="11" fill="#e9c6a3"/><path d="M18 24q0-14 14-14t14 14Z" fill="#f6c23e"/><rect x="15" y="22" width="34" height="5" rx="2.5" fill="#e0a91f"/><path d="M10 58c0-13 9-21 22-21s22 8 22 21Z" fill="#f08a2a"/><path d="M40 40l12 12" stroke="#8995a3" stroke-width="5" stroke-linecap="round"/>',
    users: '<circle cx="20" cy="22" r="8" fill="#e8679f"/><path d="M4 54c0-11 7-18 16-18s16 7 16 18Z" fill="#e8679f"/><circle cx="44" cy="22" r="8" fill="#3fa2e0"/><path d="M28 54c0-11 7-18 16-18s16 7 16 18Z" fill="#3fa2e0"/><circle cx="32" cy="20" r="9" fill="#f6c23e"/><path d="M14 58c0-12 8-20 18-20s18 8 18 20Z" fill="#f6c23e"/>',
    door: '<rect x="14" y="6" width="36" height="52" rx="3" fill="#b98559" stroke="#7d5a40" stroke-width="3"/><rect x="20" y="12" width="24" height="18" rx="2" fill="none" stroke="#a37249" stroke-width="2.5"/><rect x="20" y="36" width="24" height="16" rx="2" fill="none" stroke="#a37249" stroke-width="2.5"/><circle cx="43" cy="34" r="2.5" fill="#f6c23e"/>',
    cloud: '<path d="M16 46a12 12 0 0 1 2-24 16 16 0 0 1 30 5 10 10 0 0 1-2 19Z" fill="#cfe3f3" stroke="#3fa2e0" stroke-width="3" stroke-linejoin="round"/>',
    wifi: '<g fill="none" stroke="#3fa2e0" stroke-width="5" stroke-linecap="round"><path d="M8 26a34 34 0 0 1 48 0"/><path d="M16 35a22 22 0 0 1 32 0"/><path d="M24 44a10 10 0 0 1 16 0"/></g><circle cx="32" cy="52" r="4" fill="#3fa2e0"/>',
    wifiTwin: '<g fill="none" stroke="#3fa2e0" stroke-width="4.5" stroke-linecap="round"><path d="M6 24a30 30 0 0 1 42 0"/><path d="M13 32a19 19 0 0 1 28 0"/><path d="M20 40a9 9 0 0 1 14 0"/></g><circle cx="27" cy="47" r="3.5" fill="#3fa2e0"/><g fill="none" stroke="#ef4352" stroke-width="4.5" stroke-linecap="round" opacity=".9"><path d="M16 30a30 30 0 0 1 42 0"/><path d="M23 38a19 19 0 0 1 28 0"/><path d="M30 46a9 9 0 0 1 14 0"/></g><circle cx="37" cy="53" r="3.5" fill="#ef4352"/>',
    key: '<circle cx="20" cy="32" r="11" fill="none" stroke="#f6c23e" stroke-width="7"/><path d="M31 32h26M49 32v10M56 32v8" stroke="#f6c23e" stroke-width="7" stroke-linecap="round"/>',
    lock: '<path d="M21 28v-7a11 11 0 0 1 22 0v7" fill="none" stroke="' + NAVY + '" stroke-width="6"/><rect x="12" y="28" width="40" height="28" rx="6" fill="#3fa2e0"/><circle cx="32" cy="40" r="4" fill="' + NAVY + '"/><rect x="30" y="42" width="4" height="8" rx="2" fill="' + NAVY + '"/>',
    unlock: '<path d="M21 28v-7a11 11 0 0 1 21-4" fill="none" stroke="#b4232f" stroke-width="6" stroke-linecap="round"/><rect x="12" y="28" width="40" height="28" rx="6" fill="#ef4352"/><circle cx="32" cy="40" r="4" fill="#6b1018"/><rect x="30" y="42" width="4" height="8" rx="2" fill="#6b1018"/>',
    shield: '<path d="M32 5 53 13v17c0 15-9 25-21 29C20 55 11 45 11 30V13Z" fill="#3fa2e0" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><path d="M22 31l7 7 14-15" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
    shieldCrack: '<path d="M32 5 53 13v17c0 15-9 25-21 29C20 55 11 45 11 30V13Z" fill="#c9d0d9" stroke="#4b5563" stroke-width="3" stroke-linejoin="round"/><path d="M32 8l-6 14 9 8-8 10 6 14" fill="none" stroke="#ef4352" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>',
    bug: '<path d="M32 22v34M19 31l-11-6M19 42H6M19 52l-11 6M45 31l11-6M45 42h13M45 52l11 6M26 11 20 4M38 11l6-7" stroke="#6b1018" stroke-width="3" stroke-linecap="round" fill="none"/><ellipse cx="32" cy="40" rx="14" ry="17" fill="#ef4352"/><circle cx="32" cy="18" r="8" fill="#b4232f"/><circle cx="26" cy="37" r="3" fill="#fff" opacity=".35"/><circle cx="38" cy="45" r="3" fill="#6b1018" opacity=".45"/>',
    server: '<rect x="10" y="6" width="44" height="15" rx="3" fill="#4b5563"/><rect x="10" y="24" width="44" height="15" rx="3" fill="#4b5563"/><rect x="10" y="42" width="44" height="15" rx="3" fill="#4b5563"/><g fill="#2ee07a"><circle cx="18" cy="13.5" r="2.4"/><circle cx="18" cy="31.5" r="2.4"/><circle cx="18" cy="49.5" r="2.4"/></g><g stroke="#9aa5b1" stroke-width="3" stroke-linecap="round"><path d="M28 13.5h20M28 31.5h20M28 49.5h20"/></g>',
    house: '<path d="M6 32 32 8l26 24" fill="none" stroke="#ef4352" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/><path d="M12 30v26h40V30L32 14Z" fill="#fff3d6" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><rect x="26" y="38" width="12" height="18" fill="#b98559"/><rect x="16" y="34" width="8" height="8" fill="#9fd0ee"/><rect x="40" y="34" width="8" height="8" fill="#9fd0ee"/>',
    plane: '<path d="M3 34q0-8 11-8h30q13 0 17 8-4 8-17 8H14Q3 42 3 34Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><path d="M30 38 16 58h11l22-20Z" fill="#3fa2e0"/><path d="M30 30 18 10h11l22 20Z" fill="#3fa2e0"/><path d="M8 28 4 14h9l9 14Z" fill="#1f3b60"/><g fill="#9fd0ee"><circle cx="34" cy="34" r="2"/><circle cx="42" cy="34" r="2"/><circle cx="50" cy="34" r="2"/></g>',
    camera: '<path d="M6 16h38l10 8v14H6Z" fill="#eef1f4" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><circle cx="46" cy="31" r="7" fill="#11142a"/><circle cx="46" cy="31" r="3" fill="#5ef2ff"/><circle cx="14" cy="24" r="3" fill="#ef4352"/><path d="M16 38v10l-8 6M16 48h14" stroke="#8995a3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    mic: '<rect x="23" y="5" width="18" height="32" rx="9" fill="#3a4552"/><path d="M14 28a18 18 0 0 0 36 0M32 46v10M21 58h22" stroke="#3a4552" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M27 14h10M27 20h10M27 26h10" stroke="#8995a3" stroke-width="2.5"/>',
    usb: '<rect x="16" y="24" width="40" height="22" rx="4" fill="#e84a4a"/><rect x="5" y="29" width="15" height="12" fill="#c9d0d9"/><rect x="9" y="32" width="3" height="6" fill="#6b7280"/><rect x="14" y="32" width="3" height="6" fill="#6b7280"/><circle cx="46" cy="35" r="3.5" fill="#fff" opacity=".7"/>',
    disk: '<rect x="6" y="12" width="52" height="40" rx="6" fill="#4b5563"/><circle cx="26" cy="32" r="13" fill="#2b333c"/><circle cx="26" cy="32" r="4" fill="#9aa5b1"/><path d="M26 32l14-8" stroke="#c9d0d9" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="45" r="3" fill="#2ee07a"/>',
    card: '<rect x="5" y="14" width="54" height="38" rx="5" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><circle cx="22" cy="28" r="6" fill="#e9c6a3"/><path d="M11 44q11-14 22 0Z" fill="#3fa2e0"/><path d="M38 26h15M38 34h15M38 42h10" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round"/>',
    bank: '<rect x="5" y="16" width="54" height="34" rx="4" fill="#bfe8cf" stroke="#2d7a4d" stroke-width="3"/><circle cx="32" cy="33" r="9" fill="#fff" stroke="#2d7a4d" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="#2d7a4d" font-family="Arial">$</text><circle cx="13" cy="33" r="3" fill="#2d7a4d"/><circle cx="51" cy="33" r="3" fill="#2d7a4d"/>',
    cart: '<path d="M4 10h9l6 28h30l6-21H16" fill="#fff" stroke="' + NAVY + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/><circle cx="24" cy="50" r="5" fill="' + NAVY + '"/><circle cx="44" cy="50" r="5" fill="' + NAVY + '"/>',
    network: '<g stroke="#8995a3" stroke-width="3"><path d="M32 32 12 12M32 32l20-20M32 32 8 40M32 32l24 8M32 32v22"/></g><circle cx="32" cy="32" r="9" fill="#ef4352"/><g fill="#c0392b"><circle cx="12" cy="12" r="6"/><circle cx="52" cy="12" r="6"/><circle cx="8" cy="40" r="6"/><circle cx="56" cy="40" r="6"/><circle cx="32" cy="54" r="6"/></g>',
    keypad: '<rect x="12" y="5" width="40" height="54" rx="6" fill="#2b3159"/><rect x="17" y="10" width="30" height="11" rx="2" fill="#5ef2ff"/><g fill="#9aa5b1"><circle cx="22" cy="30" r="3.4"/><circle cx="32" cy="30" r="3.4"/><circle cx="42" cy="30" r="3.4"/><circle cx="22" cy="40" r="3.4"/><circle cx="32" cy="40" r="3.4"/><circle cx="42" cy="40" r="3.4"/><circle cx="22" cy="50" r="3.4"/><circle cx="32" cy="50" r="3.4"/><circle cx="42" cy="50" r="3.4"/></g>',
    tv: '<rect x="4" y="9" width="56" height="38" rx="4" fill="#11142a"/><rect x="8" y="13" width="48" height="30" fill="#1b3d7a"/><path d="M14 36l10-10 8 8 10-14 8 10" fill="none" stroke="#5db2ee" stroke-width="3" stroke-linejoin="round"/><path d="M20 54h24" stroke="#11142a" stroke-width="5" stroke-linecap="round"/>',
    bubble: '<path d="M8 8h48a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H34l-12 12V42H8a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round"/><circle cx="20" cy="25" r="3" fill="#3fa2e0"/><circle cx="32" cy="25" r="3" fill="#3fa2e0"/><circle cx="44" cy="25" r="3" fill="#3fa2e0"/>',
    tag: '<path d="M14 6h36a4 4 0 0 1 4 4v40a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z" fill="#fff" stroke="#f6c23e" stroke-width="3"/><circle cx="32" cy="14" r="4.5" fill="none" stroke="#f6c23e" stroke-width="3"/><path d="M18 28h28M18 36h28M18 44h18" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round"/>',
    note: '<path d="M8 8h48v38L44 58H8Z" fill="#ffd84d"/><path d="M44 58V46h12Z" fill="#e0b52e"/><path d="M16 20h32M16 30h32M16 40h16" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/>',
    link: '<g transform="rotate(-45 32 32)" fill="none" stroke-width="7"><rect x="4" y="23" width="32" height="18" rx="9" stroke="#3fa2e0"/><rect x="28" y="23" width="32" height="18" rx="9" stroke="#f08a2a"/></g>',
    qr: '<rect x="5" y="5" width="54" height="54" rx="5" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><g fill="' + NAVY + '"><path d="M11 11h16v16H11Z"/><path d="M37 11h16v16H37Z"/><path d="M11 37h16v16H11Z"/></g><g fill="#fff"><path d="M15 15h8v8h-8Z"/><path d="M41 15h8v8h-8Z"/><path d="M15 41h8v8h-8Z"/></g><g fill="' + NAVY + '"><rect x="37" y="37" width="6" height="6"/><rect x="47" y="37" width="6" height="6"/><rect x="42" y="45" width="6" height="8"/><rect x="31" y="31" width="5" height="5"/></g>',
    cap: '<path d="M32 12 4 25l28 13 28-13Z" fill="' + NAVY + '"/><path d="M15 32v11c0 4 8 9 17 9s17-5 17-9V32L32 42Z" fill="#3fa2e0"/><path d="M56 27v16" stroke="#f6c23e" stroke-width="3" stroke-linecap="round"/><circle cx="56" cy="46" r="3.5" fill="#f6c23e"/>',
    box: '<rect x="8" y="12" width="48" height="42" rx="5" fill="#eaf4fc" stroke="#3fa2e0" stroke-width="3.5" stroke-dasharray="7 5"/><path d="M18 34l8-8 8 6 10-12" fill="none" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    zip: '<path d="M4 18a4 4 0 0 1 4-4h16l6 6h26a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="#f6c23e" stroke="#c9961a" stroke-width="3" stroke-linejoin="round"/><path d="M30 26v28" stroke="#fff" stroke-width="4" stroke-dasharray="4 3"/>',
    exe: '<path d="M16 6h22l12 12v36a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z" fill="#9aa5b1" stroke="#4b5563" stroke-width="3" stroke-linejoin="round"/><path d="M38 6v12h12" fill="#c9d0d9" stroke="#4b5563" stroke-width="3" stroke-linejoin="round"/><circle cx="31" cy="38" r="8" fill="none" stroke="#2b333c" stroke-width="4" stroke-dasharray="5 3.4"/><circle cx="31" cy="38" r="2.5" fill="#2b333c"/>',
    db: '<ellipse cx="32" cy="14" rx="20" ry="8" fill="#9fd0ee" stroke="' + NAVY + '" stroke-width="3"/><path d="M12 14v14c0 4.4 9 8 20 8s20-3.6 20-8V14M12 28v14c0 4.4 9 8 20 8s20-3.6 20-8V28" fill="#3fa2e0" stroke="' + NAVY + '" stroke-width="3"/>',
    gear: '<circle cx="32" cy="32" r="14" fill="#8995a3" stroke="#4b5563" stroke-width="3"/><circle cx="32" cy="32" r="5" fill="#fff"/><g stroke="#4b5563" stroke-width="7" stroke-linecap="round"><path d="M32 6v6M32 52v6M6 32h6M52 32h6M14 14l4 4M46 46l4 4M50 14l-4 4M18 46l-4 4"/></g>',
    chip: '<rect x="16" y="16" width="32" height="32" rx="4" fill="#2f3b48"/><rect x="23" y="23" width="18" height="18" rx="2" fill="#5db2ee"/><g stroke="#9aa5b1" stroke-width="3.5" stroke-linecap="round"><path d="M24 8v8M32 8v8M40 8v8M24 48v8M32 48v8M40 48v8M8 24h8M8 32h8M8 40h8M48 24h8M48 32h8M48 40h8"/></g>',
    target: '<circle cx="32" cy="32" r="26" fill="#fff" stroke="#ef4352" stroke-width="5"/><circle cx="32" cy="32" r="16" fill="#fff" stroke="#ef4352" stroke-width="5"/><circle cx="32" cy="32" r="6" fill="#ef4352"/>',
    org: '<rect x="22" y="6" width="20" height="13" rx="3" fill="#3fa2e0"/><rect x="4" y="42" width="18" height="13" rx="3" fill="#8fb4d6"/><rect x="23" y="42" width="18" height="13" rx="3" fill="#8fb4d6"/><rect x="42" y="42" width="18" height="13" rx="3" fill="#8fb4d6"/><path d="M32 19v10M13 42V29h38v13M32 29v13" fill="none" stroke="' + NAVY + '" stroke-width="3"/>',
    mitm: '<circle cx="9" cy="32" r="7" fill="#3fa2e0"/><circle cx="55" cy="32" r="7" fill="#2db46d"/><path d="M16 32h8M40 32h8" stroke="#8995a3" stroke-width="3" stroke-dasharray="3 3"/><circle cx="32" cy="22" r="7" fill="#e9c6a3"/><path d="M19 52c0-9 5-15 13-15s13 6 13 15Z" fill="#ef4352"/><path d="M26 21h12" stroke="#1d232a" stroke-width="4"/>',
    mask: '<circle cx="32" cy="32" r="22" fill="#f2d3b1"/><rect x="12" y="26" width="40" height="12" rx="6" fill="#1d232a"/><circle cx="23" cy="32" r="3.4" fill="#fff"/><circle cx="41" cy="32" r="3.4" fill="#fff"/><path d="M24 46q8 5 16 0" fill="none" stroke="#b9876a" stroke-width="3" stroke-linecap="round"/>',
    hook: '<path d="M34 6v32a11 11 0 1 1-22 0" fill="none" stroke="#ef4352" stroke-width="6" stroke-linecap="round"/><path d="M8 34l4 6 6-6" fill="none" stroke="#ef4352" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="8" r="3.5" fill="#8995a3"/>',
    bolt: '<path d="M36 4 12 36h16l-4 24 28-36H34Z" fill="#f6c23e" stroke="#c9961a" stroke-width="3" stroke-linejoin="round"/>',
    eyeBig: '<path d="M4 32q28-26 56 0-28 26-56 0Z" fill="#fff" stroke="' + NAVY + '" stroke-width="3.5"/><circle cx="32" cy="32" r="11" fill="#ef4352"/><circle cx="32" cy="32" r="5" fill="#1d232a"/>',
    keyboard: '<rect x="4" y="16" width="56" height="32" rx="5" fill="#4b5563"/><g fill="#c9d0d9"><rect x="9" y="21" width="7" height="6" rx="1.5"/><rect x="19" y="21" width="7" height="6" rx="1.5"/><rect x="29" y="21" width="7" height="6" rx="1.5"/><rect x="39" y="21" width="7" height="6" rx="1.5"/><rect x="49" y="21" width="6" height="6" rx="1.5"/><rect x="9" y="30" width="7" height="6" rx="1.5"/><rect x="19" y="30" width="7" height="6" rx="1.5"/><rect x="29" y="30" width="7" height="6" rx="1.5"/><rect x="39" y="30" width="7" height="6" rx="1.5"/><rect x="49" y="30" width="6" height="6" rx="1.5"/><rect x="14" y="39" width="36" height="5" rx="2"/></g>',
    printer: '<rect x="16" y="6" width="32" height="18" rx="2" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><rect x="6" y="22" width="52" height="24" rx="5" fill="#8995a3"/><rect x="16" y="36" width="32" height="20" rx="2" fill="#fff" stroke="' + NAVY + '" stroke-width="3"/><circle cx="50" cy="30" r="2.5" fill="#2ee07a"/>',
    folder: '<path d="M4 16a4 4 0 0 1 4-4h16l6 7h26a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" fill="#f6c23e" stroke="#c9961a" stroke-width="3" stroke-linejoin="round"/>',
    trash: '<path d="M14 18h36l-3 38a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3Z" fill="#cfe3f3" stroke="#3fa2e0" stroke-width="3"/><path d="M10 18h44M24 18v-5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v5" fill="none" stroke="#3fa2e0" stroke-width="3.5" stroke-linecap="round"/><path d="M26 28v20M32 28v20M38 28v20" stroke="#3fa2e0" stroke-width="3" stroke-linecap="round"/>'
    ,wallet: '<rect x="6" y="14" width="52" height="38" rx="7" fill="#8a5a3c" stroke="#5e3b24" stroke-width="3"/><path d="M6 24h52" stroke="#5e3b24" stroke-width="3"/><rect x="38" y="30" width="22" height="14" rx="5" fill="#b9805a" stroke="#5e3b24" stroke-width="3"/><circle cx="46" cy="37" r="2.6" fill="#f6c23e"/><path d="M14 14l8-6h22l6 6" fill="none" stroke="#5e3b24" stroke-width="3" stroke-linejoin="round"/>',
    bag: '<path d="M22 20v-6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v6" fill="none" stroke="#2f3b48" stroke-width="5"/><rect x="6" y="20" width="52" height="36" rx="7" fill="#3a4552" stroke="#232d3a" stroke-width="3"/><path d="M6 34h52" stroke="#232d3a" stroke-width="3"/><rect x="27" y="30" width="10" height="9" rx="2" fill="#f6c23e" stroke="#232d3a" stroke-width="2"/>',
    cup: '<path d="M12 22h34v20a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14Z" fill="#fff" stroke="#8995a3" stroke-width="3" stroke-linejoin="round"/><path d="M46 28h4a7 7 0 0 1 0 14h-4" fill="none" stroke="#8995a3" stroke-width="4"/><path d="M12 28h34" stroke="#8a5a3c" stroke-width="5"/><path d="M22 6c-3 4 3 6 0 11M32 6c-3 4 3 6 0 11M42 6c-3 4 3 6 0 11" fill="none" stroke="#c9d0d9" stroke-width="3" stroke-linecap="round"/>',
    pen: '<path d="M44 6l14 14L24 54l-16 4 4-16Z" fill="#3fa2e0" stroke="#1f3b60" stroke-width="3" stroke-linejoin="round"/><path d="M44 6l14 14-6 6-14-14Z" fill="#ef4352" stroke="#1f3b60" stroke-width="3" stroke-linejoin="round"/><path d="M8 58l4-16 12 12Z" fill="#f2d3b1" stroke="#1f3b60" stroke-width="3" stroke-linejoin="round"/>',
    notebook: '<rect x="12" y="6" width="42" height="52" rx="4" fill="#fff" stroke="#1f3b60" stroke-width="3"/><rect x="12" y="6" width="9" height="52" fill="#3fa2e0"/><g fill="#1f3b60"><circle cx="12" cy="16" r="2.6"/><circle cx="12" cy="28" r="2.6"/><circle cx="12" cy="40" r="2.6"/><circle cx="12" cy="52" r="2.6"/></g><path d="M28 20h20M28 28h20M28 36h20M28 44h12" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round"/>',
    exit: '<rect x="8" y="6" width="30" height="52" rx="3" fill="#b98559" stroke="#7d5a40" stroke-width="3"/><circle cx="31" cy="33" r="2.6" fill="#f6c23e"/><path d="M42 32h18M53 24l8 8-8 8" fill="none" stroke="#2db46d" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>',
    phoneOff: '<rect x="18" y="5" width="28" height="54" rx="6" fill="#1f2933"/><rect x="21" y="11" width="22" height="38" rx="2" fill="#5db2ee"/><circle cx="32" cy="54" r="2" fill="#8995a3"/><path d="M8 10 56 54" stroke="#ef4352" stroke-width="6" stroke-linecap="round"/>',
    speaker: '<path d="M8 24h12l16-12v40L20 40H8Z" fill="#4b5563" stroke="#232d3a" stroke-width="3" stroke-linejoin="round"/><path d="M44 22a14 14 0 0 1 0 20M50 14a24 24 0 0 1 0 36" fill="none" stroke="#f08a2a" stroke-width="5" stroke-linecap="round"/>',
    scan: '<rect x="18" y="4" width="28" height="56" rx="6" fill="#1f2933"/><rect x="21" y="10" width="22" height="42" rx="2" fill="#eaf4fc"/><g fill="none" stroke="#3fa2e0" stroke-width="3" stroke-linecap="round"><path d="M25 22v-5h5M39 22v-5h-5M25 40v5h5M39 40v5h-5"/></g><rect x="29" y="27" width="6" height="6" fill="#1f3b60"/><path d="M24 31h16" stroke="#ef4352" stroke-width="2"/>',
    vpn: '<path d="M32 4 54 12v18c0 15-9 25-22 30C19 55 10 45 10 30V12Z" fill="#2f7bc2" stroke="#1f3b60" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="13" fill="none" stroke="#fff" stroke-width="3"/><path d="M19 32h26M32 19c-7 8-7 18 0 26M32 19c7 8 7 18 0 26" fill="none" stroke="#fff" stroke-width="2.6"/>',
    menu: '<rect x="10" y="5" width="44" height="54" rx="4" fill="#fff8e6" stroke="#c9961a" stroke-width="3"/><path d="M18 18h28M18 27h28M18 36h20" stroke="#c4a35a" stroke-width="3" stroke-linecap="round"/><circle cx="43" cy="44" r="6" fill="none" stroke="#c9961a" stroke-width="3"/>',
    keys: '<circle cx="20" cy="40" r="8" fill="none" stroke="#8995a3" stroke-width="4"/><path d="M26 34 52 8M44 16l6 6M38 22l5 5" stroke="#f6c23e" stroke-width="6" stroke-linecap="round"/><circle cx="14" cy="50" r="7" fill="none" stroke="#8995a3" stroke-width="4"/><rect x="26" y="44" width="16" height="12" rx="4" fill="#ef4352"/>'
  };

  // شارات صغيرة تُركَّب في الزاوية السفلية اليمنى
  const ring = '<circle r="14" fill="#fff"/>';
  const badges = {
    alert: ring + '<circle r="11.5" fill="#ef4352"/><path d="M0-6v7" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><circle cy="6" r="1.9" fill="#fff"/>',
    x: ring + '<circle r="11.5" fill="#ef4352"/><path d="M-5-5 5 5M5-5-5 5" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>',
    check: ring + '<circle r="11.5" fill="#2db46d"/><path d="M-5.5 0-1.5 4 5.5-4" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>',
    eye: ring + '<circle r="11.5" fill="' + NAVY + '"/><path d="M-8 0q8-8 16 0-8 8-16 0Z" fill="#fff"/><circle r="3.2" fill="#ef4352"/>',
    mag: ring + '<circle r="11.5" fill="#fff" stroke="' + NAVY + '" stroke-width="2"/><circle cx="-1.5" cy="-1.5" r="5" fill="none" stroke="#3fa2e0" stroke-width="2.6"/><path d="M2 2 7 7" stroke="#3fa2e0" stroke-width="3" stroke-linecap="round"/>',
    bolt: ring + '<circle r="11.5" fill="#f08a2a"/><path d="M2-7-5 1h4l-1 6 7-8H3Z" fill="#fff"/>',
    hook: ring + '<circle r="11.5" fill="#ef4352"/><path d="M2-7.5V2.5a4.6 4.6 0 0 1-9.2 0" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M-7.2 2.5-4.2-1" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="2" cy="-8" r="1.6" fill="#fff"/>',
    dollar: ring + '<circle r="11.5" fill="#2db46d"/><text y="5.3" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" font-family="Arial, sans-serif">$</text>',
    q: ring + '<circle r="11.5" fill="#8995a3"/><text y="5.5" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" font-family="Arial, sans-serif">?</text>',
    up: ring + '<circle r="11.5" fill="#3fa2e0"/><path d="M0 6V-6M-5-1 0-6 5-1" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    down: ring + '<circle r="11.5" fill="#3fa2e0"/><path d="M0-6V6M-5 1 0 6 5 1" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    out: ring + '<circle r="11.5" fill="#ef4352"/><path d="M-6 0H6M1-5 6 0 1 5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    lock: ring + '<circle r="11.5" fill="#f6c23e"/><rect x="-5" y="-1" width="10" height="8" rx="1.5" fill="#1e2d3d"/><path d="M-3.2-1v-2a3.2 3.2 0 0 1 6.4 0v2" stroke="#1e2d3d" stroke-width="2" fill="none"/>',
    shield: ring + '<circle r="11.5" fill="#3fa2e0"/><path d="M0-7 6-4.5v4C6 4 3.5 6.5 0 8-3.5 6.5-6 4-6-.5v-4Z" fill="#fff"/>',
    stop: ring + '<circle r="10" fill="#fff" stroke="#ef4352" stroke-width="3"/><path d="M-7 7 7-7" stroke="#ef4352" stroke-width="3"/>',
    bug: ring + '<circle r="11.5" fill="#ef4352"/><ellipse cy="1.5" rx="4" ry="5" fill="#fff"/><circle cy="-5" r="2.6" fill="#fff"/>',
    hash: ring + '<circle r="11.5" fill="#ef4352"/><text y="5.5" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Arial, sans-serif">***</text>'
  };

  function wrap(inner) {
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  function get(spec) {
    const parts = String(spec).split('+');
    const base = bases[parts[0]];
    if (!base) return wrap(bases.shield);
    const badge = parts[1] && badges[parts[1]];
    return wrap(base + (badge ? '<g transform="translate(47 47)">' + badge + '</g>' : ''));
  }

  /*
   * قواعد اختيار الأيقونة من نص الخيار (الأخص أولًا). تنسيقها: [تعبير نمطي، 'رسم+شارة'].
   * أي نص لا يطابق أي قاعدة يأخذ أيقونة افتراضية، وهناك اختبار في المستودع يطبع النصوص غير المطابقة.
   */
  const rules = [
    // الهجمات والتهديدات الشبكية
    [/DDoS|حجب الخدمة/, 'server+x'],
    [/Man-in-the-Middle|الوسيط/, 'mitm'],
    [/Brute Force|القوة الغاشمة|التخمين وهجمات/, 'lock+hash'],
    [/Credential Stuffing|حشو بيانات/, 'key+bolt'],
    [/Keylogger|تسجيل لوحة المفاتيح/, 'keyboard+eye'],
    [/Evil Twin|توأم شريرة|شبكة واي فاي مزيفة/, 'wifiTwin'],
    [/التنصّت على شبكة Wi-Fi|الشبكة اللاسلكية/, 'wifi+eye'],
    [/كاميرا التلفاز/, 'tv+eye'],
    [/البث المباشر/, 'camera+eye'],
    [/Shoulder Surfing|التلصّص/, 'monitor+eye'],
    [/التنصّت/, 'wifi+eye'],
    [/بوت نت|Botnet/, 'network'],
    [/تسجيل المحادثات/, 'mic+eye'],
    [/أوامر صوتية/, 'mic+alert'],
    [/عمليات شراء/, 'cart+alert'],
    [/ثغرات/, 'shieldCrack'],
    [/تخمين الرمز/, 'keypad+q'],
    [/عدم معرفة من دخل|صعوبة معرفة من استخدم/, 'person+q'],
    [/عمّال أو ضيوف سابقين|مغادرة الموظفين/, 'person+out'],
    [/دخول غير مصرّح به إلى المنزل/, 'house+unlock'],
    // الاحتيال والتصيّد
    [/QR/, 'qr+hook'],
    [/الرسائل النصية/, 'phone+hook'],
    [/الصوتي|Vishing|OTP/, 'handset+hook'],
    [/عبر البريد|التصيّد الاحتيالي|بريدك/, 'mail+hook'],
    [/موقع مزيف/, 'monitor+hook'],
    [/CEO|انتحال صفة المدير/, 'boss+alert'],
    [/انتحال صفة فني|Pretexting/, 'tech+q'],
    [/انتحال هوية الموظف/, 'card+alert'],
    [/انتحال هويتك|سرقة الهوية من المستندات|سرقة الهوية/, 'card+alert'],
    [/الضغط والاستعجال/, 'bolt'],
    [/الطُّعم|Baiting/, 'usb+hook'],
    [/الهندسة الاجتماعية/, 'target'],
    [/جمع المعلومات/, 'org+mag'],
    [/الاحتيال المالي عبر الحساب|الاحتيال المالي باستخدام|الاحتيال المالي|تحويل أموال/, 'bank+alert'],
    [/البطاقة البنكية/, 'card+dollar'],
    // البرامج الضارة والبيانات
    [/الفدية/, 'laptop+lock'],
    [/التجسس|spyware/i, 'phone+eye'],
    [/تثبيت برامج|البرامج الضارة|الإصابة/, 'bug'],
    [/نقل برامج ضارة عبر منفذ USB/, 'usb+bug'],
    [/USB/, 'usb+alert'],
    [/القرص الخارجي/, 'disk+out'],
    [/سرقة البيانات من الهاتف/, 'phone+out'],
    [/سرقة البيانات من جهازك|سرقة بيانات تسجيل|بيانات الدخول المحفوظة/, 'monitor+out'],
    [/كلمة مرورك بالفعل|كلمات المرور|كلمة المرور|بيانات الدخول للزوار/, 'note+eye'],
    [/موافقة/, 'phone+alert'],
    [/مصادقة|عطل مؤقت/, 'phone+q'],
    [/فقد المعلومات/, 'disk+x'],
    [/التعطل/, 'laptop+x'],
    [/خرق أمان|كشف بيانات الحجز|كشف عنوان/, 'doc+out'],
    [/باركود/, 'qr+eye'],
    [/إلغاء الرحلة/, 'plane+x'],
    [/منزلك فارغ/, 'house+eye'],
    [/استهدافك/, 'target'],
    [/غرفة الخوادم/, 'server+alert'],
    [/تنصّت أو ذاكرات|زرع أجهزة/, 'chip+alert'],
    [/سرقة الأجهزة/, 'laptop+out'],
    [/اختراق جميع الحسابات/, 'users+x'],
    [/اختراق شبكة الشركة|الوصول غير المصرّح به إلى الشبكة/, 'network'],
    [/اختراق الحساب|اختراق بريدك|كشف كلمة المرور/, 'lock+x'],
    [/دخول المستخدم التالي/, 'person+out'],
    [/التتبّع خلف/, 'door+alert'],
    [/دخول أشخاص|الدخول المادي/, 'door+unlock'],
    [/الوصول غير المصرّح/, 'unlock'],
    [/السرقة/, 'thief']
  ];

  function forText(text) {
    for (let i = 0; i < rules.length; i++) {
      if (rules[i][0].test(text)) return get(rules[i][1]);
    }
    return null;
  }

  // الأيقونة الصريحة (option.icon) لها الأولوية، وإلا تُختار من نص الخيار
  function forOption(o) {
    return o.icon ? get(o.icon) : (forText(o.text) || '');
  }

  CE.Icons = { get: get, forText: forText, forOption: forOption, names: Object.keys(bases), badges: Object.keys(badges), rules: rules };
})();

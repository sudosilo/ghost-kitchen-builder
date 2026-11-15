// Menu shared by RTSS and RDSS. Same file in both repos, keep them matched.
// Each link carries the open site so the next app opens on the same place.
export const APPS = [
  { id: 'rtss', name: 'RTSS', sub: 'Technology site survey, drive-thru model', url: 'https://rtss-sigma.vercel.app/', param: 'site' },
  { id: 'rdss', name: 'RDSS', sub: 'Design and setup survey', url: 'https://ghost-kitchen-builder.vercel.app/', param: 'site' },
  { id: 'ft', name: 'Field Twin', sub: 'Sites on the map, visits and photos', url: 'https://field-twin-teal.vercel.app/', param: 'rie' }
];

// The site named in the address, like ?site=site-abc
export function siteFromUrl() {
  try { return new URLSearchParams(location.search).get('site') || ''; } catch (e) { return ''; }
}

// Keep the address in step with the open site, so a refresh or a shared link lands on it.
export function siteToUrl(id) {
  try {
    const u = new URL(location.href);
    if (id) u.searchParams.set('site', id); else u.searchParams.delete('site');
    history.replaceState(null, '', u);
  } catch (e) {}
}

export function appLink(app, siteId) {
  return siteId ? app.url + '?' + app.param + '=' + encodeURIComponent(siteId) : app.url;
}

// btn: the menu button. current: this app's id. getSite: returns the open site id, or nothing.
export function mountMenu(btn, current, getSite) {
  const shade = document.createElement('div');
  shade.id = 'menuShade';
  const drawer = document.createElement('nav');
  drawer.id = 'drawer';
  drawer.setAttribute('aria-label', 'Apps');
  document.body.append(shade, drawer);
  const close = () => { drawer.classList.remove('open'); shade.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  const open = () => {
    const id = getSite();
    drawer.replaceChildren();
    const head = document.createElement('div');
    head.className = 'drawer-head';
    head.textContent = 'Apps';
    drawer.append(head);
    APPS.forEach(a => {
      const el = document.createElement(a.id === current ? 'div' : 'a');
      el.className = 'app-link' + (a.id === current ? ' here' : '');
      if (a.id !== current) el.href = appLink(a, id);
      const b = document.createElement('b');
      b.textContent = a.name + (a.id === current ? ', open now' : '');
      const s = document.createElement('small');
      s.textContent = a.sub;
      el.append(b, s);
      drawer.append(el);
    });
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = id ? 'Links open the same site.' : 'Pick a site and the links open it too.';
    drawer.append(note);
    drawer.classList.add('open');
    shade.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  };
  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', () => (drawer.classList.contains('open') ? close() : open()));
  shade.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

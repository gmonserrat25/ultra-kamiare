// Ultra Kâmiâre Trail

// Menú en celular
const botonMenu = document.querySelector('.franja__menu');
const menu = document.getElementById('menu');
botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierta');
  botonMenu.setAttribute('aria-expanded', abierto);
});
menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    menu.classList.remove('abierta');
    botonMenu.setAttribute('aria-expanded', 'false');
  }
});

// Pestañas de distancias
const pestanias = [...document.querySelectorAll('.pestanias [role="tab"]')];
function elegir(tab) {
  pestanias.forEach((t) => {
    const activa = t === tab;
    t.setAttribute('aria-selected', activa);
    t.tabIndex = activa ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !activa;
  });
}
pestanias.forEach((tab, i) => {
  tab.addEventListener('click', () => elegir(tab));
  tab.addEventListener('keydown', (e) => {
    const paso = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!paso) return;
    const sig = pestanias[(i + paso + pestanias.length) % pestanias.length];
    sig.focus();
    elegir(sig);
  });
});

// Perfiles de altimetría: puntos [km, metros] redibujados a mano de las placas oficiales
const PERFILES = {
  50: [[0,1000],[2,1025],[4,1015],[6,1010],[8,1040],[9.4,1090],[10.5,1180],[11.3,1110],[12.5,1040],[14,1030],[15,1060],[16,1010],[17.5,1000],[18.9,1020],[20,1040],[21.5,1130],[22.5,1250],[23.5,1450],[24.5,1640],[25.5,1720],[26.5,1745],[27.5,1720],[28.3,1735],[29.5,1690],[30.5,1650],[31.5,1560],[32.5,1400],[33.3,1440],[34.2,1620],[35,1700],[35.8,1740],[36.6,1660],[37.3,1700],[38.2,1620],[39.5,1480],[41,1300],[42.5,1150],[44,1060],[45.5,1030],[46.3,1005],[47.2,1030]],
  30: [[0,1000],[1.5,995],[3,990],[4,1015],[5,1010],[5.8,1030],[7,1080],[8,1130],[9,1260],[10,1480],[10.8,1680],[11.3,1779],[11.8,1700],[12.3,1745],[13,1750],[14,1720],[15,1715],[16,1735],[17,1755],[18,1720],[19,1640],[20,1520],[21,1390],[22,1280],[23.2,1210],[24.5,1140],[25.5,1090],[26.5,1040],[27.5,1010],[28.96,1025]],
  15: [[0,1030],[0.6,1045],[1.5,1050],[2.5,1070],[3.2,1085],[4,1100],[4.8,1125],[5.3,1120],[6,1145],[6.6,1170],[7,1185],[7.4,1180],[7.7,1187],[8.1,1140],[8.8,1100],[9.5,1085],[10.3,1065],[10.8,1045],[11.2,1070],[11.6,1085],[12,1060],[12.5,1035],[13,1040],[13.5,1030],[14,1045],[14.4,1005],[14.9,1010],[15.4,1025],[15.83,1030]],
};

const miles = (n) => n.toLocaleString('es-AR');

document.querySelectorAll('.perfil').forEach((fig) => {
  const puntos = PERFILES[fig.dataset.perfil];
  const km = parseFloat(fig.dataset.km);
  const pa = fig.dataset.pa.split(',').map(Number);
  const alts = puntos.map((p) => p[1]);
  const piso = Math.floor((Math.min(...alts) - 40) / 50) * 50;
  const techo = Math.ceil((Math.max(...alts) + 30) / 50) * 50;
  const W = 1000, H = 260;
  const x = (k) => (k / km) * W;
  const y = (m) => H - ((m - piso) / (techo - piso)) * H;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = fig.querySelector('svg');

  for (let i = 1; i <= 3; i++) {
    const l = document.createElementNS(ns, 'line');
    const yy = (H / 4) * i;
    l.setAttribute('x1', 0); l.setAttribute('x2', W);
    l.setAttribute('y1', yy); l.setAttribute('y2', yy);
    l.setAttribute('class', 'eje');
    svg.appendChild(l);
  }

  const d = `M0,${H} ` + puntos.map(([k, m]) => `L${x(k).toFixed(1)},${y(m).toFixed(1)}`).join(' ') + ` L${W},${H} Z`;
  const area = document.createElementNS(ns, 'path');
  area.setAttribute('d', d);
  area.setAttribute('class', 'relleno');
  svg.appendChild(area);

  pa.forEach((k) => {
    const l = document.createElementNS(ns, 'line');
    l.setAttribute('x1', x(k)); l.setAttribute('x2', x(k));
    l.setAttribute('y1', 0); l.setAttribute('y2', H);
    l.setAttribute('class', 'marca-pa');
    svg.appendChild(l);
  });

  const alt = document.createElement('p');
  alt.className = 'perfil__alt';
  alt.textContent = `Altitud: de ${miles(piso)} a ${miles(techo)} m`;
  fig.insertBefore(alt, svg);

  const rot = document.createElement('div');
  rot.className = 'perfil__rotulos';
  const pasos = 5;
  for (let i = 0; i <= pasos; i++) {
    const s = document.createElement('span');
    s.textContent = i === pasos ? `${miles(km)} km` : `${miles(Math.round((km / pasos) * i))}`;
    rot.appendChild(s);
  }
  svg.after(rot);
});

// Visor de fotos
const visor = document.querySelector('.visor');
const visorImg = visor.querySelector('img');
const visorAutor = visor.querySelector('.visor__autor');
document.querySelectorAll('.galeria__item').forEach((b) => {
  b.addEventListener('click', () => {
    const mini = b.querySelector('img');
    visorImg.src = b.dataset.src;
    visorImg.alt = mini.alt;
    visorAutor.textContent = `Foto: ${b.dataset.autor}`;
    visor.showModal();
  });
});
visor.querySelector('.visor__cerrar').addEventListener('click', () => visor.close());
visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });

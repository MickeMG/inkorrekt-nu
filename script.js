const STORAGE_KEY = 'inkorrekt_cart_v2';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_placeholder';

const products = [
  {
    id: 'motljus',
    name: 'Motljus',
    label: 'OBJEKT NR. 01 – BEGRÄNSAT ANTAL',
    short: 'Ansiktet inverteras i motljus. En studie i perception.',
    description: 'Motljus är en unik skulpturallampa (30 cm) med tydlig narrativ nerv. Formen förändras beroende på ljusriktning och placerar betraktaren i ett osäkert mellanrum mellan sanning och tolkning.',
    image: 'https://placehold.co/1200x900/111111/c8a96e?text=Motljus',
    gallery: [
      'https://placehold.co/800x600/111111/c8a96e?text=Motljus+01',
      'https://placehold.co/800x600/111111/c8a96e?text=Motljus+02',
      'https://placehold.co/800x600/111111/c8a96e?text=Motljus+03',
      'https://placehold.co/800x600/111111/c8a96e?text=Motljus+04'
    ],
    price: 2495
  },
  {
    id: 'figurine',
    name: 'Christer Pettersson-figurin',
    label: 'OBJEKT NR. 02',
    short: 'Kompakt form med rå yta och stark siluett.',
    description: 'En unik figurin i liten skala med tydlig handgjord karaktär. Objektet bär spår av processen och är avsett att stå nära ögat, som ett fragment ur ett större bildarkiv.',
    image: 'https://placehold.co/1200x900/111111/c8a96e?text=Figurin',
    gallery: [
      'https://placehold.co/800x600/111111/c8a96e?text=Figurin+01',
      'https://placehold.co/800x600/111111/c8a96e?text=Figurin+02'
    ],
    price: 995
  },
  {
    id: 'packaging',
    name: 'HANTERAS VARSAMT – Christer Pettersson inside',
    label: 'OBJEKT NR. 03',
    short: 'Signaturgrafik som fungerar som objekt i sig.',
    description: 'En unik signaturförpackning/grafik med tabloid-ton och arkivestetik. Text och layout bär lika mycket vikt som materialet och blir en del av verket.',
    image: 'https://placehold.co/1200x900/111111/c8a96e?text=Signatur',
    gallery: [
      'https://placehold.co/800x600/111111/c8a96e?text=Signatur+01',
      'https://placehold.co/800x600/111111/c8a96e?text=Signatur+02'
    ],
    price: 395
  },
  {
    id: 'busts',
    name: 'Byster & ansiktsskulpturer',
    label: 'OBJEKT NR. 04',
    short: 'Beige/vit finish med textur och kylig tyngd.',
    description: 'En serie unika byster och ansiktsskulpturer i beige/vit finish. Ytan är medvetet ojämn för att fånga ljus och skugga på ett sätt som ger varje verk en egen närvaro.',
    image: 'https://placehold.co/1200x900/111111/c8a96e?text=Byster',
    gallery: [
      'https://placehold.co/800x600/111111/c8a96e?text=Byst+01',
      'https://placehold.co/800x600/111111/c8a96e?text=Byst+02',
      'https://placehold.co/800x600/111111/c8a96e?text=Byst+03'
    ],
    price: 1495
  }
];
const byId = Object.fromEntries(products.map(p => [p.id, p]));
let cart = loadCart();
let currentModalProduct = null;

function loadCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
function formatSEK(n) { return `${n.toLocaleString('sv-SE')} kr`; }

function renderGrid() {
  const root = document.querySelector('.editorial-grid');
  root.innerHTML = '';
  products.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = `editorial-card ${idx % 2 === 0 ? 'large' : 'small'}`;
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="overlay">
        <p class="kicker">${p.label}</p>
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <a href="#" data-id="${p.id}">→ SE OBJEKT</a>
      </div>`;
    card.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
      openProductModal(p.id);
    });
    root.appendChild(card);
  });
}

function cartTotals() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + (byId[item.id]?.price || 0) * item.qty, 0);
  return { count, total };
}

function addToCart(id) {
  const row = cart.find(x => x.id === id);
  if (row) row.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCart();
}
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCart();
}

function updateCart() {
  const { count, total } = cartTotals();
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = formatSEK(total);
  document.getElementById('checkout-total').textContent = formatSEK(total);

  const list = document.getElementById('cart-items');
  const checkout = document.getElementById('checkout-items');
  list.innerHTML = '';
  checkout.innerHTML = '';

  cart.forEach(c => {
    const p = byId[c.id];
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `<div><strong>${p.name}</strong><br><small>${c.qty} × ${formatSEK(p.price)}</small></div><button>Ta bort</button>`;
    row.querySelector('button').addEventListener('click', () => removeFromCart(c.id));
    list.appendChild(row);

    const cRow = document.createElement('p');
    cRow.textContent = `${p.name} — ${c.qty} × ${formatSEK(p.price)}`;
    checkout.appendChild(cRow);
  });
}

function openCart(open = true) {
  const d = document.getElementById('cart-drawer');
  d.classList.toggle('open', open);
  d.setAttribute('aria-hidden', String(!open));
}

function openProductModal(id) {
  const p = byId[id];
  if (!p) return;
  currentModalProduct = p.id;
  const dlg = document.getElementById('product-modal');
  document.getElementById('modal-kicker').textContent = p.label;
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.description;
  document.getElementById('modal-price').textContent = formatSEK(p.price);
  const gal = document.getElementById('modal-gallery');
  gal.innerHTML = '';
  p.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = p.name;
    gal.appendChild(img);
  });
  dlg.showModal();
}

function setupEvents() {
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('cart-btn').addEventListener('click', () => openCart(true));
  document.getElementById('cart-close').addEventListener('click', () => openCart(false));
  document.getElementById('go-checkout').addEventListener('click', () => {
    document.getElementById('checkout').hidden = false;
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    openCart(false);
  });
  document.getElementById('stripe-checkout').addEventListener('click', () => {
    if (!cart.length) return alert('Kundkorgen är tom.');
    const stripe = window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null;
    if (!stripe) return alert('Stripe kunde inte laddas.');
    window.location.href = 'https://checkout.stripe.com/pay/cs_test_placeholder';
  });
  document.getElementById('modal-close').addEventListener('click', () => document.getElementById('product-modal').close());
  document.getElementById('modal-add').addEventListener('click', () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct);
  });
}

renderGrid();
setupEvents();
updateCart();

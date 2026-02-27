const STORAGE_KEY = 'inkorrekt_cart_v1';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_placeholder';

const products = [
  { id: 'motljus', name: 'Motljus', meta: 'Skulpturallampa · 30 cm', description: 'Christer Pettersson-tema. Ansiktet inverteras i motljus — en konstnärlig tolkning av sanning och perception.', image: 'https://placehold.co/600x400/1a1a1a/gold?text=Motljus', price: 2495 },
  { id: 'figurine', name: 'Christer Pettersson-figurin', meta: 'Unik figurin', description: 'Säljs via Tradera. Detaljarbete i liten skala med rå finish och tydlig siluett.', image: 'https://placehold.co/600x400/1a1a1a/gold?text=Figurin', price: 995 },
  { id: 'packaging', name: 'HANTERAS VARSAMT – Christer Pettersson inside', meta: 'Signaturförpackning / grafik', description: 'Grafiskt objekt/förpackning som förstärker uttrycket och berättelsen kring verket.', image: 'https://placehold.co/600x400/1a1a1a/gold?text=Signaturförpackning', price: 395 },
  { id: 'busts', name: 'Byster & ansiktsskulpturer', meta: 'Beige/vit finish', description: 'Serie av ansikten och byster i ljus ton med textur, avsedda för mörk kontrasterande miljö.', image: 'https://placehold.co/600x400/1a1a1a/gold?text=Byster', price: 1495 }
];

const byId = Object.fromEntries(products.map(p => [p.id, p]));
let cart = loadCart();

function formatSEK(n) { return `${n.toLocaleString('sv-SE')} kr`; }
function loadCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }

function renderProducts() {
  const grid = document.getElementById('product-grid');
  const tpl = document.getElementById('product-card-template');
  products.forEach((p) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('img').src = p.image;
    node.querySelector('img').alt = p.name;
    node.querySelector('h3').textContent = p.name;
    node.querySelector('.meta').textContent = p.meta;
    node.querySelector('.desc').textContent = p.description;
    node.querySelector('.price').textContent = formatSEK(p.price);
    node.querySelector('.add-to-cart').addEventListener('click', () => addToCart(p.id));
    grid.appendChild(node);
  });
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);
  if (item) item.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  updateCartUI();
}

function cartTotals() {
  const count = cart.reduce((a, b) => a + b.qty, 0);
  const total = cart.reduce((a, b) => a + (byId[b.id]?.price || 0) * b.qty, 0);
  return { count, total };
}

function updateCartUI() {
  const { count, total } = cartTotals();
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = formatSEK(total);

  const cartItems = document.getElementById('cart-items');
  const checkoutItems = document.getElementById('checkout-items');
  cartItems.innerHTML = '';
  checkoutItems.innerHTML = '';

  cart.forEach((c) => {
    const p = byId[c.id];
    if (!p) return;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `<div><strong>${p.name}</strong><br><small>${c.qty} × ${formatSEK(p.price)}</small></div><button data-id="${c.id}">Ta bort</button>`;
    row.querySelector('button').addEventListener('click', () => removeFromCart(c.id));
    cartItems.appendChild(row);

    const cRow = document.createElement('p');
    cRow.textContent = `${p.name} — ${c.qty} × ${formatSEK(p.price)}`;
    checkoutItems.appendChild(cRow);
  });

  document.getElementById('checkout-total').textContent = formatSEK(total);
}

function openCart(open = true) {
  const drawer = document.getElementById('cart-drawer');
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
}

function setupCheckout() {
  document.getElementById('go-checkout').addEventListener('click', () => {
    document.getElementById('checkout').hidden = false;
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('stripe-checkout').addEventListener('click', async () => {
    if (!cart.length) return alert('Kundkorgen är tom.');

    // Static-site friendly structure: Stripe object initialized now;
    // redirect URL is placeholder until real Price IDs / Checkout Session endpoint is connected.
    const stripe = window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null;
    if (!stripe) return alert('Stripe kunde inte laddas.');

    const fallbackHostedCheckout = 'https://checkout.stripe.com/pay/cs_test_placeholder';
    window.location.href = fallbackHostedCheckout;
  });
}

function init() {
  renderProducts();
  updateCartUI();
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('cart-btn').addEventListener('click', () => openCart(true));
  document.getElementById('cart-close').addEventListener('click', () => openCart(false));
  setupCheckout();
}

init();

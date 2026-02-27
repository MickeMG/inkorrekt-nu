const products = [
  {
    name: "Motljus",
    meta: "Skulpturallampa · 30 cm",
    description: "Christer Pettersson-tema. Ansiktet inverteras i motljus — en konstnärlig tolkning av sanning och perception.",
    image: "https://placehold.co/600x400/1a1a1a/gold?text=Motljus"
  },
  {
    name: "Christer Pettersson-figurin",
    meta: "Handgjord figurin",
    description: "Säljs via Tradera. Detaljarbete i liten skala med rå finish och tydlig siluett.",
    image: "https://placehold.co/600x400/1a1a1a/gold?text=Figurin"
  },
  {
    name: "HANTERAS VARSAMT – Christer Pettersson inside",
    meta: "Signaturförpackning / grafik",
    description: "Grafiskt objekt/förpackning som förstärker uttrycket och berättelsen kring verket.",
    image: "https://placehold.co/600x400/1a1a1a/gold?text=Signaturförpackning"
  },
  {
    name: "Byster & ansiktsskulpturer",
    meta: "Beige/vit finish",
    description: "Serie av ansikten och byster i ljus ton med textur, avsedda för mörk kontrasterande miljö.",
    image: "https://placehold.co/600x400/1a1a1a/gold?text=Byster"
  }
];

const grid = document.getElementById('product-grid');
const tpl = document.getElementById('product-card-template');
products.forEach((p) => {
  const node = tpl.content.cloneNode(true);
  node.querySelector('img').src = p.image;
  node.querySelector('img').alt = p.name;
  node.querySelector('h3').textContent = p.name;
  node.querySelector('.meta').textContent = p.meta;
  node.querySelector('.desc').textContent = p.description;
  grid.appendChild(node);
});

document.getElementById('year').textContent = new Date().getFullYear();

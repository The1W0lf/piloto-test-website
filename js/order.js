(() => {
  const root = document.currentScript?.closest('#commander') || document.getElementById('commander');
  if (!root || root.dataset.orderInitialized === 'true') return;
  root.dataset.orderInitialized = 'true';

  const openButtons = document.querySelectorAll('[data-order-open]');
  const closeButton = root.querySelector('.po-close');
  const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let returnFocus;

  openButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));

  const openOrder = (event) => {
    if (event) event.preventDefault();
    returnFocus = event?.currentTarget || document.activeElement;
    root.hidden = false;
    document.body.classList.add('po-modal-open');
    openButtons.forEach((button) => button.setAttribute('aria-expanded', 'true'));
    root.querySelector('#pollito-order-title').focus();
  };

  const closeOrder = () => {
    root.hidden = true;
    document.body.classList.remove('po-modal-open');
    openButtons.forEach((button) => button.setAttribute('aria-expanded', 'false'));
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
  };

  openButtons.forEach((button) => button.addEventListener('click', openOrder));
  closeButton.addEventListener('click', closeOrder);
  root.addEventListener('click', (event) => { if (event.target === root) closeOrder(); });

  document.addEventListener('keydown', (event) => {
    if (root.hidden) return;
    if (event.key === 'Escape') {
      closeOrder();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(root.querySelectorAll(focusableSelector)).filter((element) => !element.closest('[hidden]'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const items = JSON.parse(root.querySelector('.po-data').textContent);
  const quantities = items.map(() => 0);
  const money = (value) => new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 2 }).format(value) + ' DH';
  const names = { all:'Tout', bokka:'Bokka', burgers:'Burgers', tacos:'Tacos', paninis:'Paninis', plats:'Plats', boissons:'Boissons' };
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const products = root.querySelector('.po-products');
  const controls = [];

  function picker(index, location) {
    const group = el('div', 'po-picker');
    const minus = el('button', '', '−');
    const plus = el('button', '', '+');
    const count = el('output', '', '0');
    [minus, plus].forEach((button) => { button.type = 'button'; });
    minus.setAttribute('aria-label', 'Retirer un ' + items[index].name);
    plus.setAttribute('aria-label', 'Ajouter un ' + items[index].name);
    count.setAttribute('aria-label', 'Quantité de ' + items[index].name);
    minus.dataset.index = plus.dataset.index = index;
    minus.dataset.delta = '-1';
    plus.dataset.delta = '1';
    minus.dataset.location = plus.dataset.location = location;
    group.append(minus, count, plus);
    controls.push({ index, minus, plus, count });
    return group;
  }

  const filters = root.querySelector('.po-filters');
  const categorySections = new Map();
  Object.keys(names).filter((key) => key !== 'all').forEach((key) => {
    const section = el('div', 'po-category-section');
    section.dataset.category = key;
    section.setAttribute('role', 'group');
    const heading = el('h3', 'po-category-title', names[key]);
    heading.id = 'po-category-' + key;
    section.setAttribute('aria-labelledby', heading.id);
    const grid = el('div', 'po-category-grid');
    items.forEach((item, index) => {
      if (item.category !== key) return;
      const card = el('article', 'po-product');
      card.dataset.category = item.category;
      const img = el('img');
      img.src = item.image;
      img.alt = '';
      img.loading = 'lazy';
      img.width = 72;
      img.height = 72;
      card.append(img, el('h3', '', item.name), el('p', 'po-price', money(item.price)), picker(index, 'product'));
      grid.append(card);
    });
    section.append(heading, grid);
    products.append(section);
    categorySections.set(key, section);
  });

  const filterButtons = new Map();
  const setActiveCategory = (key) => {
    filterButtons.forEach((button, buttonKey) => button.setAttribute('aria-pressed', String(buttonKey === key)));
  };

  Object.entries(names).forEach(([key, label]) => {
    const button = el('button', '', label);
    button.type = 'button';
    button.setAttribute('aria-pressed', String(key === 'all'));
    button.addEventListener('click', () => {
      setActiveCategory(key);
      const target = key === 'all' ? 0 : categorySections.get(key).offsetTop;
      products.scrollTo({ top: target, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    filters.append(button);
    filterButtons.set(key, button);
  });

  let scrollFrame;
  const syncCategoryToScroll = () => {
    scrollFrame = 0;
    if (products.scrollTop <= 8) {
      setActiveCategory('all');
      return;
    }
    if (products.scrollTop + products.clientHeight >= products.scrollHeight - 8) {
      setActiveCategory('boissons');
      return;
    }
    const marker = products.scrollTop + Math.min(120, products.clientHeight * .28);
    let current = 'bokka';
    categorySections.forEach((section, key) => { if (section.offsetTop <= marker) current = key; });
    setActiveCategory(current);
  };

  products.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncCategoryToScroll);
  }, { passive: true });

  const lines = root.querySelector('.po-lines');
  const rows = items.map((item, index) => {
    const row = el('li');
    const top = el('div', 'po-line-top');
    const subtotal = el('span');
    top.append(el('strong', '', item.name), subtotal);
    row.append(top, picker(index, 'cart'));
    lines.append(row);
    return { row, subtotal };
  });
  const send = root.querySelector('.po-send');

  function update() {
    let total = 0;
    let count = 0;
    const message = ['Bonjour Pollito Chicken !', 'Je souhaite commander :', ''];
    items.forEach((item, index) => {
      const qty = quantities[index];
      const subtotal = qty * item.price;
      total += subtotal;
      count += qty;
      rows[index].row.hidden = !qty;
      rows[index].subtotal.textContent = money(subtotal);
      if (qty) message.push(qty + ' × ' + item.name + ' — ' + money(item.price) + ' / unité — Sous-total : ' + money(subtotal));
    });
    controls.forEach(({ index, minus, plus, count: quantityOutput }) => {
      quantityOutput.value = String(quantities[index]);
      quantityOutput.textContent = String(quantities[index]);
      minus.disabled = quantities[index] === 0;
      plus.disabled = quantities[index] === 99;
    });
    root.querySelector('.po-empty').hidden = count > 0;
    root.querySelector('.po-total-value').textContent = money(total);
    send.setAttribute('aria-disabled', String(!count));
    if (count) {
      message.push('', 'Total : ' + money(total), 'Merci de confirmer la disponibilité et les éventuels frais de livraison.');
      send.href = 'https://wa.me/212645733161?text=' + encodeURIComponent(message.join('\n'));
    } else {
      send.removeAttribute('href');
    }
    root.querySelector('.po-status').textContent = count + ' article(s) dans votre commande. Total : ' + money(total);
  }

  root.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-delta]');
    if (!button || !root.contains(button)) return;
    const index = Number(button.dataset.index);
    quantities[index] = Math.max(0, Math.min(99, quantities[index] + Number(button.dataset.delta)));
    update();
    if (button.disabled || (button.dataset.location === 'cart' && quantities[index] === 0)) {
      const replacement = root.querySelector('button[data-location="product"][data-index="' + index + '"][data-delta="' + (quantities[index] === 99 ? '-1' : '1') + '"]');
      if (replacement && !replacement.closest('[hidden]')) replacement.focus();
      else filters.querySelector('button[aria-pressed="true"]').focus();
    }
  });

  send.addEventListener('click', (event) => {
    if (send.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });

  update();
})();

const itemInput = document.getElementById('item-input');
const priceInput = document.getElementById('price-input');
const addButton = document.getElementById('add-button');
const shoppingList = document.getElementById('shopping-list');
const totalPriceElement = document.getElementById('total-price');
const clearCompletedButton = document.getElementById('clear-completed');
const clearAllButton = document.getElementById('clear-all');

const STORAGE_KEY = 'shoppingListItems';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function createItemElement(item) {
  const listItem = document.createElement('li');
  listItem.className = item.completed ? 'completed' : '';
  listItem.dataset.id = item.id;

  const content = document.createElement('div');
  content.className = 'item-content';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = item.completed;
  checkbox.addEventListener('change', () => toggleCompleted(item.id));

  const text = document.createElement('span');
  text.className = 'item-text';
  text.textContent = item.text;

  content.append(checkbox, text);

  const priceLabel = document.createElement('span');
  priceLabel.className = 'item-price';
  priceLabel.textContent = formatCurrency(item.price);

  const actions = document.createElement('div');
  actions.className = 'item-actions';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remover';
  removeButton.addEventListener('click', () => removeItem(item.id));

  actions.appendChild(removeButton);
  listItem.append(content, priceLabel, actions);

  return listItem;
}

function renderItems() {
  shoppingList.innerHTML = '';

  if (items.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Sua lista está vazia. Adicione um item!';
    emptyMessage.style.color = '#6b7280';
    emptyMessage.style.padding = '16px';
    shoppingList.appendChild(emptyMessage);
    return;
  }

  items.forEach(item => shoppingList.appendChild(createItemElement(item)));
}

function calculateTotalCompleted() {
  return items.reduce((total, item) => {
    return total + (item.completed ? Number(item.price || 0) : 0);
  }, 0);
}

function updateTotalPrice() {
  totalPriceElement.textContent = formatCurrency(calculateTotalCompleted());
}

function addItem(text, price) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const parsedPrice = Number(price);
  const finalPrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;

  items.push({
    id: Date.now().toString(),
    text: trimmed,
    price: finalPrice,
    completed: false,
  });

  saveItems();
  renderItems();
  updateTotalPrice();
  itemInput.value = '';
  priceInput.value = '';
  itemInput.focus();
}

function toggleCompleted(id) {
  items = items.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
  saveItems();
  renderItems();
  updateTotalPrice();
}

function removeItem(id) {
  items = items.filter(item => item.id !== id);
  saveItems();
  renderItems();
  updateTotalPrice();
}

function clearCompleted() {
  items = items.filter(item => !item.completed);
  saveItems();
  renderItems();
  updateTotalPrice();
}

function clearAll() {
  if (!confirm('Tem certeza que deseja limpar toda a lista?')) {
    return;
  }
  items = [];
  saveItems();
  renderItems();
  updateTotalPrice();
}

addButton.addEventListener('click', () => addItem(itemInput.value, priceInput.value));
itemInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    addItem(itemInput.value, priceInput.value);
  }
});
priceInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    addItem(itemInput.value, priceInput.value);
  }
});
clearCompletedButton.addEventListener('click', clearCompleted);
clearAllButton.addEventListener('click', clearAll);

renderItems();
updateTotalPrice();

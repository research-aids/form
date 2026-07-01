/**
 * Item data structure for categories
 */
const itemData = {
  fruit: [
    { id: 'apple', name: 'Apple' },
    { id: 'banana', name: 'Banana' },
    { id: 'orange', name: 'Orange' },
    { id: 'grape', name: 'Grape' },
    { id: 'mango', name: 'Mango' }
  ],
  vegetable: [
    { id: 'carrot', name: 'Carrot' },
    { id: 'broccoli', name: 'Broccoli' },
    { id: 'spinach', name: 'Spinach' },
    { id: 'tomato', name: 'Tomato' },
    { id: 'cucumber', name: 'Cucumber' }
  ],
  grain: [
    { id: 'rice', name: 'Rice' },
    { id: 'wheat', name: 'Wheat' },
    { id: 'oats', name: 'Oats' },
    { id: 'barley', name: 'Barley' },
    { id: 'quinoa', name: 'Quinoa' }
  ]
};

/**
 * Application Controller
 */
class ListApp {
  constructor() {
    // Data model
    this.model = new ListModel();

    // DOM elements
    this.categorySelect = document.getElementById('category');
    this.itemSelect = document.getElementById('item');
    this.quantitySelect = document.getElementById('quantity');
    this.addBtn = document.getElementById('addBtn');
    this.itemList = document.getElementById('itemList');
    this.itemCount = document.getElementById('itemCount');
    this.clearBtn = document.getElementById('clearBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.totalItemsSpan = document.getElementById('totalItems');
    this.totalQuantitySpan = document.getElementById('totalQuantity');
    this.categoriesCountSpan = document.getElementById('categoriesCount');

    // Initialize
    this.init();
  }

  init() {
    // Event listeners for form
    this.categorySelect.addEventListener('change', (e) => this.handleCategoryChange(e));
    this.addBtn.addEventListener('click', () => this.handleAddItem());
    this.clearBtn.addEventListener('click', () => this.handleClear());
    this.exportBtn.addEventListener('click', () => this.handleExport());

    // Allow Enter key to add item
    this.quantitySelect.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleAddItem();
    });

    // Subscribe to model changes
    this.model.subscribe((event, data) => {
      this.handleModelChange(event, data);
    });

    // Initial render
    this.render();
  }

  /**
   * Handle category dropdown change
   */
  handleCategoryChange(e) {
    const category = e.target.value;

    if (!category) {
      this.itemSelect.disabled = true;
      this.itemSelect.innerHTML = '<option value="">-- Select Item --</option>';
      return;
    }

    // Populate item dropdown based on category
    const items = itemData[category] || [];
    this.itemSelect.innerHTML = '<option value="">-- Select Item --</option>' +
      items.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    this.itemSelect.disabled = false;
  }

  /**
   * Handle add item button click
   */
  handleAddItem() {
    const category = this.categorySelect.value;
    const itemId = this.itemSelect.value;
    const quantity = this.quantitySelect.value;

    if (!category || !itemId) {
      alert('Please select both category and item');
      return;
    }

    // Get item name from itemData
    const itemName = itemData[category].find(i => i.id === itemId)?.name || itemId;

    // Add to model
    this.model.addItem(category, itemName, quantity);

    // Reset form
    this.categorySelect.value = '';
    this.itemSelect.value = '';
    this.itemSelect.disabled = true;
    this.quantitySelect.value = '1';
  }

  /**
   * Handle model changes
   */
  handleModelChange(event, data) {
    console.log(`Model event: ${event}`, data);
    this.render();
  }

  /**
   * Remove item from list
   */
  removeItem(id) {
    this.model.removeItem(id);
  }

  /**
   * Update item quantity
   */
  updateQuantity(id, quantity) {
    this.model.updateItem(id, quantity);
  }

  /**
   * Clear all items
   */
  handleClear() {
    if (confirm('Are you sure you want to clear all items?')) {
      this.model.clear();
    }
  }

  /**
   * Export data as JSON
   */
  handleExport() {
    const data = this.model.toJSON();
    const json = JSON.stringify(data, null, 2);

    // Copy to clipboard
    navigator.clipboard.writeText(json).then(() => {
      alert('Data copied to clipboard!');
    }).catch(() => {
      // Fallback: download as file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopping-list-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    console.log('Exported data:', data);
  }

  /**
   * Render the list
   */
  render() {
    const items = this.model.getItems();
    const stats = this.model.getStats();

    // Update item count
    this.itemCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

    // Render items
    this.itemList.innerHTML = items.map(item => `
      <li class="list-item" data-id="${item.id}">
        <div class="item-content">
          <div class="item-info">
            <span class="item-name">${this.escapeHtml(item.item)}</span>
            <span class="item-category">${item.category}</span>
          </div>
          <div class="item-controls">
            <select class="quantity-input" data-id="${item.id}" onchange="app.updateQuantity(${item.id}, this.value)">
              ${[1, 2, 3, 5, 10].map(q => `<option value="${q}" ${q === item.quantity ? 'selected' : ''}>${q}</option>`).join('')}
            </select>
            <button class="btn-remove" onclick="app.removeItem(${item.id})">×</button>
          </div>
        </div>
      </li>
    `).join('');

    // Update statistics
    this.totalItemsSpan.textContent = stats.totalItems;
    this.totalQuantitySpan.textContent = stats.totalQuantity;
    this.categoriesCountSpan.textContent = stats.categories;
  }

  /**
   * Escape HTML to prevent injection
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new ListApp();
});

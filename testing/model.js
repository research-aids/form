/**
 * ListModel - Data model for managing list items
 */
class ListModel {
  constructor() {
    this.items = [];
    this.nextId = 1;
    this.listeners = [];
  }

  /**
   * Add a new item to the list
   */
  addItem(category, item, quantity) {
    if (!category || !item || !quantity) {
      console.warn('Cannot add item: missing required fields');
      return null;
    }

    const listItem = {
      id: this.nextId++,
      category,
      item,
      quantity: parseInt(quantity),
      timestamp: new Date()
    };

    this.items.push(listItem);
    this.notifyListeners('itemAdded', listItem);
    return listItem;
  }

  /**
   * Remove item by id
   */
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index > -1) {
      const removed = this.items.splice(index, 1)[0];
      this.notifyListeners('itemRemoved', removed);
      return true;
    }
    return false;
  }

  /**
   * Update item quantity
   */
  updateItem(id, quantity) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = parseInt(quantity);
      this.notifyListeners('itemUpdated', item);
      return true;
    }
    return false;
  }

  /**
   * Get all items
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get item by id
   */
  getItem(id) {
    return this.items.find(item => item.id === id);
  }

  /**
   * Clear all items
   */
  clear() {
    this.items = [];
    this.notifyListeners('cleared', null);
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalItems: this.items.length,
      totalQuantity: this.items.reduce((sum, item) => sum + item.quantity, 0),
      categories: new Set(this.items.map(item => item.category)).size,
      itemsByCategory: this.getItemsByCategory()
    };
  }

  /**
   * Get items grouped by category
   */
  getItemsByCategory() {
    const grouped = {};
    this.items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }

  /**
   * Export as JSON
   */
  toJSON() {
    return {
      items: this.items,
      stats: this.getStats(),
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Subscribe to model changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of changes
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      callback(event, data);
    });
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ListModel;
}

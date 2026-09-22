export interface CartItem {
  id: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
};

/**
 * Adds a product to the cart. `quantity` is applied in one write so a "5 x"
 * add from the product page does not fire five storage writes and five
 * cartUpdated events.
 */
export const addToCart = (
  product: { id: string; slug?: string; name: string; price: number; image: string },
  quantity = 1
): void => {
  const amount = Math.max(1, Math.floor(quantity));
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += amount;
  } else {
    cart.push({ ...product, quantity: amount });
  }

  saveCart(cart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const updateQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  }
};

export const clearCart = (): void => {
  saveCart([]);
  window.dispatchEvent(new Event('cartUpdated'));
};

export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

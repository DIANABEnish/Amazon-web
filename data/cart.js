export let cart;

export function loadCart(fun){
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load',()=>{
    console.log(xhr.response);
    fun();
  })
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}


export async function loadCartFetch(){
  const response = await fetch('https://supersimplebackend.dev/cart');
  const text = await response.text();
  console.log(text);
  return text;
}


// makes the cart empty after creating an order.
export function resetCart() {
  cart = [];
  saveToStorage();
}

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart')); 

  if (!cart) {
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}
// פונקציה חדשה שתוודא שלכל פריטי העגלה יש deliveryOptionId
export function ensureCartItemsHaveDeliveryOption() {
  let needsUpdate = false;
  
  cart.forEach(item => {
    if (!item.deliveryOptionId) {
      item.deliveryOptionId = '1';
      needsUpdate = true;
    }
  });
  
  if (needsUpdate) {
    saveToStorage();
  }
}


export function addToCart(productId, quantity) { // קבלת quantity כפרמטר
  let matchingItem;
  cart.forEach((item) => {
      if (productId === item.productId) {
          matchingItem = item;
      }
  });

  if (matchingItem) {
      matchingItem.quantity += quantity;
  } else {
      cart.push({
          productId: productId,
          quantity: quantity,
          deliveryOptionId: '1'
      });
  }

  saveToStorage();
}

export function removeFromCart(productId){
  let newCart = [];
  
  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  })
  
  cart = newCart;
  saveToStorage();
}

export function calculateCartQuntity(){
  let cartQuantity = 0;
  
  cart.forEach((item)=>{
    cartQuantity += item.quantity;
  });
  
  return cartQuantity;
}

export function updatetQuantity(productId, newQuantity){
  let matchingItem;
  
  cart.forEach((item)=>{
    if(productId === item.productId){
      matchingItem = item;
    }
  })
  
  matchingItem.quantity = newQuantity;
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;
  
  cart.forEach((item) => {
    if (productId === item.productId) {
      matchingItem = item;
    }
  });
  
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
import { getProduct, loadProductsFetch } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from './utils/money.js';
import { cart, addToCart } from '../data/cart.js';


function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = `${cartQuantity}`;
}


async function loadPage() {
    try {
        await loadProductsFetch();

        if (!orders || !Array.isArray(orders)) {
            console.error('No orders found');
            document.querySelector('.js-orders-grid').innerHTML = '<p>No orders to display</p>';
            return;
        }

        let ordersHTML = '';
        orders.forEach((order) => {
            if (!order || !order.products) {
                console.warn('Invalid order structure', order);
                return;
            }

            const orderTimeString = dayjs(order.orderTime).format('MMMM D');

            ordersHTML += `
                <div class="order-container">
                    <div class="order-header">
                        <div class="order-header-left-section">
                            <div class="order-date">
                                <div class="order-header-label">Order Placed:</div>
                                <div>${orderTimeString}</div>
                            </div>
                            <div class="order-total">
                                <div class="order-header-label">Total:</div>
                                <div>$${formatCurrency(order.totalCostCents)}</div>
                            </div>
                        </div>
                        <div class="order-header-right-section">
                            <div class="order-header-label">Order ID:</div>
                            <div>${order.id}</div>
                        </div>
                    </div>
                    <div class="order-details-grid">
                        ${productsListHTML(order)}
                    </div>
                </div>
            `;
        });

        function productsListHTML(order) {
            let productsListHTML = '';

            if (!order.products || !Array.isArray(order.products)) {
                console.warn('No products in order', order);
                return productsListHTML;
            }

            order.products.forEach((productDetails) => {
                if (!productDetails || !productDetails.productId) {
                    console.warn('Invalid product details', productDetails);
                    return;
                }

                const product = getProduct(productDetails.productId);

                if (!product) {
                    console.warn(`Product not found for ID: ${productDetails.productId}`);
                    return;
                }


                productsListHTML += `
                    <div class="product-image-container">
                        <img src="${product.image}">
                    </div>
                    <div class="product-details">
                        <div class="product-name">
                            ${product.name}
                        </div>
                        <div class="product-delivery-date">
                            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
                        </div>
                        <div class="product-quantity">
                            Quantity: ${productDetails.quantity}
                        </div>
                        <button class="buy-again-button button-primary js-buy-again"
                            data-product-id="${product.id}"
                            data-order-id="${order.id}">
                            <img class="buy-again-icon" src="images/icons/buy-again.png">
                            <span class="buy-again-message">Buy it again</span>
                        </button>
                    </div>
                    <div class="product-actions">
                        <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
                            <button class="track-package-button button-secondary js-track-package">
                                Track package
                            </button>
                        </a>
                    </div>
                `;
            });

            return productsListHTML;
        }


        updateCartQuantity();

        document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
    } catch (error) {
        console.error('Error loading orders:', error);
        document.querySelector('.js-orders-grid').innerHTML = '<p>Error loading orders. Please try again later.</p>';
    }

    
    document.querySelectorAll('.js-buy-again').forEach((button) => {
      button.addEventListener('click', () => {
          const productId = button.dataset.productId;
          const orderId = button.dataset.orderId;

          // קבלת ה-quantity מההזמנה המקורית
          const order = orders.find(order => order.id === orderId);
          const productDetails = order.products.find(product => product.productId === productId);
          const quantity = productDetails.quantity;

          // העברת ה-quantity לפונקציה addToCart
          addToCart(productId, quantity);
          updateCartQuantity();

          button.innerHTML = 'Added';
          setTimeout(() => {
              button.innerHTML = `
                  <img class="buy-again-icon" src="images/icons/buy-again.png">
                  <span class="buy-again-message">Buy it again</span>
              `;
          }, 1000);
          
      });
     
  });
 
}

loadPage();
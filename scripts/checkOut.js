import {  loadCartFetch } from "../data/cart.js";
import { loadProductsFetch } from "../data/products.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";



async function loadPage(){
  try{
       await Promise.all([

        loadProductsFetch(),

        loadCartFetch()
       ])
}

catch(error){
  console.log('Unexpected error. Please try again later.');
}

renderOrderSummary();
renderPaymentSummary();
}

loadPage();





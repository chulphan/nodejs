var express = require('express');
var cookieParser = require('cookie-parser');
var _ = require('underscore');
var app = express();
app.use(cookieParser('jjfiaowqqppe22#'));

var products = {
  1: { title: 'The history of web 1' },
  2: { title: 'The next web 1' }
};
app.get('/products', (req, res) => {

  var output = '';

  for (var product in products){
    output += `
          <li>
          <a href="/cart/${product}">${products[product].title}</a>
          </li>
          `;
  }
  console.log(products);
  res.send(`<h1>Product List</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});


app.get('/cart/:id', (req, res) => {
  var id = req.params.id;

  if (req.signedCookies.cart){
    var cart = req.signedCookies.cart;
  } else{
    var cart = {};
  }

  if (!cart[id]){
      cart[id] = 0;
  }

  cart[id] = parseInt(cart[id]) + 1;
  res.cookie('cart', cart, {signed : true});
  res.redirect('/cart');
});

app.get('/cart', (req, res) => {

  var cart = req.signedCookies.cart;

  if (!cart){
    res.send('Empty!');
  }else{
    var output = '';
    for (var name in cart){
      output += `
      <li>
        ${products[name].title} : ${cart[name]}
        <a href="/cart/${name}/delete">삭제</a>
      </li>`;
    }
  }
    console.log(cart);
  res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>
  `);
});

app.get('/cart/:id/delete', (req, res) => {
  var cart = req.signedCookies.cart;
  var id = req.params.id;

  var updatedCart = _.omit(cart, id);
  console.log(updatedCart)
  res.cookie('cart', updatedCart, { signed : true });
  res.redirect('/cart');
});

app.get('/count', (req, res) => {

  if(req.signedCookies.count)
    var count = parseInt(req.signedCookies.count);
  else
    var count = 0;
  res.cookie('count', count + 1, {signed:true});
  res.send('count : ' + count);
});

app.listen(8001, () => {
  console.log('Connected 8001 port');
});

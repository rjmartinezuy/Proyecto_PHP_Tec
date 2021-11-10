
//Carro de compras

var addToCart; // Here's the difference
var removeItem;
var loginUser; // Here's the difference
var registerUser; // Here's the difference
var comprar;
var fillCart;

var PATH = "http://"+location.host+"/proyecto_php_tec/";

$(document).ready(function () {
  registerUser = function (cedula, password, usuarionombre) {
  };


  fillCart = function (cart, ci) {
    console.log(cart);

    cart.forEach(product => {
      var productoprecio = product["precio"];
      var productoid = product["productoid"];
      var productonombre = product["productonombre"];
      var cantidad = product["cantidad"];
      var productodescripcion = product["productodescripcion"];

      var sumaPrecio = cantidad * productoprecio;
      console.log(product);
      var rutaImagen = product['imagen'].split('/').pop();
      var $newItem = $(`
      <li id="cart-content-${productoid}" class="cart-count-item">
          <a href="single-product.html" class="minicart-product-image">
              <img class ="cart-list-item" src="${PATH+'admin/productImages/'+productoid+'/'+rutaImagen}" alt="cart products">
          </a>
          <div class="minicart-product-details">
              <h6><a href="single-product.html">${productonombre} x ${cantidad}</a></h6>
              <span>${sumaPrecio}</span>
          </div>
          <button class="close" onClick="removeItem(${productoid},'${productonombre}','${productodescripcion}',${productoprecio},${cantidad},'${ci}');">
              <i class="fa fa-close"></i>
          </button>
      </li>`);

      $("#cart-content").append($newItem);
      var span = $("#cart-subtotal > span");
      console.log(span);
      console.log(span.text());

      var valueSubtotal = parseInt(span.text(), 10);
      valueSubtotal = valueSubtotal + sumaPrecio;
      span.text(valueSubtotal);
      var span1 = $(".cart-item-count");
      var value1 = parseInt(span1.text(), 10);
      value1 = value1 + 1;
      console.log("cat values" + value1);
      var priceOver = $(".item-text");
      priceOver.text(valueSubtotal);
      priceOver.append(`<span class="cart-item-count">${value1}</span>`);
      //cambia la cantidad de productos 

      var idnuevo = ".cantidad" + productoid;
      var cantProduct = $(idnuevo);
      console.log(cantProduct);
      var valueCant = parseInt(cantProduct.first().text(), 10);
      console.log(valueCant);

      valueCant = valueCant - 1;
      if (valueCant == 0) {
        cantProduct.text("vendido");
        cantProduct.addClass("stickersold").removeClass("sticker");
        let interactProduct = $(".interact" + productoid);
        $(".interact" + productoid).remove();

      } else {
        cantProduct.text(valueCant);
      }

    });
  };

  //carro
  addToCart = function (
    productoid,
    productonombre,
    productodescripcion,
    productoprecio,
    stock,
    ci
  ) {

    var urlAjax = PATH + 'includes/ajaxFunctions.php';
    var dataJson = {
      "addToCart": "set",
      "ci": ci,
      "precio": productoprecio,
      "idProduct": productoid,
    };
    $.ajax({
      url: urlAjax,
      type: 'post',
      dataType: "json",
      data: dataJson,
      success: function (response) {
        console.log(response);
        var cant = response['cantidad'];
        $("#cart-content-" + productoid).remove();
        var $newItem = $(`
    <li id="cart-content-${productoid}" class="cart-count-item">
        <a href="single-product.html" class="minicart-product-image">
            <img class ="cart-list-item" src="${PATH}images/product/small-size/1.jpg" alt="cart products">
        </a>
        <div class="minicart-product-details">
            <h6><a href="single-product.html">${productonombre} x ${cant}</a></h6>
            <span>$ ${productoprecio}</span>
        </div>
        <button class="close" onClick="removeItem(${productoid},${productonombre},${productodescripcion},${productoprecio},${stock},${ci});">
            <i class="fa fa-close"></i>
        </button>
    </li>`);

        $("#cart-content").append($newItem);
        var span = $("#cart-subtotal > span");
        console.log(span);
        console.log(span.text());

        var valueSubtotal = parseInt(span.text(), 10);
        valueSubtotal = valueSubtotal + productoprecio;
        span.text(valueSubtotal);
        var span1 = $(".cart-count-item");
        var value1 = span1.length;

        console.log("cat values" + value1);


        var priceOver = $(".item-text");
        priceOver.text(valueSubtotal);
        priceOver.append(`<span class="cart-item-count">${value1}</span>`);
        //cambia la cantidad de productos 

        var idnuevo = ".cantidad" + productoid;
        var cantProduct = $(idnuevo);
        console.log(cantProduct);
        var valueCant = parseInt(cantProduct.first().text(), 10);
        console.log(valueCant);

        valueCant = valueCant - 1;
        if (valueCant == 0) {
          cantProduct.text("vendido");
          cantProduct.addClass("stickersold").removeClass("sticker");
          let interactProduct = $(".interact" + productoid);
          $(".interact" + productoid).remove();

        } else {
          cantProduct.text(valueCant);
        }

        console.log("cantidad :" + cantProduct.text());
      }
    },
    );
  };

  removeItem = function (
    productoid,
    productonombre,
    productodescripcion,
    productoprecio,
    stock,
    ci
  ) {

    console.log("EJECUTA 1 VEZ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    var urlAjax = PATH + 'includes/ajaxFunctions.php';
    var dataJson = {
      "removeItem": "set",
      "ci": ci,
      "precio": productoprecio,
      "idProduct": productoid,
    };
    $.ajax({
      url: urlAjax,
      type: 'post',
      dataType: "json",
      data: dataJson,
      success: function (response) {
        console.log(response);

        $("#cart-content-" + productoid).remove();
        var $newItem = $(`
        <li id="cart-content-${productoid}" class="cart-count-item">
        <a href="single-product.html" class="minicart-product-image">
            <img class ="cart-list-item" src="${PATH}images/product/small-size/1.jpg" alt="cart products">
        </a>
        <div class="minicart-product-details">
            <h6><a>${productonombre} x ${response["resultado"]}</a></h6>
            <span>$ ${productoprecio}</span>
        </div>
        <button class="close" onClick="removeItem(${productoid},'${productonombre}','${productodescripcion}'',${productoprecio},${stock},'${ci}');">
            <i class="fa fa-close"></i>
        </button>
        </li>`);

        $("#cart-content").append($newItem);
        var span = $("#cart-subtotal > span");
        console.log(span);
        console.log(span.text());

        var valueSubtotal = parseInt(span.text(), 10);
        valueSubtotal = valueSubtotal + productoprecio;
        span.text(valueSubtotal);
        var span1 = $(".cart-count-item");
        var value1 = span1.length;

        console.log("cat values" + value1);


        var priceOver = $(".item-text");
        priceOver.text(valueSubtotal);
        priceOver.append(`<span class="cart-item-count">${value1}</span>`);


        //cambia la cantidad de productos 

        var idnuevo = ".cantidad" + productoid;
        var cantProduct = $(idnuevo);
        console.log(cantProduct);
        var valueCant = parseInt(cantProduct.first().text(), 10);
        console.log(valueCant);

        valueCant = valueCant - 1;
        if (valueCant == 0) {
          cantProduct.text("vendido");
          cantProduct.addClass("stickersold").removeClass("sticker");
          let interactProduct = $(".interact" + productoid);
          $(".interact" + productoid).remove();

        } else {
          cantProduct.text(valueCant);
        }
        console.log("cantidad :" + cantProduct.text());
      }
    });
  }

  comprar = function (ci, metodopago, dirEnvio, dirFacturacion, improtetotal) {

    console.log("EJECUTA 1 VEZ COMPRA !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    console.log(ci);
    console.log(metodopago);
    console.log(dirEnvio);
    console.log(dirFacturacion);
    console.log(improtetotal);

    var urlAjax = PATH + 'includes/ajaxFunctions.php';

    console.log($('#direccion_envio'));

    var dataJson = {
      "comprar": "set",
      "ci": ci,
      "metodopago": metodopago,
      "dirEnvio": dirEnvio,
      "dirFacturacion": dirFacturacion,
      "improtetotal": improtetotal,
    };
    console.log(dataJson);

    $.ajax({
      url: urlAjax,
      type: 'post',
      dataType: "json",
      data: dataJson,
      success: function (response) {
        console.log(response);
        window.location.href = PATH + "main"
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("Status: " + textStatus);
        console.log("Error: " + errorThrown);
      }
    });
  }

});




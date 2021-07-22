var activeUsersInterval;
var messagesInterval;

$('#root').load('views/display_products.html', product_functions);

let isSession_active = '';
$.ajax({
    type: 'GET',
    url: 'process/session_check.php',
    success: function(response){
        isSession_active = response;
    }
});

$('#messageBtn').click(function(){
    $('#root').load('views/display_messages.html', messageFunctions);
});

$('#homeBtn').click(function(){
    $('#root').load('views/display_products.html', product_functions);
});

$('#shoppingcart').click(function(){
    $('#root').load('views/display_cart.html', cart_functions);
});

$('#wishlistBtn').click(function(){
    $('#root').load('views/display_wishlist.html', wishlist_functions);
});

$('#historyBtn').click(function(){
    $('#root').load('process/get_history.php', function(){
        clearInterval(activeUsersInterval);
        clearInterval(messagesInterval);
    });
});

$(document).mouseup(function(e){
    let container = $('#suggestions');
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
});
// for processing products-----------------------------------------------------
function product_functions(){
    clearInterval(activeUsersInterval);
    clearInterval(messagesInterval);
    get_products();
}

function get_products(){
    $.ajax({
        type: 'GET',
        url: 'process/get_products.php',
        success: (response) => {
            let products = JSON.parse(response);
            let page = 1;
            let products_arr = [];
            for (let i = 0; i < products.product.length; i++) {
                let product = products.product[i];
                products_arr.push(product);
            }
            load_pages(products_arr, page);
            filter_products(products_arr);
        }
    });
}

function load_pages(products, page){
    let product_count = products.length;
    let page_lis = Math.round(product_count/6);
    let html = '';
    for (let i = 0; i < page_lis; i++) {
            html += '<b class="page">' + parseInt(i + 1) + '</b>';
    }
    $('.pagination').html(html);
    // pre loading before clicking any of pagination
    load_products(products, page);

    $('.page').click(function(){
        page = $(this).html();
        $(this).css({backgroundColor: "lightBlue"});
        $('.page').not(this).css({backgroundColor: "transparent"});
        load_products(products, page);
    });
}

function load_products(products, page){
    let products_to_load = 6;
    let starting_product = parseInt(page * products_to_load - (products_to_load - 1));
    let ending_product = (products_to_load + starting_product) - 1;

    let html = ''
    let three = 0; //three cards per row
    for (let i = starting_product-1; i < ending_product; i++){
        let product = products[i];
        if(product == undefined){
            break;
        }
        
        let code = product['@attributes'].code;
        let name = product['productName'];
        let price = product['productPrice'];
        let category = product['productCategory'];
        let quantity = product['productQuantity'];
        let image = product['productImage'];

        if(three == 0){
            html += '<div id="product_container">'; 
        }

        html += '<div class="card_product">' +
                    '<div class="name"><h4>' + name + '</h4></div>' +
                        '<img src=\"' + image + '\" height="auto" width="200px" class="image">' +
                        '<div class="info_product">' +
                            'Php <div class="price">' + price + '</div>' +
                            '<div class="category">' + category + '</div>' +
                            'Stock: <div class="stock">' + quantity + '</div>' +
                        '</div>' +
                    '<input type="number" class="qty" value="1" min="1" max=\"' + quantity + '\" onkeydown="return false;">' +
                    '<div class="actions_product">' +
                        '<button class="addToCart" value=\"' + code + '\">add to cart</button>' +
                        '<button class="addToWishlist" value=\"' + code + '\">add to wishlist</button>' +
                    '</div>' +
                '</div>'

        three = parseInt(three) + 1;
        if(three == 3){
            html += '</div>';
            three = 0;
        }
    }
    $('#products_field').html(html);
    if(isSession_active == 'session_active'){
        product_actions();
    }
}

function filter_products(products){
    $('#clear_btn').click(function(){
        $('#search_input').val('');
        $('input[id="all"]').prop('checked', true);
        let page = 1;
        load_pages(products, page);
        load_products(products, page);
    });

    $('#search_input').click(function(){
        let html = '';
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            html += '<div class="suggestion">'+  product["productName"] +'</div>';
        }
        $('#suggestions').css({display: "block"});
        $('#suggestions').html(html);
        $(this).keyup(function(){
            let search = $(this).val();
            let rgxp = new RegExp(search.trim(), "gi");
            html = '';
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if(product['productName'].match(rgxp)){
                    html += '<div class="suggestion">'+ product["productName"] +'</div>';
                }
            }
            $('#suggestions').html(html);
            click_product(products);
        });
        click_product(products);
    });

    $('#search_btn, .category').click(function(){
        filter_process(products);
    });
}

function filter_process(products){
    let search = $('#search_input').val();
    let rgxp = new RegExp(search.trim(), "gi");
    category = $('.category:checked').val();
    let products_filtered = [];
    let product_count = products.length;
        for (let i = 0; i < product_count; i++) { 
            let product = products[i];
            if(product['productName'].match(rgxp)){
                if(product['productCategory'] == category){
                    products_filtered.push(product);
                }
                if(category == 'All'){
                    products_filtered.push(product);
                }
            }
        }
        let page = 1;
        load_pages(products_filtered, page);
        load_products(products_filtered, page);
}

function click_product(products){
    $('.suggestion').click(function(){
        let product_clicked = [];
        $('input[id="all"]').prop('checked', true);
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            if(product['productName'].match($(this).html())){
                product_clicked.push(product);
                $('#search_input').val(product['productName']);
                filter_process(product_clicked);
                break;
            }
        }
        $('#suggestions').css({display: "none"});
    });
}

function product_actions(){
    let html = '';
    $('.addToCart').click(function(){
        let i = $('.addToCart').index(this);
        $.ajax({
            type: 'GET',
            url: 'process/add_to_cart.php',
            data: {
                product: $(this).val(),
                name: $('.name h4')[i].innerHTML,
                price: $('.price')[i].innerHTML,
                category: $('.info_product > .category')[i].innerHTML,
                image: $('.image').eq(i).attr('src'),
                qty: $('input[type="number"]')[i].value,
            },
            success: function(response){
                switch (response) {
                    case 'Success':
                        html = '';
                        break;
                
                    case 'Failed':
                        html = '<div class="alert warning">'+
                        '<strong>Out of stock!</strong> ' +
                        '</div>'
                        break;
                }
                $('.alerts').html(html);
                setTimeout(function(){
                    $('.alert').css({opacity: "0"});
                }, 600);
            }
        });
    });

    $('.addToWishlist').click(function(){
        let i = $('.addToWishlist').index(this);
        $(this).attr('disabled', true);
        $.ajax({
            type: 'GET',
            url: 'process/add_to_wishlist.php',
            data: {
                product: $(this).val(),
                name: $('.name h4')[i].innerHTML,
                price: $('.price')[i].innerHTML,
                category: $('.info_product > .category')[i].innerHTML,
                image: $('.image').eq(i).attr('src'),
            },
            success: function(response){
                switch (response) {
                    case 'existing':
                        html = '<div class="alert warning">'+
                        '<strong>Already on the WISHLIST!</strong> ' +
                        '</div>'
                        break;
                
                    case 'available':
                        html = '<div class="alert success">'+
                        '<strong>Added to WISHLIST.</strong> ' +
                        '</div>'
                        break;
                }
                $('.alerts').html(html);
                setTimeout(function(){
                    $('.alert').css({opacity: "0"});
                }, 600);
            }
        });
    });
}

// for processing cart contents-------------------------------------------------
function cart_functions(){
    clearInterval(activeUsersInterval);
    clearInterval(messagesInterval);
    get_cart();
}

function get_cart(){
    $.ajax({
        type: 'GET',
        url: 'process/get_cart.php',
        success: (response) => {
            let cart_contents = JSON.parse(response);
            let cart_contents_arr = [];
            try{
                if (cart_contents.product.length == null) {
                    cart_contents_arr.push(cart_contents.product);
                }else{
                    for (let i = 0; i < cart_contents.product.length; i++) {
                        let cart_content = cart_contents.product[i];
                        cart_contents_arr.push(cart_content);
                    }
                }
            }catch{}
            load_cart_contents(cart_contents_arr);
        }
    });
}

function load_cart_contents(cart_contents){
    let html = '';
    for (let i = 0; i < cart_contents.length; i++) {
        let cart_content = cart_contents[i];
        let code = cart_content['@attributes'].code;
        let name = cart_content['productName'];
        let price = cart_content['productPrice'];
        let category = cart_content['productCategory'];
        let quantity = cart_content['productQuantity'];
        let image = cart_content['productImage'];
        var prodprice = price*quantity;
        html += "<div id='cart'> <input type='checkbox' value=\""+ code + "\">" +
                "<img src=\"" + image + "\" id='prodImg'>" +
                "<div id='prodInfo'> <p id='prodName'>" + name + "</p>" +
                "<p id='prodCategory'>" + category + "</p>" +
                "<div id='money'><input type='number' value=\"" + quantity + "\" id='prodQty' min='1' onkeydown='return false;'>" +
                "<input type='button' value='Confirm' class='changeQty'>" +
                "<p id='prodPrice'> " + prodprice + "</p></div></div></div>"
    }
    $('#cartContents').html(html);
    cart_actions();
}

function cart_actions(){
    $('input[type="checkbox"]').click(function(){
        let total = 0;
        $('input[type="checkbox"]:checked').not('#selectAll').each(function(){
            let i = $('input[type="checkbox"]').index(this);
            let prices = document.querySelectorAll('#prodPrice');
            total += parseInt(prices[i].innerHTML);
        });
        $('#total').html(total);
    }); 

    $('input#selectAll').click(function(){
        let checkboxes = $('input[type="checkbox"]').not('#selectAll');
        let prices = document.querySelectorAll('#prodPrice');
        if($(this).is(':checked')){
            let total = 0;
            for(var i = 0; i < checkboxes.length; i++){
                checkboxes[i].checked = this.checked;
                total += parseInt(prices[i].innerHTML);
            }
            $('#total').html(total);
        }else{
            for(var i = 0; i < checkboxes.length; i++){
                checkboxes[i].checked = this.unchecked;
            }
            $('#total').html(0);
        }
    });

    $('#trashBtn').click(function(){
        if($('#total').html() != '0'){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    let deleteProductArr = [];
                    $('input[type="checkbox"]:checked').not('#selectAll').each(function(){
                        deleteProductArr.push(this.value);
                        });
                        $.ajax({
                            type: 'GET',
                            url: 'process/delete_cart_product.php',
                            data: {
                                deleteArr: JSON.stringify(deleteProductArr),
                            },
                            success: function(response){
                                $('#total').html(0);
                                get_cart();
                            }
                        });
                }
              });
        }
    });

    $('.changeQty').click(function(){
        let quantities = document.querySelectorAll('#prodQty');
        let i = $('.changeQty').index(this);
        $.ajax({
            type: 'GET',
            url: 'process/change_quantity.php',
            data: {
                productCode: $('input[type="checkbox"]')[i].value,
                quantity: quantities[i].value,
            },
            success: function(){
                get_cart();
                $('#total').html(0);
            }
        });
    });

    $('#checkoutBtn').click(function(){
        if($('#total').html() != '0'){
            let purchaseProductArr = [];
            $('input[type="checkbox"]:checked').not('#selectAll').each(function(){
                purchaseProductArr.push(this.value);
            });
            $.ajax({
                type: 'GET',
                url: 'process/summary_purchase.php',
                data: {
                    purchaseArr: JSON.stringify(purchaseProductArr),
                    total: $('#total').html(),
                },
                success: function(response){
                    $('#root').load('views/summary_purchase.html', function(){
                        $('#purchasesGoHere').html(response);
                        confirmPurchase();
                    });
                }
            });
        }
    });
}

//confirming purchase
function confirmPurchase(){
    $('.confirmCheckout').click(function(){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Purchase successful!',
            text: 'Check your purchases on PURCHASE HISTORY.',
            showConfirmButton: true,
          }).then((result) =>{
              if(result.isConfirmed){
                address = $('#ownerAddress').val();
                payment_method = $('input[name="payment_method"]:checked').val();
                total = $('#total').html();
                code = document.querySelectorAll('#prodCode');
                let prodCodeArr = [];
                for (let i = 0; i < code.length; i++) {
                    prodCodeArr.push(code[i].innerHTML);
                }
                $.ajax({
                    type: 'GET',
                    url: 'process/confirm_purchase.php',
                    data: {
                        ownerAddress: address,
                        payment_method: payment_method,
                        total: total,
                        productCodeArr: JSON.stringify(prodCodeArr),
                    },
                    success: function(){
                        window.location.reload();
                    }
                });
              }
          });
    });
}

//for processing wishlist contents----------------------------------------------
function wishlist_functions(){
    clearInterval(activeUsersInterval);
    clearInterval(messagesInterval);
    get_wishlist();
}

function get_wishlist(){
    $.ajax({
        type: 'GET',
        url: 'process/get_wishlist.php',
        success: (response) => {
            let wishlist_contents = JSON.parse(response);
            let wishlist_contents_arr = [];
            try{
                if (wishlist_contents.product.length == null) {
                    wishlist_contents_arr.push(wishlist_contents.product);
                }else{
                    for (let i = 0; i < wishlist_contents.product.length; i++) {
                        let wishlist_content = wishlist_contents.product[i];
                        wishlist_contents_arr.push(wishlist_content);
                    }
                }
            }catch{}
            load_wishlist_contents(wishlist_contents_arr);
        }
    });
}

function load_wishlist_contents(wishlist_contents){
    let html = '';
    for(let i = 0; i < wishlist_contents.length; i++) {
        let wishlist_content = wishlist_contents[i];
        let code = wishlist_content['@attributes'].code;
        let name = wishlist_content['name'];
        let price = wishlist_content['price'];
        let category = wishlist_content['category'];
        let image = wishlist_content['image'];

        html += "<div id='cart'> <input type='checkbox' value=\""+ code + "\">"+
                "<img src=\"" + image + "\" id='prodImg' class='image'>"+
                "<div id='prodInfo'> <p id='prodName'>" + name + "</p>"+
                "<p id='prodCategory'>" + category + "</p>"+
                "<div id='money'> <p id='prodPrice'> " + price + "</p></div></div></div>"
    }
    $('#cartContents').html(html);
    cart_actions();
    wishlist_actions();
}

function wishlist_actions(){
        //from wishlist add to cart
        $('#addToCartBtn').click(function(){
            var html = '';
            if($('#total').html() != '0'){
                let name = document.querySelectorAll('#prodName');
                let price = document.querySelectorAll('#prodPrice');
                let category = document.querySelectorAll('#prodCategory');
                $('input[type="checkbox"]:checked').not('#selectAll').each(function(){
                    let i = $('input[type="checkbox"]').index(this);
                    $.ajax({
                        type: 'GET',
                        url: 'process/add_to_cart.php',
                        data: {
                            product: this.value,
                            name: name[i].innerHTML,
                            price: price[i].innerHTML,
                            category: category[i].innerHTML,
                            image: $('.image').eq(i).attr('src'),
                            qty: '1',
                        },
                        success: function(response){
                            switch (response) {
                                case 'Success':
                                    html += '<div class="alert success">'+
                                    '<span class="closebtn">&times;</span>'+
                                    '<strong>Added to cart!</strong> '+ name[i].innerHTML +
                                    '</div>'
                                    break;
                            
                                default:
                                    html += '<div class="alert warning">'+
                                    '<span class="closebtn">&times;</span>'+
                                    '<strong>Out of stock! not added.</strong> '+ name[i].innerHTML +
                                    '</div>'
                                    break;
                            } 
                            $('.alerts').html(html);
                            
                            $('.closebtn').click(function(){
                                let i = $('.closebtn').index(this);
                                $('.alert').eq(i).css({opacity: "0"});
                                setTimeout(function(){ 
                                    $('.alert').eq(i).css({display: "none"});
                                }, 600);
                            }); 
                        }
                    }); 
                }); 
            }
        });
    //removes items from wishlist
    $('#removeFromWishlist').click(function(){
        if($('#total').html() != '0'){
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) =>{
                if(result.isConfirmed){
                    let removeProduct = [];
                    $('input[type="checkbox"]:checked').not('#selectAll').each(function(){
                        removeProduct.push(this.value);
                        });
                        $.ajax({
                            type: 'GET',
                            url: 'process/delete_wishlist_product.php',
                            data: {
                                removeArr: JSON.stringify(removeProduct),
                            },
                            success: function(response){
                                $('#total').html(0);
                                get_wishlist();
                            }
                        });
                }
              });
        }
    });
}

//for messasging----------------------------------------------------------------
function messageFunctions(){
    activeUsersInterval = setInterval(() => {
        $.ajax({
            type: 'GET',
            url: 'message_process/getActiveUsers.php',
            data: {},
            success: function(response){
                $('#activeUsers').html(response);
            }
        });
    }, 6000);

    $('#sendbutton').click(function(){
        var msg = $('#msg').val();
        var receiver = $('#receiver').html();
        console.log(receiver);
        $.ajax({
            type: 'GET',
            url: 'message_process/sendMessage.php',
            data: {
                msg: msg,
                receiver: receiver,
            },
            success: function(){
                $('#msg').val('');
            }
        });
    });
}

function clickUser(receiverUname){
    $('#sendingMessageArea').css({display: "block"});
    $('#conversationView').css({
        display: "block",
        display: "flex"
    });
    $('#receiver').html(receiverUname);
    loadMessages();
}

function loadMessages(){
    messagesInterval = setInterval(function (){
        var receiver = $('#receiver').html();  
        $.ajax({
            type: 'GET',
            url: 'message_process/loadMessages.php',
            data: {
                receiver: receiver,
            },
            success: function(response){
                $('#conversationView').html(response);
            }
        });
    }, 3000);
}




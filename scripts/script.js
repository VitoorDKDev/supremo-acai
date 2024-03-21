const mainMenu = document.getElementById("menu")
const cartModal = document.getElementById("cart-modal")
const cartItems = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutButton = document.getElementById("checkout-button")
const closeModalButton = document.getElementById("close-button")
const openCartButton = document.getElementById("open-cart-button")
const cartCounter = document.getElementById("cart-counter")
const addressInput = document.getElementById("address")
const adressError = document.getElementById("adress-error")
let cart = [];

openCartButton.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

closeModalButton.addEventListener("click", function () {
    cartModal.style.display = "none"
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

mainMenu.addEventListener("click", function (event) {

    let parentIcon = event.target.closest(".add-to-cart")
    if (parentIcon) {
        const itemName = parentIcon.getAttribute("data-name")
        const itemPrice = parseFloat(parentIcon.getAttribute("data-price"))
        addItemToCart(itemName, itemPrice)
    }
})

function addItemToCart(itemName, itemPrice) {
    const hasItem = cart.find(item => item.itemName === itemName)

    if (hasItem) {
        hasItem.quantity += 1;
    } else {
        cart.push({
            itemName,
            itemPrice,
            quantity: 1,
        })
    }
    sendToastify("Item adicionado na sacola", "#228B22")
    updateCartModal();
}

function updateCartModal() {
    cartItems.innerHTML = "";
    cartItems.classList.add("flex", "justify-between", "mb-4", "flex-col")
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.innerHTML = `

        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.itemName}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.itemPrice.toFixed(2)}</p>
            </div>

            <button class="remove-cart-button" data-name="${item.itemName}">Remover</button>

        </div>
        `
        total += item.itemPrice * item.quantity
        cartItems.appendChild(cartItemElement)
    })
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-cart-button")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.itemName === name);

    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
        }else{
            cart.splice(index, 1)
            updateCartModal();
            cartModal.style.display = "none";
        }
    }
}

addressInput.addEventListener("input", function(event){
    let input = event.target.value;
    if(input.value!==""){
        addressInput.classList.remove("border-red-500")
        adressError.classList.add("hidden")
    }
})

checkoutButton.addEventListener("click", function(){
    if(!isOpen){
        sendToastify("O restaurante está fechado!", "#EF4444")
        return;
    }

    if(cart.length===0)
        return;
    if(addressInput.value===""){
        adressError.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    const cartItemsCheckout = cart.map((item)=>{
        return(
            `${item.itemName} Quantidade: ${item.quantity} Preço: R$
            ${item.itemPrice} |`
        )
    }).join("")

    const whatsMessage = encodeURIComponent(cartItemsCheckout)
    const number = "+5534991025658"

    window.open(`https://wa.me/${number}?text=${whatsMessage} Endereço: ${addressInput.value}`)
    cart=[];
    updateCartModal();
})

function checkOpen(){
    const date = new Date();
    const hours = date.getHours();
    return hours >= 11 && hours < 23;
}

const openCloseSpam = document.getElementById("open-close-spam");
const openCloseText = document.getElementById("open-close-text");
const isOpen = checkOpen();

if(isOpen){
    openCloseSpam.classList.add("bg-green-600")
    openCloseSpam.classList.remove("bg-red-500")
    openCloseText.innerText = "EM FUNCIONAMENTO";
}else{
    openCloseSpam.classList.remove("bg-green-600")
    openCloseSpam.classList.add("bg-red-500")
    openCloseText.innerText = "LOJA FECHADA";
}

function sendToastify(message, color){
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: color,
            },
            onClick: function(){} // Callback after click
          }).showToast();
}
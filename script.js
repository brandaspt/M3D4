// Global DOM Elements
const filterInput = document.getElementById("filter-input")
const filterBtn = document.getElementById("filter-btn")

const cartSection = document.getElementById("cart-section")

const booksGrid = document.getElementById("books-grid")

// Global Variables
let booksCollection = []
const cartBooks = []

// Fetch API
fetch("https://striveschool-api.herokuapp.com/books")
  .then((response) => response.json())
  .then((books) => {
    console.log(books)
    booksCollection = books
    renderBookCollection(booksCollection)

    // Add event listener to filter btn
    filterBtn.addEventListener("click", filterCollection)
  })
  .catch((err) => console.log(err))

// Render Books Function
const renderBookCollection = (arrayOfBooks) => {
  booksGrid.innerHTML = arrayOfBooks
    .map(
      (book) => `
  <div class="col">
              <div class="card h-100">
                <img src="${book.img}" class="card-img-top" alt="book cover" />
                <div class="card-body d-flex flex-column justify-content-between">
                  <h5 class="card-title text-center">${book.title}</h5>
                  <div class="d-flex justify-content-between align-items-center">
                    <button data-asin="${book.asin}" type="button" class="btn btn-outline-primary btn-sm add-to-cart-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
</svg></button>
                    <p class="card-text price">$${book.price}</p>
                  </div>                  
                </div>
                <button type="button" class="btn btn-outline-danger btn-sm ignore-book-btn">Ignore</button>
              </div>
            </div>
  `
    )
    .join("")
  // Add event listeners to add to cart btns
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
  addToCartBtns.forEach((btn) => btn.addEventListener("click", addBookToCart))

  // Add event listeners to ignore book btns
  const ignoreBookBtns = document.querySelectorAll(".ignore-book-btn")
  ignoreBookBtns.forEach((btn) => btn.addEventListener("click", ignoreBook))
}

// Add book to cark function
function addBookToCart() {
  // Change button
  this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-check-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zm-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
</svg>`
  this.classList.remove("btn-outline-primary")
  this.classList.add("btn-success")

  const bookAsin = this.dataset.asin
  const bookToAdd = booksCollection.find((book) => book.asin === bookAsin)
  if (cartBooks.some((book) => book.asin === bookAsin)) {
    cartBooks.forEach((book) => {
      if (book.asin === bookAsin) {
        book.quantity++
      }
    })
  } else {
    cartBooks.push({
      title: bookToAdd.title,
      asin: bookAsin,
      price: bookToAdd.price,
      quantity: 1,
    })
  }
  console.log(cartBooks)
  renderCart(cartBooks)
}

// Render cart section function
const renderCart = (arrayOfCards) => {
  cartSection.innerHTML = arrayOfCards
    .map(
      (book) => `
  <div class="d-flex flex-column">
    <p class="mb-0 mt-4">${book.title}</p>
    <div class="d-flex justify-content-end align-items-baseline">
      <p class="m-0 me-2 text-success">${book.quantity} x ${book.price}</p>
      <span data-asin="${book.asin}"  class="d-flex align-items-center remove-from-cart-btn text-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-dash-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM6 9.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"/>
</svg></span>

    </div>
  </div>
  `
    )
    .join("")

  cartSection.innerHTML += `
  <hr>
  <div class="d-flex justify-content-between align-items-center">
    <h3 class="m-0">Total</h3>
    <h4 class="m-0">${arrayOfCards
      .reduce((acc, curr) => acc + curr.price * curr.quantity, 0)
      .toFixed(2)}</h4>
  </div>
  <button id="empty-cart-btn" type="button" class="btn btn-danger btn-sm mt-2">Empty Cart</button>
  `

  // Add event listeners to remove from cart btns
  cartSection
    .querySelectorAll(".remove-from-cart-btn")
    .forEach((btn) => btn.addEventListener("click", removeFromCart))

  // Add event listeners to empty cart btn
  cartSection
    .querySelector("#empty-cart-btn")
    .addEventListener("click", emptyCart)
}

// Filter collection function
const filterCollection = () => {
  const query = filterInput.value.toLowerCase()
  if (query.length > 3) {
    const filteredCollection = booksCollection.filter((book) =>
      book.title.toLowerCase().includes(query)
    )
    renderBookCollection(filteredCollection)
  } else {
    renderBookCollection(booksCollection)
  }
}

// Ignore book function
function ignoreBook() {
  this.closest(".col").remove()
}

// Remove book from cart function
function removeFromCart() {
  const bookAsin = this.dataset.asin
  const index = cartBooks.findIndex((book) => book.asin === bookAsin)
  if (cartBooks[index].quantity < 2) {
    // Update add to cart buttons
    const booksGridBtn = booksGrid.querySelector(
      `[data-asin="${cartBooks[index].asin}"]`
    )
    booksGridBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
</svg>`
    booksGridBtn.classList.remove("btn-success")
    booksGridBtn.classList.add("btn-outline-primary")
    // Remove book from cartBooks array
    cartBooks.splice(index, 1)
  } else {
    cartBooks[index].quantity--
  }
  renderCart(cartBooks)
}

// Empty cart function
const emptyCart = () => {
  cartBooks.splice(0)
  renderCart(cartBooks)
  booksGridBtns = document.querySelectorAll(".add-to-cart-btn")
  booksGridBtns.forEach((btn) => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
    </svg>`
    btn.classList.remove("btn-success")
    btn.classList.add("btn-outline-primary")
  })
}

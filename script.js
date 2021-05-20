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

    // Get all add to cart btns
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
    addToCartBtns.forEach((btn) => btn.addEventListener("click", addBookToCart))
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
                  <h5 class="card-title">${book.title}</h5>
                  <div class="d-flex justify-content-between align-items-center">
                    <button id="${book.asin}" type="button" class="btn btn-outline-primary btn-sm add-to-cart-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"/>
</svg></button>
                    <strong class="card-text text-primary m-0 d-none">Added</strong>
                    <p class="card-text price">Price: ${book.price}</p>
                  </div>
                </div>
              </div>
            </div>
  `
    )
    .join("")
}

// Add book to cark function
function addBookToCart() {
  this.nextElementSibling.classList.remove("d-none")
  const bookId = this.id
  const bookToAdd = booksCollection.find((book) => book.asin === bookId)
  if (cartBooks.some((book) => book.id === bookId)) {
    cartBooks.forEach((book) => {
      if (book.id === bookId) {
        book.quantity++
      }
    })
  } else {
    cartBooks.push({
      title: bookToAdd.title,
      id: bookId,
      price: bookToAdd.price,
      quantity: 1,
    })
  }
  console.log(cartBooks)
  cartSection.innerHTML = cartBooks
    .map(
      (book) => `
  <div class="d-flex flex-column">
    <p class="mb-0 mt-4">${book.title}</p>
    <div class="d-flex justify-content-between">
      
      <button id="${book.id}" type="button" class="btn btn-outline-danger btn-sm add-to-cart-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-dash-fill" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM6 9.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"/>
</svg></button>
<p class="m-0">${book.quantity} x ${book.price}</p>
    </div>
  </div>
  `
    )
    .join("")
}

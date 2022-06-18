document.addEventListener('DOMContentLoaded', function () {
  const bookSubmit = document.getElementById('inputBook');
  bookSubmit.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const tambahBuku = document.getElementById('inputBookTitle').value;
  const tambahPenulis = document.getElementById('inputBookAuthor').value;
  const tambahTahun = document.getElementById('inputBookYear').value;
  const checkBox = document.getElementById('inputBookIsComplete').checked;
  const generateBookID = generateBooksID();

  const generateBook = generateBookList(generateBookID, tambahBuku, tambahPenulis, tambahTahun, checkBox);
  books.push(generateBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

const books = [];
const RENDER_EVENT = 'render-books';
function generateBooksID() {
  return +new Date();
}

function generateBookList(id, title, author, year, checkBox) {
  return {
    id,
    title,
    author,
    year,
    checkBox,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBook = document.getElementById('incompleteBookshelfList');
  uncompletedBook.innerHTML = '';

  const completedBook = document.getElementById('completeBookshelfList');
  completedBook.innerHTML = '';

  for (const listBook of books) {
    const bookItem = incompleteBook(listBook);
    if (!listBook.checkBox) {
      uncompletedBook.append(bookItem);
    } else {
      completedBook.append(bookItem);
    }
  }
});

function incompleteBook(generateBook) {
  const judulBuku = document.createElement('h2');
  judulBuku.innerText = generateBook.title;

  const penulis = document.createElement('p');
  penulis.innerText = 'Penulis :' + ' ' + generateBook.author;

  const tahun = document.createElement('p');
  tahun.innerText = 'Tahun :' + ' ' + generateBook.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  buttonContainer.append(judulBuku, penulis, tahun);

  const container = document.createElement('div');
  container.classList.add('book_item');
  container.append(buttonContainer);
  container.setAttribute('id', `books-${generateBook.id}`);

  if (generateBook.checkBox) {
    const belumSelesai = document.createElement('button');
    belumSelesai.classList.add('green');
    belumSelesai.innerText = 'Belum Selesai di Baca';
    belumSelesai.addEventListener('click', function () {
      unreadBook(generateBook.id);
    });
    const hapusBuku = document.createElement('button');
    hapusBuku.classList.add('red');
    hapusBuku.innerText = 'Hapus Buku';
    hapusBuku.addEventListener('click', function () {
      deleteBook(generateBook.id);
    });
    buttonContainer.append(belumSelesai, hapusBuku);
  } else {
    const completeBook = document.createElement('button');
    completeBook.classList.add('green');
    completeBook.innerText = 'Selesai di Baca';
    completeBook.addEventListener('click', function () {
      completedBook(generateBook.id);
    });
    const hapusBuku = document.createElement('button');
    hapusBuku.classList.add('red');
    hapusBuku.innerText = 'Hapus Buku';
    hapusBuku.addEventListener('click', function () {
      deleteBook(generateBook.id);
    });
    buttonContainer.append(completeBook, hapusBuku);
  }
  return container;
}

function unreadBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.checkBox = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function deleteBook(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completedBook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.checkBox = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

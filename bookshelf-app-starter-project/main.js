let show_addBook = document.querySelector(".container_addBook");
let container_card = document.querySelector(".container_card");
const btn_tambah = document.querySelector(".btn-tambah");
const btn_hide = document.querySelector(".btn-hide");

btn_tambah.addEventListener("click" , () => {
    show_addBook.style.display="flex";
});
btn_hide.addEventListener("click", () => {
    show_addBook.style.display="none";
})

const btn_submitAddBook = document.querySelector("#bookFormSubmit");
let books = JSON.parse(localStorage.getItem("books")) || [];
const listBookComplete = document.querySelector("#completeBookList");
const listBookIncomplete = document.querySelector("#incompleteBookList");
const count_inComplete = document.querySelector(".count-inComplete");
const count_complete = document.querySelector(".count-complete");
let judul = document.querySelector("#bookFormTitle");
let penulis = document.querySelector("#bookFormAuthor");
let tahun = document.querySelector("#bookFormYear");
let selesai_dibaca = document.querySelector("#bookFormIsComplete");
const inputSearch = document.querySelector("#searchBookTitle");
let isEditing = false;
let currentEditBookId = null;

function addBooks(data) {
    if(isEditing && currentEditBookId !== null){
        const editBook = books.findIndex(book =>book.id === currentEditBookId);
        if(editBook !== -1){
            books[editBook].id = data.id,
            books[editBook].title = data.title,
            books[editBook].author = data.author,
            books[editBook].year = data.year,
            books[editBook].isComplete = data.isComplete;
        }
        console.log(editBook)
        isEditing = false;
        currentEditBookId = null;
     
    }else{
        let addBook = {
            id: new Date().getTime(),
            title: judul.value,
            author: penulis.value,
            year: tahun.value,
            isComplete: selesai_dibaca
        }
        selesai_dibaca.checked ? addBook.isComplete = true : addBook.isComplete = false;
        books.push(addBook);
    }
    renderBooks();
    localStorage.setItem("books", JSON.stringify(books));
 }

btn_submitAddBook.addEventListener("click", (e) => {
    e.preventDefault();
    const newBookData = {
        id: new Date().getTime(), 
        title: judul.value,
        author: penulis.value,
        year: tahun.value,
        isComplete: selesai_dibaca.checked 
    };
    addBooks(newBookData);
});

inputSearch.addEventListener("keyup", () => {
    const value = inputSearch.value.toLowerCase();
    searchValue(value);
});

function searchValue(keyword){
    const searchBook = books.filter(book => {
        return book.title.toLowerCase().includes(keyword) || book.author.toLowerCase().includes(keyword) ||
        book.year.toString().includes(keyword);
    });

    displaySearchResult(searchBook);
}

function displaySearchResult(dataFiltered){
    const complete = dataFiltered.filter(book => book.isComplete);
    const incomplete = dataFiltered.filter(book => !book.isComplete);
    listBook(complete,listBookComplete)
    listBook(incomplete,listBookIncomplete)
}

function listBook(data,list){
    let generateBook = "";
    data.map( element => {
        let textButton ='';
        if(element.isComplete == true){
            textButton = 'Belum Selesai Dibaca';
        }else{
            textButton = 'Selesai Dibaca';
        }
        generateBook += `
            <div data-bookid="${element.id}" data-testid="bookItem">
                <h3 data-testid="bookItemTitle">${element.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${element.author}</p>
                <p data-testid="bookItemYear">Tahun: ${element.year}</p>
                <div class="btn_action">
                    <button id="complete_btn-belumSelesai" data-testid="bookItemIsCompleteButton">${textButton}</button>
                    <button id="complete_btn-hapus" data-testid="bookItemDeleteButton">Hapus Buku</button>
                    <button id="complete_btn-edit" data-testid="bookItemEditButton">Edit Buku</button>
                </div>
            </div> `
    });
    list.innerHTML = generateBook;
}

const complete = books.filter(e => e.isComplete === true);
listBook(complete, listBookComplete);

const isComplete = books.filter(e => e.isComplete === false);
listBook(isComplete, listBookIncomplete)

function removeListBook(bookId, attr){
    books.splice(books.findIndex(book => book.id === bookId), 1);
    attr.remove();
    renderBooks(); 
    localStorage.setItem("books", JSON.stringify(books));
}

function renderBooks(){
    const complete = books.filter(e => e.isComplete === true);
    const incomplete = books.filter(e => e.isComplete === false);
    
    listBook(complete, listBookComplete);
    listBook(incomplete, listBookIncomplete);
    
    count_complete.innerHTML = complete.length;
    count_inComplete.innerHTML = incomplete.length;
}

function editListBook(book){
    show_addBook.style.display="flex";
    judul.value = book.title;
    penulis.value = book.author;
    tahun.value = book.year 
    selesai_dibaca.checked = book.isComplete;

    isEditing = true;
    currentEditBookId = book.id;
}

listBookComplete.addEventListener("click", (e) => {
    const target = e.target;
    const card = target.closest("div");
    let attr = card.parentElement;
    const bookId= Number(attr.getAttribute("data-bookid"));
    const data = books.find(book => book.id === bookId );
    if(e.target.id === "complete_btn-belumSelesai"){
        data.isComplete = false;
        localStorage.setItem("books", JSON.stringify(books));
        e.target.textContent="Selesai Dibaca";
        renderBooks();
    } else if(e.target.id === "complete_btn-hapus"){
        removeListBook(bookId, attr);
    } else if(e.target.id === "complete_btn-edit"){
        editListBook(data);
    }
});

listBookIncomplete.addEventListener("click", (e) => {
    const target = e.target;
    const card = target.closest("div");
    let attr = card.parentElement;
    const bookId= Number(attr.getAttribute("data-bookid"));
    const data = books.find(book => book.id === bookId );
    if(e.target.id === "complete_btn-belumSelesai"){
        data.isComplete = true;
        localStorage.setItem("books", JSON.stringify(books));
        e.target.textContent="Belum Selesai Dibaca"
        renderBooks();
    } else if(e.target.id === "complete_btn-hapus"){
        removeListBook(bookId, attr);
    }else if(e.target.id === "complete_btn-edit"){
        editListBook(data);
    }
});

renderBooks();
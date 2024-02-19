import { readJson, updateJson } from "./fileUtils.js";

function sendReponse(code, body) {
  const response = {
      code,
      body,
  };

  switch (code) {
      case 200:
          response.msg = "Ok";
          break;
      case 400:
          response.msg = "Endpoint not valid";
          break;
      case 404:
          response.msg = "Not found";
          break;
      case 500:
          response.msg = "Internal Server Error";
          break;
      default:
          response.msg = "Unknown status code";
  }

  return response;
}

const getBook = (titleOrISBN) => {
  try {
    const books = readJson("books.json");

    const book = books.find(
      (currentBook) =>
        currentBook.ISBN === titleOrISBN || currentBook.title === titleOrISBN
    );

    if (!book) return sendReponse(404, "Book not found");

    return sendReponse(200, book);
  } catch (error) {
   return sendReponse(500, "Internal Server Error");
  }
};

const getBOoks=(allBooks)=>{
  try {
    const books = readJson("books.json");
    return sendReponse (200, books); 
    if (!books) return sendReponse(404, "Book not found");

  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
}

const addBook = (title, ISBN, year, genre, author, stock, publisher) => {
  try {
    const books = readJson("books.json");
    let exists = books.some(book => book.ISBN === ISBN);
    if (exists) {
      return sendResponse(400);
    } else {
      const newBook = { "title": title, "ISBN": ISBN, "year": year, "genre": genre, "author": author, "stock": stock, "publisher": publisher };
      books.push(newBook);
      updateJson("book-test.json", books);
      console.log("New book added:", newBook);
      return sendResponse(200, newBook);
    }
  } catch (error) {
    return sendResponse(500, error);
  }
}

const removeBookByTitleOrISBN = (removeTitleOrISBN) => {
  try {
    const books= readJson("books.json");
    books.array.forEach(element => {
      if (element.ISBN === titleOrISBN || element.title === titleOrISBN) {
        books.array.splice(element, 1);
        return sendReponse(200, "Book removed");
      }
      
    });
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
}

const filterBy = (genre) => {
  try {
    const books = readJson("books.json");
    const filteredBooks = books.filter((book) => book.genre === genre);
    return sendReponse(200, filteredBooks);
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
};

const listBooks = () => {
  try {
    const books = readJson("books.json");
    return sendReponse(200, books);
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
};

const getBOoksByYear = (year) => {
  try{
    const book=readJson("books.json");
    const booksByYear=books.filter((book)=>book.year===year);
    return sendReponse(200, booksByYear);

  }catch(error){
    return sendReponse(500, "Internal Server Error");
  }
}

const getBOoksFullAvailability =(genreFull)=>{
  try {
    const books=readJson("books.json");
    const stock = books.every((book) => book.stock > 0);
    if (stock === true) {
        return sendReponse(200, stock);
    } else {
        return sendReponse(400, stock);
    }
  } catch (error) {
    
  }
}

const genrePartialAvailability = (genrePartial) => {
  try {
    const books = readJson("books.json");
    const stock = books.some((book) => book.stock > 0);
    if (stock === true) {
        return sendReponse(200, stock);
    } else {
        return sendReponse(400, stock);
    }
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }

}

const getCountBy = (genreContry) => {
  try {
    const books = readJson("books.json");
    const count = books.reduce((acc, book) => {
        if (book.genre === genre) {
            acc++;
        }
        return acc;
    }, 0);
    return sendReponse(200, count);
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }

}


const updateBookTitle = (isbn, title) => {
  try {
    const books = readJson("books.json");
    let updatedBook;
    const newBooks = books.map((book) => {
      if (book.ISBN === isbn) {
        updatedBook = { ...book, title };
        return sendReponse(200, updatedBook);
      }

      return book;
    });


    updateJson(newBooks, "books-test.json"); // Update the file with the new books (including the updated book)
    // ? is a conditional operator that returns the value of the expression on the right of the ? if the expression on the left is truthy, and the value of the expression on the right of the : if it is not.
    return updatedBook ? updatedBook : "Book not found"; //Handle the case if no book is updated (ISBN not found)
  } catch (error) {
    console.error(error);
  }
};




function main() {
  const args = process.argv.slice(2);

  const endpoint = args[0];

  switch (endpoint) {
    case "getBook":
      const titleOrISBN = args[1];
      console.log(getBook(titleOrISBN));
      break;
    case "getBooks":
      console.log(getBOoks());
      break;
      /** 
      case "addBook":
        let title = args[1];
        let ISBN = args[2];
        let year = args[3];
        let genre = args[4];
        let author = args[5];
        let stock = args[6];
        let publisher = args[7];
        console.log(addBook(title, ISBN, year, genre, author, stock, publisher));
        break;*/
      case "removeBookByTitleOrISBN":
        const removeTitleOrISBN = args[1];
        console.log(removeBookByTitleOrISBN(removeTitleOrISBN));
        break;
    case "updateBookTitle":
      const isbn = args[1];
      const title = args[2];

      console.log(updateBookTitle(isbn, title));
      break;

    case "filterBy":  
      const genre = args[1];
      console.log(filterBy(genre));
      break;

    case "getBooksByYear":
      const year = args[1];
      console.log(getBOoksByYear(year));
      break;

    case "getBooksFullAvailability":
      const genreFull = args[1];
      console.log(getBOoksFullAvailability(genre));
      break;
    case "genrePartialAvailability":
      const genrePartial = args[1];
      console.log(genrePartialAvailability(genre));
      break;
    case "getCountBy":
      const genreContry = args[1];
      console.log(getCountBy(genre));
      break;  

    default:
      console.log("Endpoint no válido");

  }
}

main();





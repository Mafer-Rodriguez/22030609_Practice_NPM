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

const getBooks=(allBooks)=>{
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
      return sendReponse(400, "Book already exists");
    } else {
      const newBook = { "title": title, "ISBN": ISBN, "year": year, "genre": genre, "author": author, "stock": stock, "publisher": publisher };
      books.push(newBook);
      updateJson(books, "books-test.json");
      return sendReponse(200, newBook);
    }
  } catch (error) {
    return sendReponse(500, error);
  }
}

const removeBookByTitleOrISBN = (removeTitleOrISBN) => {
  try {
    const books = readJson("books.json");
    const index = books.findIndex((book) => book.ISBN === removeTitleOrISBN || book.title === removeTitleOrISBN);
    if (index !== -1) {
      books.splice(index, 1);
      updateJson(books, "books-test.json");
      return sendReponse(200, "Book removed");
    } else {
      return sendReponse(404, "Book not found");
    }
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
}

const filterBy = (genre) => {
  try {
    const books = readJson("books.json");
    const filteredBooks = books.filter((book) => book.genre === genre);
    if (filteredBooks.length > 0) {
      return sendReponse(200, filteredBooks);
    } else {
      return sendReponse(404, "Book not found");
    }
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

const getBooksByYear = (year) => {
  try {
    const books = readJson("books.json");
    const booksByYear = books.filter((book) => book.year === year);
    return sendReponse(200,  booksByYear);
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
  }
};

const getBooksFullAvailability = (genreFull) => {
  try {
    const books = readJson("books.json");
    const filteredBooks = books.filter((book) => book.genre === genreFull);
    const stock = filteredBooks.every((book) => book.stock > 0);
    if (stock === true) {
      return sendReponse(200, stock);
    } else {
      return sendReponse(400, stock);
    }
  } catch (error) {
    return sendReponse(500, "Internal Server Error");
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

const getCountBy = (genreCountry) => {
  try {
    const books = readJson("books.json");
    const count = books.reduce((acc, book) => {
      if (acc[book[genreCountry]]) {
        acc[book[genreCountry]] += 1;
      } else {
        acc[book[genreCountry]] = 1;
      }
      return acc;
    }, {});
    if (Object.keys(count).length > 0) {
      return sendReponse(200, count);
    } else {
      return sendReponse(404);
    }
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
      console.log(getBooks());
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
        break;
        */
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
      const year = parseInt(args[1]);
      console.log(getBooksByYear(year));
      break;

    case "getBooksFullAvailability":
      const genreFull = args[1];
      console.log(getBooksFullAvailability(genreFull));
      break;
    case "genrePartialAvailability":
      const genrePartial = args[1];
      console.log(genrePartialAvailability(genrePartial));
      break;
    case "getCountBy":
      const genreContry = args[1];
      console.log(getCountBy(genreContry));
      break;  
    case "listBooks":
      console.log(listBooks());
      break;

    default:
      console.log("Endpoint no válido");

  }
}

main();





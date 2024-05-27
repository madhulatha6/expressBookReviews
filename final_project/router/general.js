const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/**public_users.get('/',function (req, res) {
  //Write your code here
  books
  .getData()
  .then((bookData) => {
    return res.status(200).json(JSON.stringify(bookData));
  }).catch(() => {
    return res.status(400).json({message: "Server error, please try again."});
  });
});*/
public_users.get('/', async function (req, res) {
    try {
      const bookList = await getBookList(req, res);
      return res.status(200).json({ books: bookList });
    } catch (error) {
      console.error("Error fetching book list:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Helper function to retrieve book list
  function getBookList(req, res) {
    return new Promise((resolve, reject) => {
      try {
       const bookList = books
  .getData()
  .then((bookData) => {
    return res.status(200).json(JSON.stringify(bookData));
  }).catch(() => {
    return res.status(400).json({message: "Server error, please try again."});
  });
        resolve(bookList);
      } catch (error) {
        reject(error);
      }
    });
  }

// Get book details based on ISBN
/**public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  books
    .getData()
    .then((bookData) => {
      if (!bookData.hasOwnProperty(isbn)) {
        return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
      }

      return res.status(200).json(JSON.stringify(bookData[isbn]));
    }).catch(() => {
      return res.status(400).json({message: "Server error, please try again."});
    });
 });
 */
 public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const { isbn } = req.params;
      const bookDetails = await getBookDetails(isbn, req, res);
      return res.status(200).json(bookDetails);
    } catch (error) {
      console.error("Error fetching book details:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Helper function to retrieve book details
  function getBookDetails(isbn, req, res) {
    return new Promise((resolve, reject) => {
      try {
       const bookDetails = books
    .getData()
    .then((bookData) => {
      if (!bookData.hasOwnProperty(isbn)) {
        return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
      }

      return res.status(200).json(JSON.stringify(bookData[isbn]));
    }).catch(() => {
      return res.status(400).json({message: "Server error, please try again."});
    });
    ;
 resolve(bookDetails);
      } catch (error) {
        reject(error);
      }
    });
  }
  
// Get book details based on author
/**public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  if (!author) {
    return res.status(404).json({message: "Error, please input an author"});
  }

  books
    .getData()
    .then((bookData) => {
      const foundBooks = Object.values(bookData).filter((value) => value.author.toLowerCase() === author.toLowerCase());
      if (foundBooks.length === 0) {
        return res.status(200).json({ message: `Author '${author}' not found in bookstore.` });
      }
      return res.status(200).json(JSON.stringify(foundBooks));
    }).catch(() => {
      return res.status(400).json({message: "Server error, please try again."});
    });
});*/
public_users.get('/author/:author', async function (req, res) {
    try {
      const { author } = req.params;
      const booksByAuthor = await getBooksByAuthor(author, req, res);
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      console.error("Error fetching books by author:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Helper function to retrieve books by author
  function getBooksByAuthor(author, req, res) {
    return new Promise((resolve, reject) => {
      try {
        const booksByAuthor = 
        books
          .getData()
          .then((bookData) => {
            const foundBooks = Object.values(bookData).filter((value) => value.author.toLowerCase() === author.toLowerCase());
            if (foundBooks.length === 0) {
              return res.status(200).json({ message: `Author '${author}' not found in bookstore.` });
            }
            return res.status(200).json(JSON.stringify(foundBooks));
          }).catch(() => {
            return res.status(400).json({message: "Server error, please try again."});
          });
          resolve(booksByAuthor);
      } catch (error) {
        reject(error);
      }
    });
  }

// Get all books based on title
/**public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  if (!title) {
    return res.status(404).json({message: "Error, please input an title"});
  }

  books
    .getData()
    .then((bookData) => {
      const foundBooks = Object.values(bookData).filter((value) => value.title.toLowerCase() === title.toLowerCase());
      if (foundBooks.length === 0) {
        return res.status(200).json({ message: `Title '${title}' not found in bookstore.` });
      }

      return res.status(200).json(JSON.stringify(foundBooks));
    }).catch(() => {
      return res.status(400).json({message: "Server error, please try again."});
    });
});*/
public_users.get('/title/:title', async function (req, res) {
    try {
      const { title } = req.params;
      const booksWithTitle = await getBooksByTitle(title, req, res);
      if (booksWithTitle.length > 0) {
        return res.status(200).json(booksWithTitle);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      console.error("Error fetching books by title:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  // Helper function to retrieve books by title
  function getBooksByTitle(title, req, res) {
    return new Promise((resolve, reject) => {
      try {
        const booksWithTitle = 
        books
    .getData()
    .then((bookData) => {
      const foundBooks = Object.values(bookData).filter((value) => value.title.toLowerCase() === title.toLowerCase());
      if (foundBooks.length === 0) {
        return res.status(200).json({ message: `Title '${title}' not found in bookstore.` });
      }

      return res.status(200).json(JSON.stringify(foundBooks));
    }).catch(() => {
      return res.status(400).json({message: "Server error, please try again."});
    });
        resolve(booksWithTitle);
      } catch (error) {
        reject(error);
      }
    });
  }

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  if (!books.books.hasOwnProperty(isbn)) {
    return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
  }

  return res.status(200).json(JSON.stringify(books.books[isbn].reviews));
});

module.exports.general = public_users;

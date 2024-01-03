const express = require('express');
let books = Object.entries(require("./booksdb.js"));
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let isUserExist = false;
  let username = req.body.username;
  let password = req.body.password;

  if(username.length === 0 || password.length ===0) return res.status(300).json("username or password cannot be empty");
  
  
  users.forEach(user => {
    if(user.username === username){
      isUserExist = true;
      return
    } else isUserExist
  })

  if(!isUserExist) {
    users.push({
    "username" : username,
    "password" : password
  });
  return res.status(300).json("The user" + (' ')+ (username) + " Has been added!");
} 
  else res.status(300).json("This username already exist")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  const getBookListPromise = new Promise( (resolve, rej) => {
    try{
      const bookList = Object.entries(require("./booksdb.js"));
      resolve(bookList);
    }
    catch(err) {
      rej(err)}
  })

  getBookListPromise.then(
    (data) => res.status(300).json(data),
    (err) => res.status(300).json({message: `${err}, try again laiter!`})
  )
  // return res.status(300).json(books); // method for Task 1
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn)

  let filteredBook= books.filter((book) =>  book[1].ISBN === isbn)

  if(filteredBook.length > 0){
    return res.status(300).json(filteredBook);
  } else  return res.status(300).json("No match ISBN");
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = (req.params.author);

  let filteredBook= books.filter((book) =>  {
    let bookAuthor = book[1].author.split(',').join("");
    bookAuthor = bookAuthor.split(' ').join('').toLowerCase(); 
    return bookAuthor === author
  })
  
  if(filteredBook.length > 0){
    return res.status(300).json(filteredBook);
  } else  return res.status(300).json("No matching books with author");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = (req.params.title);

  let filteredBook= books.filter((book) =>  {
    let bookTitle = book[1].title.split(',').join("");
    bookTitle = bookTitle.split(' ').join('').toLowerCase(); 
    return bookTitle === title
  })
  
  if(filteredBook.length > 0){
    return res.status(300).json(filteredBook);
  } else  return res.status(300).json("No matching books with title");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn)

  let filteredBook= books.filter((book) => book[1].ISBN === isbn);

 
  if(filteredBook.length > 0){
    if(Object.keys(filteredBook[0][1].reviews).length === 0) return res.status(300).json('No reviews for this book');
    else return res.status(300).json(filteredBook[0][1].reviews);
  } else  return res.status(300).json("No matching books with ISBN");
});

module.exports.general = public_users;

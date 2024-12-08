'use strict';

const mongoose = require('mongoose');

// Define a schema and model for the books
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
      .get(async function (req, res) {
        try {
          const books = await Book.find({});
          res.json(books.map(book => ({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          })));
        } catch (err) {
          res.status(500).send(err);
        }
      })

      .post(async function (req, res) {
        const title = req.body.title;
        if (!title) {
          return res.send('missing required field title');
        }

        const newBook = new Book({ title });
        await newBook.save();
        res.json({ title: newBook.title, _id: newBook._id });
      })

      .delete(async function(req, res) {
        await Book.deleteMany({});
        res.send('complete delete successful');
      });

  app.route('/api/books/:id')
      .get(async function (req, res) {
        const bookid = req.params.id;
        try {
          const book = await Book.findById(bookid);
          if (!book) {
            return res.send('no book exists');
          }
          res.json({ _id: bookid, title: book.title, comments: book.comments });
        } catch (err) {
          res.status(500).send(err);
        }
      })

      .post(async function(req, res) {
        const bookid = req.params.id;
        const comment = req.body.comment;
        if (!comment) {
          return res.send('missing required field comment');
        }
        try {
          const book = await Book.findById(bookid);
          if (!book) {
            return res.send('no book exists');
          }
          book.comments.push(comment);
          await book.save();
          res.json({ _id: bookid, title: book.title, comments: book.comments });
        } catch (err) {
          res.status(500).send(err);
        }
      })

      .delete(async function(req, res) {
        const bookid = req.params.id;
        const result = await Book.deleteOne({ _id: bookid });
        if (result.deletedCount === 0) {
          return res.send('no book exists');
        }
        res.send('delete successful');
      });
};

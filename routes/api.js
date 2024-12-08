'use strict';

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comments: { type: [String], default: [] }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = function (app) {
    app.route('/api/books')
        .get(async function (req, res) {
            try {
                const books = await Book.find({}).lean();
                const response = books.map(book => ({
                    _id: book._id,
                    title: book.title,
                    commentcount: book.comments.length
                }));
                res.json(response);
            } catch (err) {
                res.status(500).send(err.message);
            }
        })

        .post(async function (req, res) {
            const title = req.body.title;
            if (!title) {
                return res.json('missing required field title');  // Change here
            }
            const newBook = new Book({ title });
            try {
                const savedBook = await newBook.save();
                res.json({ title: savedBook.title, _id: savedBook._id });
            } catch (err) {
                res.status(500).send(err.message);
            }
        })

        .delete(async function(req, res) {
            try {
                await Book.deleteMany({});
                res.json('complete delete successful');  // Change here
            } catch (err) {
                res.status(500).send(err.message);
            }
        });

    app.route('/api/books/:id')
        .get(async function (req, res) {
            const bookid = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(bookid)) {
                return res.json('no book exists');  // Change here
            }
            try {
                const book = await Book.findById(bookid);
                if (!book) {
                    return res.json('no book exists');  // Change here
                }
                res.json({
                    _id: book._id,
                    title: book.title,
                    comments: book.comments
                });
            } catch (err) {
                console.error("Error in GET /api/books/:id:", err);
                res.status(500).send(err.message);
            }
        })

        .post(async function(req, res) {
            const bookid = req.params.id;
            const comment = req.body.comment;

            // Check for the comment field
            if (!comment) {
                return res.json('missing required field comment');  // Change here
            }

            // Validate the book ID before querying
            if (!mongoose.Types.ObjectId.isValid(bookid)) {
                return res.json('no book exists');  // Change here
            }

            try {
                const book = await Book.findById(bookid);
                if (!book) {
                    return res.json('no book exists');  // Change here
                }
                book.comments.push(comment);
                await book.save();
                res.json({
                    _id: book._id,
                    title: book.title,
                    comments: book.comments
                });
            } catch (err) {
                console.error("Error in POST /api/books/:id:", err);
                res.status(500).send(err.message);
            }
        })

        .delete(async function(req, res) {
            const bookid = req.params.id;

            // Validate the book ID before querying
            if (!mongoose.Types.ObjectId.isValid(bookid)) {
                return res.json('no book exists');  // Change here
            }

            try {
                const book = await Book.findByIdAndDelete(bookid);
                if (!book) {
                    return res.json('no book exists');  // Change here
                }
                res.json('delete successful');  // Change here
            } catch (err) {
                console.error("Error in DELETE /api/books/:id:", err);
                res.status(500).send(err.message);
            }
        });
};

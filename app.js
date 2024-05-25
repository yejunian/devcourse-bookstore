const express = require('express');

const envConfig = require('./config/env');
const { sendNotFound } = require('./middlewares/error-responses');
const authRouter = require('./routes/auth');
const booksRouter = require('./routes/books');
const cartItemsRouter = require('./routes/cart-items');
const categoriesRouter = require('./routes/categories');
const likesRouter = require('./routes/likes');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/books', booksRouter);
app.use('/cart-items', cartItemsRouter);
app.use('/categories', categoriesRouter);
app.use('/likes', likesRouter);
app.use('/orders', ordersRouter);
app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);

app.use(sendNotFound);

app.listen(envConfig.express.port);

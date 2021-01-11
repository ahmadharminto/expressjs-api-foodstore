import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import productRouter from './app/product/router.js';
import categoryRouter from './app/category/router.js';
import tagRouter from './app/tag/router.js';
import authRouter from './app/auth/router.js';
import { decodeToken } from './app/auth/middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(decodeToken);
app.use('/auth', authRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', tagRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.status(404).json({
    message: 'Resource / path not found.', 
    fields: null
  })
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

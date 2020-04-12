const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const routerRouter = require('./api/routes/orders');

//Connect to MongpDB Atlas
mongoose.connect(
    'mongodb+srv://node-shop:' +
    process.env.MONGO_ATLAS_PW +
    '@node-rest-shop-api-42jla.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

///To get API logs
app.use(morgan('dev'));
///Configuring body parser to get body data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

///Set up Cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        res.status(200).json({});
    }
    next();
});

///Routes for the API
app.use('/products', productRoutes);
app.use('/orders', routerRouter);

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Error responses
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json(
        {
            error: {
                message: error.message
            }
        }
    );
});

module.exports = app;
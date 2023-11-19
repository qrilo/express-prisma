const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./router/auth-routers');
const errorMiddleware = require('./middlewares/error-middleware');
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

const start = async () => {
    try {
        app.listen(port, () => console.log(`Server started on PORT = ${port}`))
    } catch (e) {
        console.log(e);
    }
}

start();
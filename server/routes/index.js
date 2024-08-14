const userRouter = require('./user');

const initRoutes = (app) => {
    app.use('/api/user', userRouter); // Đặt prefix cho route của user
};

module.exports = initRoutes;

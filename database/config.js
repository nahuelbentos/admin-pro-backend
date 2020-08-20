/* 
    user: root;
    pass: R43r9ZINlCuBpzG4;
 */

const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la  ver logs');
    }
};

module.exports = {
    dbConnection,
};
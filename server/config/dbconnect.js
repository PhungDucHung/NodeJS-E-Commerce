const { default: mongoose} = require('mongoose');

const dbConnect = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState === 1) {
            console.log('Connect successful')
        }else{
            console.log('DB Connecting')
        }

    } catch(error){
        console.log('DB connection is failed')
        throw new Error(error)
    }
}
module.exports = dbConnect
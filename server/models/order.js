const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId , ref: 'Product'},
        count: Number,
        color: String
    }],
    status:{
        type:String,
        default: 'Processing',
        enum: ['Cancelled', 'Processing', 'Successed']
    },
    psymentIntent:{},

    orrderBy:{
        type: mongoose.Types.ObjectId , ref: 'User'
    },
});

module.exports = mongoose.model('Order', orderSchema);
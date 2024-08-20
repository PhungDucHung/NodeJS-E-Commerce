 const mongoose = require('mongoose'); // Erase if already required
 
 // Declare the Schema of the Mongo model
 var blogSchema = new mongoose.Schema({
     title:{
         type:String,
         required:true,
     },
     description:{
         type:String,
         required:true,
     },
     category:{
         type:String,
         required:true,
     },
     numberViews:{
         type:Number,
         default: 0,
     },
     likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
     ],
     image: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/03/61/81/57/360_F_361815765_y0iTbtBthz6UOcwILdCflYvjagqLWWRK.jpg'
     },
     author: {
        type: String,
        default: 'admin'
    }
 },{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
 });
 
 //Export the model
 module.exports = mongoose.model('Blog', blogSchema);
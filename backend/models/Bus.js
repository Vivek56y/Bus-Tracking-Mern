const mongoose=require("mongoose");

const busSchema=new mongoose.Schema({
    busNumber:{type:String,required:true},
    driverName:{type:String,required:true},
    latitude:{type:String,default:0},
    longitude:{type:String,default:0},
    route:{type:String},
});

module.exports=mongoose.model("Bus",busSchema);
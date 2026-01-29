const mongoose = require('mongoose');
const UserrSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: async function(val) {
                const exists = await this.constructor.findOne({username:val});
                return !exists;
            },
            message:"Username Already Exists",
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter valid Email Id"],
        validate:{
            validator: async function(val) {
                const exists = await this.constructor.findOne({email:val});
                return !exists;
            },
            message:"Email Already Exists",
        }
    },
    password:{
        type:String,
        required:true,
        match:[/^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{3,}$/,"Password Does not have all neccesities"],
    },
    role:{
        type:String,
        enum:{
            values:["patient","Admin","doctor"],
            message:"Choose the correct role",
        }
    },
    connections:{
        type:Array,
        default:[]
    },
});
module.exports= mongoose.model('Userr',UserrSchema);
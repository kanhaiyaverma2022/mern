const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },createdAt: {
        type: Date,
        default: Date.now
    },
    tokens:[{
        token: {               //token is jush name not a defined  function name
            type:String,
            required:true
        }
    }]
})

/// for hashing alogorithms
userSchema.pre("save",async function(next){
    // console.log("bcrptjs function ")
    if (this.isModified("password")){
        this.password= await bcrypt.hash(this.password, 12)
        this.cpassword=await bcrypt.hash(this.cpassword, 12)

    }
    next();
})

// we are generating token
userSchema.methods.generateAuthToken = async function (){
    try{
        let token = jwt.sign({_id: this._id},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return this.save();
    }
    catch(err){
        // console.log(`token form schema${err}`)
        console.log(err)
    }
} 
const User = mongoose.model('USER',userSchema);





module.exports=User
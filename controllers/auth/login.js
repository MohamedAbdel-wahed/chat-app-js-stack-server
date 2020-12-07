const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
const { User }= require('../../models/index')
const { UserInputError }= require('apollo-server')
const {JWT_SECRET}= require('../../config/env')
const moment= require('moment')

const login= async({email,pwd})=> {
    let errors= {}

   try {
       // check if fields are empty
       if(email.trim()==="") errors.email= "Email can't be empty"
       if(pwd==="") errors.pwd= "Password can't be empty"
 
      //check if user exists by email
      const user= await User.findOne({ where: {email} })
      if(!user){
        errors.email= "Email doesn't exist"
      }
      else{
          //check if the password is correct
          const isCorrectPwd= await bcrypt.compare(pwd,user.pwd)
          if(!isCorrectPwd) errors.pwd= "Password does't match credentials"
      }

     // check if there is an error
     if(Object.keys(errors).length > 0) throw errors

    //signin the token
    const token= jwt.sign({email}, JWT_SECRET, {expiresIn: 60*60})

    return {
         ...user.toJSON(),
         token,
         createdAt: moment(user.createdAt).fromNow()
        }
   }
   catch(err){
       console.log(err)
       throw new UserInputError('Bad Input',{errors})
   }

}


module.exports= login 
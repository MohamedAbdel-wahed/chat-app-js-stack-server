const bcrypt= require('bcryptjs')
const { User }= require('../../models/index')
const { UserInputError }= require('apollo-server')


const register= async({username,email,pwd,confirmPwd})=> {
        let errors= {}
        
        try {
            // validate fileds if empty 
            if(username.trim()==="") errors.username= "Username can't be empty"
            if(username.length<2 || username.length>15) errors.username= "Username must be 2-15 characters"
            if(email.trim()==="") errors.email= "Email can't be empty"
            if(pwd==="") errors.pwd= "Password can't be empty"
            if(confirmPwd==="") errors.confirmPwd= "Repeat Password can't be empty"

            //check if passwords match
            if(pwd!==confirmPwd) errors.confirmPwd="Password doesn't match"

            //check password length
            if(pwd.length < 8) errors.pwd= "Password must be 8 characters at least"
            
            //checks if there is an error
            if(Object.keys(errors).length > 0) throw errors

            //hash password
            pwd= await bcrypt.hash(pwd,6)

            // create new user in users table
            const user= await User.create({
                username,
                email,
                pwd  /* hashed version of password */
            })

            return user
        }
        catch(err){
            if(err.name==="SequelizeUniqueConstraintError"){
                err.errors.forEach(e=> {
                    errors[e.path]= `${[e.path]} is already taken`
                })
            }
            else if(err.name==="SequelizeValidationError"){
                err.errors.forEach(e=> {
                    errors[e.path]= `${[e.path]} must be valid` 
                })
            }
            throw new UserInputError('Input Error',{errors})
        }
}



module.exports= register
const { User }= require('../../models/index')
const { AuthenticationError }= require('apollo-server') 


module.exports= async(user)=>{
    try {
        if(!user) throw new AuthenticationError('unauthenticated')

        const authUser= await User.findOne({ where: { email: user.email } }) 

     return authUser
   }
   catch(err){
       console.log(err)
        throw err
   }
}
      
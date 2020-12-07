const { User }= require('../../models/index')
const { AuthenticationError }= require('apollo-server')



module.exports= async({imgPath},user)=>{
    try {
        if(!user) throw new AuthenticationError('Unauthenticated')
        
        if(imgPath.trim()!=="")  await User.update({imgPath},{where: {email: user.email}})
   }
   catch(err){
       console.log(err)
        throw ('UnExpected Error: '+err)
   }
}
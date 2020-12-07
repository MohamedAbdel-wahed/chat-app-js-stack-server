const { UserInputError, AuthenticationError } = require("apollo-server")
const { User }= require('../../models/index')
const { getFriendList }= require('../../utils/friendList')


module.exports= async(user)=> {
    try{
        if(!user) throw new AuthenticationError('unauthenticated')
        
        const authUser= await User.findOne({ where: { email: user.email } }) 

        const friendList= await getFriendList(authUser)

        const friends= await User.findAll({ 
            attributes: ['username','imgPath','createdAt'],
            where: {
                username: friendList
            }
         })

         return friends
    }
    catch(err){
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}


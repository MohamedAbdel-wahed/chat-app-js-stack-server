const { User, Message }= require('../..//models/index')
const { UserInputError, AuthenticationError } = require("apollo-server")
const { checkIfFriend }= require('../../utils/friendingChecks')
const { Op }= require('sequelize')



module.exports= async({from},user)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(from.trim()==="") throw new UserInputError('No User Selected')

        const authUser= await User.findOne({ where: { email: user.email } })
        const otherUser= await User.findOne({ where: { username: from } })

        if(!otherUser) throw new UserInputError('User Not Found')

        const usernames= [authUser.username,otherUser.username]

        const isFriend= await checkIfFriend(usernames)
        if(!isFriend) throw new UserInputError('You Can Only Get Messages OF Your Friends')

        const messages= await Message.findAll({
            where: {
                [Op.and]: [
                    { to: usernames },
                    { from: usernames }
                ]
            }
        })
        
        return messages
    } 
    catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error', err) 
    }
}
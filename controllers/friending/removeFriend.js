const { UserInputError, AuthenticationError } = require("apollo-server")
const { Friend, User }= require('../../models/index')
const { checkIfFriend }= require('../../utils/friendingChecks')
const { Op }= require('sequelize')


module.exports= async({friend},user)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(friend.trim()==="") throw new UserInputError('No User Selected')

        const authUser= await User.findOne({ where: { email: user.email } })
        const otherUser= await User.findOne({ where: { username: friend } })
        
        if(!otherUser) throw new UserInputError('User Not Found')
        if(authUser.username===otherUser.username) throw new UserInputError("Come on thats very stupid :/")

        const usernames= [otherUser.username,authUser.username]
        console.log(usernames)
        
        const isFriend= await checkIfFriend(usernames)
        if(!isFriend) throw new UserInputError("You Can't Remove Users Who Are Not Friends")

        // remove friendship
        Friend.destroy({
            where: {
                [Op.and]: [
                    { user: usernames },
                    { friend: usernames }
                ]
            }
        })

    }
     catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}
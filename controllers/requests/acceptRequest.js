const { UserInputError, AuthenticationError } = require("apollo-server")
const { Friend, User, Request }= require('../../models/index')
const { checkIfFriend, checkIfRequestExists }= require('../../utils/friendingChecks')
const { Op }= require('sequelize')


module.exports= async({from},user)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(from.trim()==="") throw new UserInputError('No User Selected')
        
        const authUser= await User.findOne({ where: { email: user.email } })
        const sender= await User.findOne({ where: { username: from } })

        if(!sender) throw new UserInputError('User Not Found')
        if(authUser.username===sender.username) throw new UserInputError("You Can't Have Relationship With Yourself")

        const usernames= [sender.username,authUser.username]
        
        const isFriend= await checkIfFriend(usernames)
        if(isFriend) throw new UserInputError('You Are Friends Already')

        const isRequestExists= await checkIfRequestExists(usernames)
        if(!isRequestExists) throw new UserInputError("Request You Are Trying To Accept Doesn't Exist")

        // delete request and  create new friendship
        Request.destroy({
            where: {
                [Op.and]: [
                    { to: usernames },
                    { from: usernames }
                ]
            }
        })

        Friend.create({
            user: authUser.username,
            friend: sender.username
        })

        return;
    }
     catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}
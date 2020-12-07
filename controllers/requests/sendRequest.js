const { UserInputError, AuthenticationError } = require("apollo-server")
const { Friend, User, Request }= require('../../models/index')
const { checkIfFriend, checkIfRequestExists }= require('../../utils/friendingChecks')


module.exports= async({to},user)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(to.trim()==="") throw new UserInputError('No User Selected')
        
        const sender= await User.findOne({ where: { email: user.email } })
        const reciever= await User.findOne({ where: { username: to } })

        if(!reciever) throw new UserInputError('User Not Found')
        if(reciever.username===sender.username) throw new UserInputError("You Can't Have Relationship With Yourself")

        const usernames= [sender.username,reciever.username]

        const isFriend= await checkIfFriend(usernames)
        if(isFriend) throw new UserInputError('You Are Friends Already')

        const isRequestExists= await checkIfRequestExists(usernames)
        if(isRequestExists) throw new UserInputError('Check Previous Requests')

        const request= await Request.create({
             to: reciever.username,
            from: sender.username
        })

        return request
    }
     catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}
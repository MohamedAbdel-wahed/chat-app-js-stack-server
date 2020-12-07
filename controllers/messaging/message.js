const { Friend, User, Message }= require('../..//models/index')
const { UserInputError, AuthenticationError } = require("apollo-server")
const { checkIfFriend }= require('../../utils/friendingChecks')


module.exports= async({to,content},user,pubsub)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(to.trim()==="") throw new UserInputError('No User Selected')

        const sender= await User.findOne({ where: { email: user.email } })
        const reciever= await User.findOne({ where: { username: to } })

        if(!reciever) throw new UserInputError('User Not Found')
        if(sender.username===reciever.username) throw new UserInputError('You Can Not Send Message To Yourself')

        const usernames= [sender.username,reciever.username]

        const isFriend= await checkIfFriend(usernames)
        if(!isFriend) throw new UserInputError('You Can Only Send Messages To Friends')

        if(content.trim()==="") throw new UserInputError("Message Content can't be empty")

        const message= await Message.create({
            to: reciever.username,
            from: sender.username,
            content: content 
        })

        pubsub.publish('NEW_MESSAGE', {newMessage: message})

        return message
    } 
    catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error') 
    }
}
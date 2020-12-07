const { UserInputError, AuthenticationError } = require("apollo-server")
const { User, Message }= require('../../models/index')
const { getFriendList }= require('../../utils/friendList')
const { Op }= require('sequelize')


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

         const messages= await Message.findAll({
            where: {
                [Op.or]: [
                    { [Op.and]: [ { to: friendList }, { from: authUser.username } ]},
                    { [Op.and]: [ { from: friendList }, { to: authUser.username } ]}
                ]
            },
            order: [['createdAt','DESC']]
        })

        const friend_message= friends.map(friend=> {
            const latestMsg= messages.find(msg=> msg.to===friend.username || msg.from===friend.username)
            friend.latestMsg= latestMsg

            return friend
        })

        return friend_message
    }
    catch(err){
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}


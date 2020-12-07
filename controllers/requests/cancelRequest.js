const { UserInputError, AuthenticationError } = require("apollo-server")
const { User, Request }= require('../../models/index')
const { checkIfRequestExists }= require('../../utils/friendingChecks')
const { Op }= require('sequelize')


module.exports= async({to},user)=> {
    try {
        if(!user) throw new AuthenticationError('unauthenticated')
        if(to.trim()==="") throw new UserInputError('No User Selected')
        
        const authUser= await User.findOne({ where: { email: user.email } })
        const reciever= await User.findOne({ where: { username: to } })

        if(!reciever) throw new UserInputError('User Not Found')
        if(authUser.username===reciever.username) throw new UserInputError("Process Not Valid")

        const usernames= [reciever.username,authUser.username]

        const isRequestExists= await checkIfRequestExists(usernames)
        if(!isRequestExists) throw new UserInputError("Request You Are Trying To Cancel Doesn't Exist")

        // delete request to cancel request
        Request.destroy({
            where: {
                [Op.and]: [
                    { to: usernames },
                    { from: usernames }
                ]
            }
        })

    }
     catch (err) {
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}
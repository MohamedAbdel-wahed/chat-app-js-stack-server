const { UserInputError, AuthenticationError } = require("apollo-server")
const { User, Request }= require('../../models/index')


module.exports= async(user)=> {
    try{
        if(!user) throw new AuthenticationError('Unauthenticated')

        const authUser= await User.findOne({ where: { email: user.email } }) 

        // get sent requests
        const sentRequests= await Request.findAll({ 
            attributes: ['to'],
            where: { from: authUser.username }
        })

        let sentList= []
        sentRequests.map(request=>{
            Object.values(request.dataValues).forEach(name=>{
                sentList.push(name)
            })
        })
        
        const recievers= await User.findAll({ attributes: ['username', 'imgPath'], where: { username: sentList } })

        return recievers
    }
    catch(err){
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}


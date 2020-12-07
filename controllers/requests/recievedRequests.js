const { UserInputError, AuthenticationError } = require("apollo-server")
const { User, Request }= require('../../models/index')


module.exports= async(user)=> {
    try{
        if(!user) throw new AuthenticationError('Unauthenticated')

        const authUser= await User.findOne({ where: { email: user.email } }) 

        // get recieved requests
        const recievedRequests= await Request.findAll({ 
            attributes: ['from'],
            where: { to: authUser.username } 
        })
        
        let recievedList= []
        recievedRequests.map(request=>{
            Object.values(request.dataValues).forEach(name=>{
                recievedList.push(name)
            })
        })

        const senders= await User.findAll({ attributes: ['username', 'imgPath'], where: { username: recievedList } })

        return senders
    }
    catch(err){
        console.log(err)
        throw new UserInputError('Unexpected Error', err)
    }
}


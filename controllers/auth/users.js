const { User }= require('../../models/index')
const { getFriendList }= require('../../utils/friendList')
const { getRequestList }= require('../../utils/requestList')
const { AuthenticationError }= require('apollo-server') 
const { Op }= require('sequelize') 


module.exports= async(user)=>{
    try {
        if(!user) throw new AuthenticationError('unauthenticated')

        const authUser= await User.findOne({ where: { email: user.email } }) 

        const requestList= await getRequestList(authUser)
        const friendList= await getFriendList(authUser)


        const users= await User.findAll({ 
            attributes: ['username','imgPath','createdAt'],
            where: {
                [Op.and]: [
                  { username: { [Op.notIn]: friendList } },
                  { username: { [Op.notIn]: requestList } },
                  { username: { [Op.ne]: authUser.username } }
                ]
            }
        })

     return users
   }
   catch(err){
       console.log(err)
        throw err
   }
}
      
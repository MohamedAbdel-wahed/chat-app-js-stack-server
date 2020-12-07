const { Friend }= require('../models/index')
const { Op }= require('sequelize')


 const getFriendList= async(authUser)=> {
    let friendList=[]

    let friendships= await Friend.findAll({ 
        attributes: ['user','friend'],
        where: {
            [Op.or]: [
                { user: authUser.username },
                { friend: authUser.username }
            ]
        } 
    })

    friendships.map(friendship=>{
        Object.values(friendship.dataValues).forEach(name=>{
            name!==authUser.username && friendList.push(name)
        })
    })

    return friendList
}

module.exports= {
    getFriendList
}


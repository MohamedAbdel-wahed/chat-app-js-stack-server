const { Friend, Request }= require('../models/index')
const { Op }= require('sequelize')


const checkIfFriend= async(usernames)=> {
    const isFriend= await Friend.findOne({ 
        where: { 
            [Op.and]: [
                { user: usernames },
                { friend: usernames }
            ]
         } 
    })

    return isFriend
}

const checkIfRequestExists= async(usernames)=> {
    const isRequestExists= await Request.findOne({ 
        where: {
            [Op.and]: [
                { to: usernames },
                { from: usernames }
            ]
        }
     })

    return isRequestExists
}


module.exports= {
    checkIfFriend,
    checkIfRequestExists
}
const { Request }= require('../models/index')
const { Op }= require('sequelize')


 const getRequestList= async(authUser)=> {
    let requestList=[]

    let requests= await Request.findAll({ 
        attributes: ['to','from'],
        where: {
            [Op.or]: [
                { to: authUser.username },
                { from: authUser.username }
            ]
        } 
    })

    requests.map(request=>{
        Object.values(request.dataValues).forEach(name=>{
            name!==authUser.username && requestList.push(name)
        })
    })

    return requestList
}

module.exports= {
    getRequestList
}


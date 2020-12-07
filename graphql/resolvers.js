const moment= require('moment')
const { AuthenticationError, withFilter }= require('apollo-server')
const { User }= require('../models/index')
const register= require('../controllers/auth/register')
const login= require('../controllers/auth/login')
const users= require('../controllers/auth/users')
const currentUser= require('../controllers/auth/currentUser')
const editData= require('../controllers/auth/editData')
const message= require('../controllers/messaging/message')
const messages= require('../controllers/messaging/messages')
const sentRequests= require('../controllers/requests/sentRequests')
const recievedRequests= require('../controllers/requests/recievedRequests')
const sendRequest= require('../controllers/requests/sendRequest')
const cancelRequest= require('../controllers/requests/cancelRequest')
const acceptRequest= require('../controllers/requests/acceptRequest')
const rejectRequest= require('../controllers/requests/rejectRequest')
const removeFriend= require('../controllers/friending/removeFriend')
const friend_message= require('../controllers/friending/friend_message')
const friends= require('../controllers/friending/friends')

    

module.exports= {
        Message: {
            createdAt: ({createdAt})=> moment(createdAt).fromNow()
        },
        Query: {
            users: (_,__,{user})=> users(user),
            login: (_,args)=> login({...args}),
            currentUser: (_,__,{user})=> currentUser(user),
            sentRequests: (_,__,{user})=> sentRequests(user),
            recievedRequests: (_,__,{user})=> recievedRequests(user),
            messages: (_,args,{user})=> messages({...args},user),
            friend_message:(_,__,{user})=> friend_message(user),
            friends:(_,__,{user})=> friends(user)
        },
        Mutation: {
            register: (_,args)=> register({...args}),
            message: (_,args,{user,pubsub})=> message({...args},user,pubsub),
            sendRequest: (_,args,{user})=> sendRequest({...args},user),
            cancelRequest: (_,args,{user})=> cancelRequest({...args},user),
            rejectRequest: (_,args,{user})=> rejectRequest({...args},user),
            acceptRequest: (_,args,{user})=> acceptRequest({...args},user),
            removeFriend: (_,args,{user})=> removeFriend({...args},user),
            editData: (_,args,{user})=> editData({...args},user)
        },
        Subscription: {
            newMessage: {
                subscribe: withFilter(
                    // asyncIterator func
                    (_,__,{user,pubsub})=>{
                    if(!user) throw new AuthenticationError('unauthenticated')
                    return pubsub.asyncIterator(['NEW_MESSAGE'])
                    },
                    // filter func
                    async({newMessage},_,{user})=> {
                        if(!user) throw new AuthenticationError('unauthenticated')
                        const authUser= await User.findOne({ where: {email: user.email} })
                    
                        if(newMessage && newMessage.from===authUser.username || newMessage.to===authUser.username) 
                            return true
                    
                    return false
            })
        }
    } 
}

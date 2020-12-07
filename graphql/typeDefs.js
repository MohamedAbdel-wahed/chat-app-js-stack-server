const {gql}= require('apollo-server')


module.exports= gql`

   type User {
       username: String!,
       imgPath:String,
       email: String,
       token: String,
       createdAt: String!
   }

   type Message {
       uuid: String!,
       to: String!
       from: String!
       content: String!
       createdAt: String!
   }

   type Request {
       to: String!,
       from: String!,
       createdAt: String!
   }

   type Friend {
       username: String!
       latestMsg: Message
       imgPath: String
       createdAt: String
   }

   type Query {
       users: [User!]
       login(email:String! pwd:String): User!
       currentUser: User!
       sentRequests: [User!]
       recievedRequests: [User!]
       friends: [Friend!]
       messages(from:String!): [Message!]
       friend_message: [Friend!] 
   }

   type Mutation {
       register(username:String! email:String! pwd:String! confirmPwd:String!): User!
       sendRequest(to:String!): Request!
       cancelRequest(to:String!): Boolean
       acceptRequest(from:String!): Boolean
       rejectRequest(from:String!): Boolean
       removeFriend(friend:String!): Boolean
       message(to:String! content:String!): Message!
       editData(imgPath:String!): Boolean
   }

   type Subscription {
       newMessage: Message!
   }

`

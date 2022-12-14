const express=require('express')
const mongoose=require('mongoose')
const bp=require('body-parser')
const cors=require('cors')
const dotenv=require('dotenv')
const http=require('http')
const socketio=require('socket.io')
const cloudinary=require('cloudinary')
const path=require("path")
const cp=require('cookie-parser')

const messageRoute=require('./routes/message')
const auth =require('./routes/auth')
const userRoute=require('./routes/user')

const app=express()
const server=http.createServer(app)


dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})  

mongoose.connect(process.env.MONGOURL).then(console.log("connected successfully")).catch((e)=>{console.log(e)})


app.use(cors({ credentials : true,  origin: "https://chatting-club-frontend.onrender.com" }))
app.use(bp.json({limit:'5mb'}))
app.use(bp.urlencoded({limit:'5mb',extended:true}))
app.use(cp())

app.use('/api/user',auth)
app.use('/api/user',messageRoute)
app.use('/api/user',userRoute)



var users=[]

const io=socketio(server,{
    cors: {
        origin: "https://chatting-club-frontend.onrender.com",
    }
})

const addusers=(userid,socketid)=>{
      if(userid===null){return}
    if(users.some((user)=>user.userid===userid) ){
        const u =  users.filter((elem)=>{return elem.userid  !== userid})
        users=[...u,{userid,socketid}]
    }
    else{
    users.push({userid,socketid})
}}

const getuser=(id)=>{
  return  users.find((elem)=>{elem.userid==id}) 
}


io.on('connection',(socket)=>{
    //when connect
    console.log(' user connected')


    //add and remove users
    socket.on('adduser',(userid)=>{
        addusers(userid,socket.id)
        io.emit('getuser',users)        
    })
//send and get message
 socket.on('sendmessage',({sender,reciever,text,sendername})=>{ 
    
      const user=users.find((elem)=>{return elem.userid===reciever})
      if(user){ 

        io.to(user.socketid).emit("getmessage",{
            reciever,
            sender,
            text,
            sendername
        })
      }

})
//diconnect user
    socket.on('disconnect',()=>{
      const u =  users.filter((elem)=>{return elem.socketid  !== socket.id})
      users=[...u]
      io.emit('getuser',users)    
  console.log('user disconnect')
        })
})






server.listen(process.env.PORT || 8000,()=>{
console.log('server is listening on port 8000 ....')
})
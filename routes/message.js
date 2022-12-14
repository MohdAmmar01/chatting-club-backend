const router=require('express').Router()
const message=require('../models/message')
const varifyuser=require('../middleweres/middlewere')

//create messages

router.post('/newmessage',varifyuser,async (req,res)=>{

    try{  
const mes= new message({
    members:[req.id,req.body.reciever],
    text:req.body.text,
    sendername:req.body.sendername  
});
const m=await mes.save()
res.status(200).json({"success":true,"message":m})
}catch(e){
    res.status(400).json({"success":false,"message":"some error occured","error":e.message})
}}
)

//get messages of user

router.post('/getmessage',varifyuser,async (req,res)=>{
    try{  

        const m=await message.find({members:{$all:[req.id,req.body.reciever]}})
  res.status(200).json({"success":true,"message":m})

}catch(e){
    res.status(400).json({"success":false,"message":"some error occured","error":e.message})
}}
)
module.exports = router;
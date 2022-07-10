require('dotenv').config();
const bcrypt = require ('bcrypt')
const _ = require ('lodash')
const axios = require ('axios')
const otpGenerator = require ('otp-generator')
const { User } = require('../models/userModel')
const { Otp } = require('../models/otpModel')
const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN;  

const client = require('twilio')(accountSid, authToken)

module.exports.signUp= async (req, res)=>{
    const user = await User.findOne({
        number: req.body.number
    })
    if(user) {return res.status(400).send('user already registered')};
    const OTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars:false, upperCaseAlphabets: false });
    const number = req.body.number
    console.log(OTP);
    client.messages.create({
    body: `verification Code ${OTP}`,
    to: `${number}`, 
    from: '+19377313955' 
})
.then((message) => console.log(message.sid));

    const otp = new Otp({ number: number, otp: OTP })

    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send('OTP sent successfully!!')



}

module.exports.verifyOtp= async (req, res)=>{
    const otpHolder = await Otp.find({
        number: req.body.number
    })
    if (otpHolder.length === 0) return res.status(400).send("OTP Expired")
    //to get the last otp sent
    const rightOtpFind = otpHolder[otpHolder.length - 1 ];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

    if(rightOtpFind.number === req.body.number &&  validUser) {   
        const user = new User(_.pick(req.body, ["number"]))
        const token = user.generateJWT();
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number
        })
        return res.status(200).send({
            message: "User registration successfully",
            token: token,
            data: result
        })
    }
    else{
        return res.status(200).send("Your OTP was Wrong")
    }
    

}
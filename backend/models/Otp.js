const mongoose = require("mongoose");
const mailSender = require('../utils/mailUtils/mailSender')
const emailTemplate = require('../utils/mailUtils/mailTemplate')
const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 600 * 1000
    }

})

async function sendVerificationEmail(email, otp) {

    try {
        const mailResponse = await mailSender(email, "verification email from truecaller-clone", emailTemplate(otp))
        console.log(`successfully send verification email : - > ${mailResponse}`);
    } catch (err) {
        console.log("not able to send verification email");
        console.log(err);
    }

}

otpSchema.pre("save", async function (next) {
    sendVerificationEmail(this.email, this.otp)
    next()
})
module.exports = mongoose.model("Otp", otpSchema)
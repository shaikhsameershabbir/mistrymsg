import dbConnect from '@/lib/dbConnect'
import UserModal from '@/modal/user.modal'
const bcrypt = require('bcryptjs');

import { sendVerificationEmail } from '@/lib/helpers/sendVerificationEmail'
//  creating api request for signup  route is api/sign-up
export async function POST(request: Request) {
    // connecting to database
    await dbConnect()

    try {
        //Taking the values from response 
        const { username, password, email } = await request.json()
        // Checking username is exist or not 
        const existingUserVerifiedByUsername = await UserModal.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username already taken"
            }, { status: 400 })
        }
        // Checking Email is exist or not 
        const existingUserByEmail = await UserModal.findOne({ email })
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
        if (existingUserByEmail) {
            //    checking if user is verified or not 

            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'User Already exists with this mail  '
                }, {
                    status: 400
                })
            } else {
                // If user not verified send email 
                const hashedPassword = await bcrypt(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        } else {
            // Register user
            const hashPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModal({
                username,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                massages: []
            })
            await newUser.save()
        }
        // send verification email 
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                massage: emailResponse.message
            }, { status: 500 })
        }
        if (emailResponse.success) {
            return Response.json({
                success: true,
                massage: 'User registered successfully pleas check your email '
            }, { status: 201 })
        }
    } catch (error) {
        // Handling if sign-up is failed 
        console.log('error  in registering users ', error)
        return Response.json({
            success: false,
            message: 'Error while Registering user '
        }, {
            status: 500
        })
    }
}

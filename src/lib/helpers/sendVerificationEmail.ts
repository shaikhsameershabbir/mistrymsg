import { resend } from '@/lib/resend'
import VerificationEmail from '../../../emails/verificationEmail'

import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,

): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'smasher.update.com',
            to: email,
            subject: 'Mistry | Massage verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: false, message: 'verification email send successfully' }
    } catch (emailError) {
        console.log('Error sending verification email ', emailError)

        return { success: false, message: 'Failed to send verification email' }


    }
}
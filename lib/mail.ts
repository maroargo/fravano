/*import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmailVerification = async (email: string, token: string) {
    try {
        
        await resend.emails.send({
            from: "NextAuth JS <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            html: `<p>Click the link below to verify your email</p>
                <a haref="${process.env.NEXTAUTH_URL}/api/auth/verifiy-email?token=${token}">
                Verify Email</a>`
        });

        return {
            success: true
        }

    } catch (error) {
        return {
            error: true
        }
    }
}*/
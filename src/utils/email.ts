import { config } from 'dotenv'
import { Transporter, createTransport } from 'nodemailer'

export function useMailer() {
  let transporter: Transporter | null = null

  if (transporter === null) {
    config()
    
    transporter = createTransport({
      service: process.env.MAILER_SERVICE,
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_SECRET
      }
    })  
  }

  return {
    sendEmailVerifyCode(code: number | string, email: string) {
      if (transporter === null) return false
      transporter.sendMail({
        from: `simple_community<${process.env.SMTP_USER}>`,
        to: email,
        subject: 'simple_community 邮箱验证码',
        text: `您的验证码为：${code}`,
        html: `<h1>您的验证码为：${code}</h1>`
      })
      return true
    }
  }
}
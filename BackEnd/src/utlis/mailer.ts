import nodemailer from 'nodemailer'

const transporter= nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'lizzycompany07@gmail.com',
      pass: 'ndxgkqrcutiudvpf',
    }
})

export default transporter
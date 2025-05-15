import nodemailer from 'nodemailer'

let transporter

export async function initEmailService() {
  const testAccount = await nodemailer.createTestAccount()

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  })

  // console.log('Ethereal account ready:')
  // console.log('Login:', testAccount.user)
  // console.log('Password:', testAccount.pass)
}

export async function sendRequestChangePassword(email, codigo) {
  if (!transporter) throw new Error('Email service not initialized')

  const info = await transporter.sendMail({
    from: '"RallyShot" <no-responder@rallyshot.com>',
    to: email,
    subject: 'Código de cambio de contraseña',
    text: `Tu código para cambiar la contraseña es: ${codigo}`,
    html: `<p>Tu código para cambiar la contraseña es: <strong>${codigo}</strong></p>`,
  })

  console.log('Mensaje enviado:', info.messageId)
  console.log('Vista previa:', nodemailer.getTestMessageUrl(info))
}

export async function sendVerificationCode(email, codigo) {
  if (!transporter) throw new Error('Email service not initialized')

  const info = await transporter.sendMail({
    from: '"RallyShot" <no-responder@rallyshot.com>',
    to: email,
    subject: 'Código de verificación de cuenta',
    text: `Tu código de verificación es: ${codigo}`,
    html: `<p>Gracias por registrarte en RallyShot.<br/>Tu código de verificación es: <strong>${codigo}</strong></p>`,
  })

  console.log('Mensaje de verificación enviado:', info.messageId)
  console.log('Vista previa:', nodemailer.getTestMessageUrl(info))
}

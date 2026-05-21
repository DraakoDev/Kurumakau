import { cambiarContrasena, checkLogin, crearUsuario, eliminarUsuario, actualizarUsuario as actualizarUsuarioModel, getPersonInDB, getUserInDB, listarUsuarios } from '../model/usuario.model.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { transporter } from '../services/mail/mailer.js'

export const registrarUsuario = async (req, res) => {
  const data = req.body
  try {
    const usuario = await crearUsuario(data)
    res.status(201).send({
      success: true,
      user: usuario
    })
  } catch (error) {
    res.status(400).send({ success: false, error: error.message })
  }
}

export const logearUsuario = async (req, res) => {
  const { username, password } = req.body

  try {
    const loginData = await checkLogin({ username, password })
    const token = jwt.sign(
      { username: loginData.nombre_usuario, tipo: loginData.tipo },
      process.env.SECRET_JWT_KEY)

    res
      .cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'strict'
      })
      .send({ success: true, usuario: loginData })
  } catch (error) {
    res.status(401).send({ success: false, error: error.message })
  }
}

export const checkAuth = (req, res) => {
  if (req.session.user === null) return res.status(401).send({ session: false })
  res.status(200).send({ session: true, user: req.session.user })
}

export const logout = (req, res) => {
  res.clearCookie('access_token').send({ logout: true })
}

export const repassword = async (req, res) => {
  const { token } = req.params
  const { nuevaContrasena } = req.body
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT_KEY)
    console.log('Controller')
    console.log(data)
    if (data === null) return res.send({ message: 'La clave a expirado' })
    const response = await cambiarContrasena(data.nombre_usuario, nuevaContrasena)
    if (response === 0) return res.send({ message: 'No se pudo cambiar la contrasena', success: false })
    if (response === 1) return res.send({ message: 'Contrasena cambiada con exito', success: true })
  } catch {}
}

export const enviarCorreoRecuperacion = async (req, res) => {
  const user = await getUserInDB(req.body.username)
  const persona = await getPersonInDB(user.cedula)
  console.log(user)
  console.log(persona)
  if (!user) return res.status(404).send({ message: 'El usuario no esta registrado' })
  const token = jwt.sign(user, process.env.SECRET_JWT_KEY, { expiresIn: '15m' })
  const link = `http://localhost:5173/cambiar-password/${token}`

  await transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: persona.correo,
    subject: 'Recuperar contraseña',
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Recuperar contraseña</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#0f172a;
    font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="
    background:#111827;
    margin:40px auto;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,0.4);
">

<!-- HEADER -->
<tr>
<td style="
    background:linear-gradient(135deg,#dc2626,#991b1b);
    padding:40px;
    text-align:center;
">

<h1 style="
    color:white;
    margin:0;
    font-size:38px;
    letter-spacing:2px;
">
  ZARU
</h1>

<p style="
    color:#fecaca;
    margin-top:10px;
    font-size:16px;
">
Recuperación de acceso
</p>

</td>
</tr>

<!-- IMAGE -->
<tr>
<td>

<img 
src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop"
width="100%"
style="display:block;"
alt="Auto deportivo"
/>

</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:50px; color:#e5e7eb;">

<h2 style="
    margin-top:0;
    color:white;
    font-size:28px;
">
Hola conductor 👋
</h2>

<p style="
    font-size:16px;
    line-height:1.8;
    color:#d1d5db;
">
Recibimos una solicitud para restablecer la contraseña de tu cuenta en
<strong style="color:white;">Zaru</strong>.
</p>

<p style="
    font-size:16px;
    line-height:1.8;
    color:#d1d5db;
">
Haz clic en el siguiente botón para crear una nueva contraseña segura.
</p>

<!-- BUTTON -->
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<a href="${link}" style="
    display:inline-block;
    padding:18px 40px;
    background:linear-gradient(135deg,#ef4444,#b91c1c);
    color:white;
    text-decoration:none;
    border-radius:12px;
    font-weight:bold;
    font-size:18px;
    margin-top:20px;
    box-shadow:0 5px 15px rgba(239,68,68,0.4);
">
Restablecer contraseña
</a>

</td>
</tr>
</table>

<p style="
    margin-top:40px;
    font-size:14px;
    color:#9ca3af;
    line-height:1.7;
">
Este enlace expirará en 15 minutos por seguridad.
Si no solicitaste este cambio, puedes ignorar este correo.
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
    background:#0b1120;
    padding:30px;
    text-align:center;
">

<p style="
    margin:0;
    color:#6b7280;
    font-size:13px;
">
© 2026 Zaru · Todos los derechos reservados
</p>

<p style="
    margin-top:8px;
    color:#6b7280;
    font-size:12px;
">
Conduce hacia el futuro 🚘
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`
  })

  res.send({ success: true, message: 'Correo de recuperacion enviado' })
}

export const borrarUsuario = (req, res) => {
  const { username } = req.params

  try {
    const data = eliminarUsuario(username)
    console.log(data)
    res.send({ message: 'El usuario fue eliminado correctamente' })
  } catch (error) {
    res.send({ message: 'No se pudo eliminar el usuaior', error: error.message })
  }
}

export const actualizarUsuario = async (req, res) => {
  const { username } = req.params
  const { tipo } = req.body

  if (!tipo) {
    return res.status(400).send({ success: false, error: 'El tipo de usuario es requerido' })
  }

  try {
    await actualizarUsuarioModel(username, tipo)
    res.status(200).send({ success: true, mensaje: 'Usuario actualizado correctamente' })
  } catch (error) {
    res.status(400).send({ success: false, error: error.message })
  }
}

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await listarUsuarios()
    res.status(200).send({ success: true, data: usuarios })
  } catch (error) {
    res.status(500).send({ success: false, error: error.message })
  }
}

import express from 'express'
import { registrarUsuario, logearUsuario, checkAuth, logout, enviarCorreoRecuperacion, repassword, borrarUsuario, getAllUsuarios, actualizarUsuario } from '../controllers/usuario.controller.js'
import { checkToken } from '../middlewares/user.auth.js'
const router = express.Router()

router.post('/register', registrarUsuario)
router.post('/login', logearUsuario)
router.post('/getAuth', checkToken, checkAuth)
router.post('/logout', checkToken, logout)
router.post('/forgot-password', enviarCorreoRecuperacion)
router.post('/reset-password/:token', repassword)
router.put('/usuarios/:username', checkToken, actualizarUsuario)
router.delete('/borrar/usuario/:username', borrarUsuario)
router.get('/usuarios', checkToken, getAllUsuarios)

export default router

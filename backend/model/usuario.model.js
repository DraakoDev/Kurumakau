import { pool } from '../db/conexion.js'
import { BUSCAR_PERSONA, INSERTAR_PERSONA } from '../db/queries/persona.queries.js'
import { ELIMINAR_USUARIO, INSERTAR_USUARIO, REPASSWORD, SELECCIONAR_USUARIO, LISTAR_USUARIOS, EDITAR_USUARIO } from '../db/queries/user.queries.js'
import bcrypt from 'bcrypt'

export const getUserInDB = async (user) => {
  const data = await pool.query(SELECCIONAR_USUARIO, user)
  return data[0]
}

export const getPersonInDB = async (cedula) => {
  const data = await pool.query(BUSCAR_PERSONA, cedula)
  return data[0]
}

export const passwordMatches = async (clientPassword, bdUserPassword) => {
  return await bcrypt.compare(clientPassword, bdUserPassword)
}

export const checkLogin = async ({ username, password }) => {
  const user = await getUserInDB(username)
  if (user === undefined) throw new Error('El usuario no esta registrado')
  const isValid = await passwordMatches(password, user.contrasena)
  if (!isValid) throw new Error('La contrasena es incorrecta')

  const { contrasena: _, ...publicUser } = user
  return publicUser
}

export const crearPersona = async (conexion, persona) => {
  return await conexion.query(INSERTAR_PERSONA, [
    persona.cedula,
    persona.nombre,
    persona.apellido,
    persona.direccion,
    persona.telefono,
    persona.correo
  ])
}

export const buscarPersona = async (conexion, cedula) => {
  return await conexion.query(BUSCAR_PERSONA, cedula)
}

export const cambiarContrasena = async (username, contrasena) => {
  let conexion
  try {
    console.log('Cambio model')
    console.log(username)
    console.log(contrasena)
    conexion = await pool.getConnection()
    const newHashedPassword = await bcrypt.hash(contrasena, 8)
    const data = await conexion.query(REPASSWORD, [newHashedPassword, username])
    return data.affectedRows
  } catch (error) {
    console.log(error)
  }
}

export const crearUsuario = async (persona) => {
  let conexion

  try {
    conexion = await pool.getConnection()

    await conexion.beginTransaction()

    const isCreated = await buscarPersona(conexion, persona.cedula)

    if (!isCreated[0]) {
      console.log('Creando Persona...')
      await crearPersona(conexion, persona)
    }

    const hashedPassword = await bcrypt.hash(persona.password, 8)

    await conexion.query(INSERTAR_USUARIO, [
      persona.username,
      hashedPassword,
      persona.cedula,
      persona.tipo_usuario
    ])

    await conexion.commit()

    const { password: _, ...newUser } = persona

    return newUser
  } catch (error) {
    if (conexion) await conexion.rollback()

    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('correo')) throw new Error('Ya existe un usuario registrado con ese correo electronico')

      if (error.message.includes('nombre_usuario')) throw new Error('Ya existe un usuario registrado con ese nombre de usuario')
    }

    console.log(error.message)
    throw new Error('El usuario no pudo ser creado!!!')
  } finally {
    if (conexion) conexion.release()
  }
}

export const actualizarUsuario = async (username, tipo) => {
  let conexion
  try {
    conexion = await pool.getConnection()
    const data = await conexion.query(EDITAR_USUARIO, [tipo, username])
    if (data.affectedRows === 0) throw new Error('El usuario no fue encontrado')
    return data
  } catch (error) {
    throw new Error('Error actualizando el usuario: ' + error.message)
  }
}

export const eliminarUsuario = async (username) => {
  let conexion
  try {
    conexion = await pool.getConnection()
    const data = await conexion.query(ELIMINAR_USUARIO, username)
    return data
  } catch (error) {
    throw new Error('Error eliminando el usuario' + error.message)
  }
}

export const eliminarUsuarioPorCedula = async (conexion, cedula) => {
  return await conexion.query(ELIMINAR_USUARIO_POR_CEDULA, cedula)
}

export const listarUsuarios = async () => {
  try {
    const data = await pool.query(LISTAR_USUARIOS)
    return data
  } catch (error) {
    throw new Error('Error listando usuarios: ' + error.message)
  }
}

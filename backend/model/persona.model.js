import { pool } from '../db/conexion.js'
import { INSERTAR_PERSONA, BUSCAR_PERSONA, LISTAR_PERSONAS, ACTUALIZAR_PERSONA, ELIMINAR_PERSONA, LISTAR_VENDEDORES } from '../db/queries/persona.queries.js'

export const crearPersona = async (persona) => {
  let conexion
  try {
    conexion = await pool.getConnection()
    await conexion.query(INSERTAR_PERSONA, [
      persona.cedula,
      persona.nombre,
      persona.apellido,
      persona.direccion,
      persona.telefono,
      persona.correo
    ])
    return persona
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('cedula')) throw new Error('La cédula ya está registrada')
      if (error.message.includes('correo')) throw new Error('El correo ya está registrado')
    }
    throw new Error('No se pudo crear la persona: ' + error.message)
  } finally {
    if (conexion) conexion.release()
  }
}

export const obtenerPersona = async (cedula) => {
  try {
    const data = await pool.query(BUSCAR_PERSONA, cedula)
    if (!data[0]) throw new Error('La persona no fue encontrada')
    return data[0]
  } catch (error) {
    throw new Error('Error buscando la persona: ' + error.message)
  }
}

export const listarPersonas = async () => {
  try {
    const data = await pool.query(LISTAR_PERSONAS)
    return data
  } catch (error) {
    throw new Error('Error listando personas: ' + error.message)
  }
}

export const actualizarPersona = async (cedula, persona) => {
  let conexion
  try {
    conexion = await pool.getConnection()
    const resultado = await conexion.query(ACTUALIZAR_PERSONA, [
      persona.nombre,
      persona.apellido,
      persona.direccion,
      persona.telefono,
      persona.correo,
      cedula
    ])
    if (resultado.affectedRows === 0) throw new Error('La persona no fue encontrada')
    return { cedula, ...persona }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' && error.message.includes('correo')) {
      throw new Error('El correo ya está registrado')
    }
    throw new Error('Error actualizando la persona: ' + error.message)
  } finally {
    if (conexion) conexion.release()
  }
}

export const eliminarPersona = async (cedula) => {
  let conexion
  try {
    conexion = await pool.getConnection()

    console.log(cedula)
    const resultado = await conexion.query(ELIMINAR_PERSONA, [cedula])
    console.log(resultado)

    if (resultado.affectedRows === 0) throw new Error('La persona no fue encontrada')

    return { mensaje: 'Persona eliminada correctamente' }
  } catch (error) {
    throw new Error('Error eliminando la persona: ' + error.message)
  } finally {
    if (conexion) conexion.release()
  }
}

export const listarVendedores = async () => {
  try {
    const data = await pool.query(LISTAR_VENDEDORES)
    return data
  } catch (error) {
    throw new Error('Error listando vendedores: ' + error.message)
  }
}

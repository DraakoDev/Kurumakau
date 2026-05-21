import { crearPersona, obtenerPersona, listarPersonas, actualizarPersona, eliminarPersona, listarVendedores } from '../model/persona.model.js'
export const createPersona = async (req, res) => {
  try {
    const persona = await crearPersona(req.body)
    res.status(201).send({ success: true, mensaje: 'Persona creada correctamente', data: persona })
  } catch (error) {
    res.status(400).send({ success: false, error: error.message })
  }
}

export const getPersona = async (req, res) => {
  try {
    const { cedula } = req.params
    const persona = await obtenerPersona(cedula)
    res.status(200).send({ success: true, data: persona })
  } catch (error) {
    res.status(404).send({ success: false, error: error.message })
  }
}

export const getAllPersonas = async (req, res) => {
  try {
    const personas = await listarPersonas()
    res.status(200).send({ success: true, data: personas })
  } catch (error) {
    res.status(500).send({ success: false, error: error.message })
  }
}

export const updatePersona = async (req, res) => {
  try {
    const { cedula } = req.params
    const persona = await actualizarPersona(cedula, req.body)
    res.status(200).send({ success: true, mensaje: 'Persona actualizada correctamente', data: persona })
  } catch (error) {
    res.status(400).send({ success: false, error: error.message })
  }
}

export const deletePersona = async (req, res) => {
  try {
    const { cedula } = req.params
    const resultado = await eliminarPersona(cedula)

    res.status(200).send({ success: true, mensaje: resultado.mensaje })
  } catch (error) {
    console.log(error)
    res.status(400).send({ success: false, error: error.message })
  }
}

export const getVendedores = async (req, res) => {
  try {
    const vendedores = await listarVendedores()
    res.status(200).send({ success: true, data: vendedores })
  } catch (error) {
    res.status(500).send({ success: false, error: error.message })
  }
}

const API = "http://localhost:3000";

export const getPersonas = async (token) => {
  const response = await fetch(`${API}/personas`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return response.json();
};
export const updatePersona = async (token, cedula, data) => {
  const response = await fetch(`${API}/personas/${cedula}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deletePersona = async (token, cedula) => {
  const response = await fetch(`${API}/personas/${cedula}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });
  console.log(response);
  
  return response.json();
};

export const deleteUsuario = async (token, username) => {
  const response = await fetch(`${API}/borrar/usuario/${username}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });
  return response.json();
};

export const updateUsuario = async (token, username, data) => {
  const response = await fetch(`${API}/usuarios/${username}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getUsuarios = async (token) => {
  const response = await fetch(`${API}/usuarios`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return response.json();
};
export const registerUser = async (data) => {
  const response = await fetch(`${API}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
export const getVendedores = async (token) => {
  const response = await fetch(`${API}/personas/vendedores/list`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  return response.json();
};
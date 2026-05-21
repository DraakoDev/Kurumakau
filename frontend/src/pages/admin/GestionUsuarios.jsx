import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BotonLogout } from "../../components/BotonLogout.jsx";
import {
  getPersonas,
  getUsuarios,
  getVendedores,
  registerUser,
} from "../../services/userService";

import { DynamicTable } from "../../components/tables/DynamicTable";

export const GestionUsuarios = () => {
  const [active, setActive] = useState("personas");

  const [data, setData] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    direccion: "",
    tipo_usuario: "",
    username: "",
    password: "",
  });

  const loadData = useCallback(async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];

    try {
      if (active === "personas") {
        const res = await getPersonas(token);
        setData(res.data || []);
      }

      if (active === "usuarios") {
        const res = await getUsuarios(token);
        setData(res.data || []);
      }

      if (active === "vendedores") {
        const res = await getVendedores(token);
        setData(res.data || []);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setData([]);
    }
  }, [active]);

  useEffect(() => {
    const load = async () => {
      await loadData();
    };

    load();
  }, [loadData]);

  const handleCreateInputChange = (key, value) => {
    setNewUserForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetNewUserForm = () => {
    setNewUserForm({
      cedula: "",
      nombre: "",
      apellido: "",
      telefono: "",
      correo: "",
      direccion: "",
      tipo_usuario: "",
      username: "",
      password: "",
    });
  };

  const closeCreateModal = () => {
    resetNewUserForm();
    setShowCreateModal(false);
  };

  const validateNewUserForm = () => {
    const {
      cedula,
      nombre,
      apellido,
      telefono,
      correo,
      direccion,
      tipo_usuario,
      username,
      password,
    } = newUserForm;

    if (
      !cedula ||
      !nombre ||
      !apellido ||
      !telefono ||
      !correo ||
      !direccion ||
      !tipo_usuario ||
      !username ||
      !password
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Todos los campos son obligatorios.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    if (!/^\d+$/.test(cedula)) {
      Swal.fire({
        icon: "warning",
        title: "Cédula inválida",
        text: "La cédula solo debe contener números.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    if (!/^\d+$/.test(telefono) || telefono.length < 7) {
      Swal.fire({
        icon: "warning",
        title: "Teléfono inválido",
        text: "Ingresa un teléfono válido.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Ingresa un correo válido.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    if (username.length < 4) {
      Swal.fire({
        icon: "warning",
        title: "Usuario inválido",
        text: "El usuario debe tener al menos 4 caracteres.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña insegura",
        text: "La contraseña debe tener al menos 6 caracteres.",
        confirmButtonColor: "#f97316",
      });
      return false;
    }

    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateNewUserForm()) return;

    setIsRegistering(true);

    try {
      const response = await registerUser(newUserForm);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Usuario registrado",
          text: "El nuevo usuario se creó correctamente.",
          confirmButtonColor: "#22c55e",
        });
        closeCreateModal();
        setActive("usuarios");
        await loadData();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Error",
          text: response.error || "No se pudo crear el usuario.",
          confirmButtonColor: "#f97316",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "No se pudo conectar con el servidor.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const personaColumns = [
    {
      key: "cedula",
      label: "Cédula",
    },

    {
      key: "nombre",
      label: "Nombre",
    },

    {
      key: "apellido",
      label: "Apellido",
    },

    {
      key: "direccion",
      label: "Dirección",
    },

    {
      key: "telefono",
      label: "Teléfono",
    },

    {
      key: "correo",
      label: "Correo",
    },
  ];

  const usuarioColumns = [
    {
      key: "nombre_usuario",
      label: "Usuario",
    },

    {
      key: "tipo",
      label: "Tipo",
    },
  ];

  const vendedorColumns = [
    {
      key: "cedula",
      label: "Cédula",
    },

    {
      key: "nombre",
      label: "Nombre",
    },

    {
      key: "apellido",
      label: "Apellido",
    },

    {
      key: "direccion",
      label: "Dirección",
    },

    {
      key: "telefono",
      label: "Teléfono",
    },

    {
      key: "correo",
      label: "Correo",
    },

    {
      key: "tipo",
      label: "Tipo",
    },
  ];

  return (
    <div
      className="
        min-h-screen
        bg-[#09090b]
        relative
        overflow-hidden
        p-8
        text-white
      "
    >
      {/* EFECTOS FONDO */}

      <div
        className="
          absolute
          w-125
          h-125
          bg-orange-500/10
          blur-3xl
          rounded-full
          -top-40
          -left-40
        "
      />

      <div
        className="
          absolute
          w-100
          h-100
          bg-purple-500/10
          blur-3xl
          rounded-full
          bottom-0
          right-0
        "
      />

      {/* CONTENIDO */}

      <div className="relative z-10 space-y-8">
        {/* HEADER */}

        <section
          className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
          "
        >
          <div>
            <h1
              className="
                text-5xl
                font-black
                tracking-tight
                text-white
              "
            >
              Gestión de Usuarios
            </h1>

            <p
              className="
                text-zinc-400
                mt-3
                text-sm
              "
            >
              Administra personas, usuarios y vendedores del sistema.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="
              h-14
              px-8
              rounded-2xl
              bg-orange-500
              hover:bg-orange-400
              text-white
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-[0_10px_30px_rgba(249,115,22,.25)]
              cursor-pointer
            "
          >
            Nuevo usuario
          </button>
        </section>

        {/* BOTONES */}

        <section
          className="
            flex
            flex-wrap
            gap-4
          "
        >
          <button
            onClick={() => setActive("personas")}
            className={`
              h-14
              px-7
              rounded-2xl
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]

              ${
                active === "personas"
                  ? `
                  bg-orange-500
                  text-white
                  shadow-[0_10px_30px_rgba(249,115,22,.25)]
                `
                  : `
                  bg-[#111111]
                  border
                  border-white/5
                  text-zinc-300
                  hover:bg-white/3
                `
              }
            `}
          >
            Personas
          </button>

          <button
            onClick={() => setActive("usuarios")}
            className={`
              h-14
              px-7
              rounded-2xl
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]

              ${
                active === "usuarios"
                  ? `
                  bg-orange-500
                  text-white
                  shadow-[0_10px_30px_rgba(249,115,22,.25)]
                `
                  : `
                  bg-[#111111]
                  border
                  border-white/5
                  text-zinc-300
                  hover:bg-white/3
                `
              }
            `}
          >
            Usuarios
          </button>

          <button
            onClick={() => setActive("vendedores")}
            className={`
              h-14
              px-7
              rounded-2xl
              font-semibold
              transition-all
              duration-300
              hover:scale-[1.02]
              active:scale-[0.98]

              ${
                active === "vendedores"
                  ? `
                  bg-orange-500
                  text-white
                  shadow-[0_10px_30px_rgba(249,115,22,.25)]
                `
                  : `
                  bg-[#111111]
                  border
                  border-white/5
                  text-zinc-300
                  hover:bg-white/3
                `
              }
            `}
          >
            Vendedores
          </button>
        </section>

        {/* TABLA */}

        <section
          className="
            bg-[#111111]
            border
            border-white/5
            rounded-4xl
            p-8
            shadow-[0_0_40px_rgba(0,0,0,.35)]
          "
        >
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              mb-8
            "
          >
            <div>
              <h2
                className="
                  text-3xl
                  font-black
                  text-white
                "
              >
                {active === "personas"
                  ? "Listado de personas"
                  : active === "usuarios"
                    ? "Listado de usuarios"
                    : "Listado de vendedores"}
              </h2>

              <p className="text-zinc-500 mt-2 text-sm">
                {active === "personas"
                  ? "Consulta todas las personas registradas."
                  : active === "usuarios"
                    ? "Administra los usuarios del sistema."
                    : "Consulta los vendedores registrados."}
              </p>
            </div>

            <button
              className="
                h-14
                px-7
                rounded-2xl
                bg-orange-500
                hover:bg-orange-400
                text-white
                font-semibold
                transition-all
                duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
                shadow-[0_10px_30px_rgba(249,115,22,.25)]
              "
            >
              Exportar datos
            </button>
          </div>

          <div
            className="
              overflow-x-auto
              rounded-2xl
            "
          >
            {active === "personas" && (
              <DynamicTable
                columns={personaColumns}
                data={data}
                entityType={active}
                onDataChange={loadData}
              />
            )}

            {active === "usuarios" && (
              <DynamicTable
                columns={usuarioColumns}
                data={data}
                entityType={active}
                onDataChange={loadData}
              />
            )}

            {active === "vendedores" && (
              <DynamicTable
                columns={vendedorColumns}
                data={data}
                entityType={active}
                onDataChange={loadData}
              />
            )}
          </div>

          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
              <div className="max-w-3xl w-full rounded-3xl bg-white p-8 text-slate-900 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Nuevo usuario</h2>
                  <button
                    onClick={closeCreateModal}
                    className="text-slate-500 hover:text-slate-900"
                  >
                    Cerrar
                  </button>
                </div>

                <form
                  onSubmit={handleCreateUser}
                  className="grid gap-6 sm:grid-cols-2"
                >
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Cédula
                    </span>
                    <input
                      value={newUserForm.cedula}
                      onChange={(e) =>
                        handleCreateInputChange("cedula", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Cédula"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Nombre
                    </span>
                    <input
                      value={newUserForm.nombre}
                      onChange={(e) =>
                        handleCreateInputChange("nombre", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Nombre"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Apellido
                    </span>
                    <input
                      value={newUserForm.apellido}
                      onChange={(e) =>
                        handleCreateInputChange("apellido", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Apellido"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Teléfono
                    </span>
                    <input
                      value={newUserForm.telefono}
                      onChange={(e) =>
                        handleCreateInputChange("telefono", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Teléfono"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-600">
                      Correo
                    </span>
                    <input
                      value={newUserForm.correo}
                      onChange={(e) =>
                        handleCreateInputChange("correo", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Correo"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-medium text-slate-600">
                      Dirección
                    </span>
                    <input
                      value={newUserForm.direccion}
                      onChange={(e) =>
                        handleCreateInputChange("direccion", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Dirección"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Tipo de usuario
                    </span>
                    <select
                      value={newUserForm.tipo_usuario}
                      onChange={(e) =>
                        handleCreateInputChange("tipo_usuario", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                    >
                      <option value="">Selecciona un tipo</option>
                      <option value="admin">Admin</option>
                      <option value="vendedor">Vendedor</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Usuario
                    </span>
                    <input
                      value={newUserForm.username}
                      onChange={(e) =>
                        handleCreateInputChange("username", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Usuario"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-600">
                      Contraseña
                    </span>
                    <input
                      value={newUserForm.password}
                      type="password"
                      onChange={(e) =>
                        handleCreateInputChange("password", e.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-orange-500"
                      placeholder="Contraseña"
                    />
                  </label>

                  <div className="sm:col-span-2 flex flex-wrap gap-4 justify-end mt-4">
                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="rounded-2xl border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="rounded-2xl bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-600 disabled:opacity-60"
                    >
                      {isRegistering ? "Creando..." : "Crear usuario"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
        <BotonLogout />
      </div>
    </div>
  );
};

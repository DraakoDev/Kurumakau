CREATE DATABASE IF NOT EXISTS concesionario_db;
USE concesionario_db;

CREATE TABLE empresa (
    nit VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE registro_empresa (
    nit VARCHAR(20) NOT NULL PRIMARY KEY,
    fecha_registro DATE NOT NULL,
    tipo_empresa VARCHAR(50) NOT NULL,
    CONSTRAINT fk_registro_empresa_empresa
        FOREIGN KEY (nit) REFERENCES empresa(nit),
    CONSTRAINT chk_tipo_empresa
        CHECK (tipo_empresa IN ('CONCESIONARIO', 'SERVICIO'))
);

CREATE TABLE concesionario (
    nit VARCHAR(20) NOT NULL PRIMARY KEY,
    tipo_automoviles VARCHAR(100) NOT NULL,
    CONSTRAINT fk_concesionario_registro_empresa
        FOREIGN KEY (nit) REFERENCES registro_empresa(nit),
    CONSTRAINT chk_tipo_automoviles
        CHECK (tipo_automoviles IN ('NUEVOS', 'USADOS', 'MIXTOS'))
);

CREATE TABLE servicio_oficial (
    nit VARCHAR(20) NOT NULL PRIMARY KEY,
    concesionario_nit VARCHAR(20) NOT NULL,
    CONSTRAINT fk_servicio_oficial_registro_empresa
        FOREIGN KEY (nit) REFERENCES registro_empresa(nit),
    CONSTRAINT fk_servicio_oficial_concesionario
        FOREIGN KEY (concesionario_nit) REFERENCES concesionario(nit)
);

CREATE TABLE persona (
    cedula VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cliente (
    cedula VARCHAR(20) NOT NULL PRIMARY KEY,
    cantidad_compras INT DEFAULT 0,
    CONSTRAINT fk_cliente_persona
        FOREIGN KEY (cedula)
        REFERENCES persona(cedula)
        ON DELETE CASCADE
);

CREATE TABLE vendedor (
    cedula VARCHAR(20) NOT NULL PRIMARY KEY,
    registro_empresa_nit VARCHAR(20) NOT NULL,
    CONSTRAINT fk_vendedor_persona
        FOREIGN KEY (cedula)
        REFERENCES persona(cedula)
        ON DELETE CASCADE,

    CONSTRAINT fk_vendedor_registro_empresa
        FOREIGN KEY (registro_empresa_nit)
        REFERENCES registro_empresa(nit)
);

CREATE TABLE usuario (
    nombre_usuario VARCHAR(50) PRIMARY KEY,
    contrasena VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    tipo VARCHAR(20) NOT NULL,

    CONSTRAINT fk_usuario_persona 
        FOREIGN KEY (cedula)
        REFERENCES persona(cedula)
        ON DELETE CASCADE,

    CONSTRAINT chk_usuario_tipo
        CHECK (tipo IN ('admin', 'vendedor', 'cliente'))
);

CREATE TABLE marca (
    nombre VARCHAR(50) PRIMARY KEY
);

CREATE TABLE modelo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    marca_nombre VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_modelo_marca
        FOREIGN KEY (marca_nombre) REFERENCES marca(nombre),
    CONSTRAINT uq_modelo_marca_nombre
        UNIQUE (marca_nombre, nombre)
);

CREATE TABLE automovil (
    numero_bastidor VARCHAR(20) PRIMARY KEY,
    modelo_id INT NOT NULL,
    estado VARCHAR(20) NOT NULL,
    registro_empresa_nit VARCHAR(20) NOT NULL,
    CONSTRAINT fk_automovil_modelo
        FOREIGN KEY (modelo_id) REFERENCES modelo(id),
    CONSTRAINT fk_automovil_registro_empresa
        FOREIGN KEY (registro_empresa_nit) REFERENCES registro_empresa(nit),
    CONSTRAINT chk_automovil_estado
        CHECK (estado IN ('DISPONIBLE', 'VENDIDO', 'PROCESO'))
);

CREATE TABLE color (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE ficha_tecnica (
    modelo_id INT NOT NULL PRIMARY KEY,
    cilindraje DECIMAL(10, 2) NOT NULL,
    potencia DECIMAL(10, 2) NOT NULL,
    torque DECIMAL(10, 2) NOT NULL,
    motor VARCHAR(50) NOT NULL,
    combustible VARCHAR(50) NOT NULL,
    carroceria VARCHAR(50) NOT NULL,
    color_id INT NOT NULL,
    CONSTRAINT fk_ficha_tecnica_modelo
        FOREIGN KEY (modelo_id) REFERENCES modelo(id),
    CONSTRAINT fk_ficha_tecnica_color
        FOREIGN KEY (color_id) REFERENCES color(id)
);

CREATE TABLE accesorio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE equipamiento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    modelo_id INT NOT NULL,
    accesorio_id INT NOT NULL,
    es_extra BOOLEAN NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_equipamiento_modelo
        FOREIGN KEY (modelo_id) REFERENCES modelo(id),
    CONSTRAINT fk_equipamiento_accesorio
        FOREIGN KEY (accesorio_id) REFERENCES accesorio(id)
);

CREATE TABLE venta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_bastidor VARCHAR(20) NOT NULL UNIQUE,
    cedula_vendedor VARCHAR(20) NOT NULL,
    fecha_entrega DATE NOT NULL,
    fecha_venta DATE NOT NULL,
    matricula_asignada VARCHAR(20) NOT NULL UNIQUE,
    es_encargo BOOLEAN NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_venta_automovil
        FOREIGN KEY (numero_bastidor) REFERENCES automovil(numero_bastidor),
    CONSTRAINT fk_venta_vendedor
        FOREIGN KEY (cedula_vendedor) REFERENCES vendedor(cedula),
    CONSTRAINT chk_venta_metodo_pago
        CHECK (metodo_pago IN ('EFECTIVO', 'TARJETA', 'FINANCIAMIENTO'))
);

CREATE TABLE extra_venta (
    venta_id INT NOT NULL,
    equipamiento_id INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (venta_id, equipamiento_id),
    CONSTRAINT fk_extra_venta_venta
        FOREIGN KEY (venta_id) REFERENCES venta(id),
    CONSTRAINT fk_extra_venta_equipamiento
        FOREIGN KEY (equipamiento_id) REFERENCES equipamiento(id)
);

CREATE TABLE descuento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    porcentaje DECIMAL(5, 2) NOT NULL,
    descripcion VARCHAR(200) NOT NULL
);

CREATE TABLE descuento_aplicado (
    automovil_id VARCHAR(20) NOT NULL,
    descuento_id INT NOT NULL,
    PRIMARY KEY (automovil_id, descuento_id),
    CONSTRAINT fk_descuento_aplicado_automovil
        FOREIGN KEY (automovil_id) REFERENCES automovil(numero_bastidor),
    CONSTRAINT fk_descuento_aplicado_descuento
        FOREIGN KEY (descuento_id) REFERENCES descuento(id)
);
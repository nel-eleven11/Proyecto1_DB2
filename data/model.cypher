//CREAR

//Nodos
// Crear usuarios
CREATE (:Usuario {id_usuario: "usuario", nombre: "nombre", apellido: "apellido", fecha_nacimiento: date(""), telefono: "telefono", email: "juan@example.com", pais: "pais", ciudad: "ciudad", nit: "123456789", fecha_registro: date("")});

// Crear cuentas
CREATE (:Cuenta {id_cuenta: "cuenta", tipo: "tipo", saldo: 0, fecha_apertura: date(""), fecha_cierre: null, estado: "estado"});

// Crear bancos
CREATE (:Banco {id_banco: "banco", nombre: "nombre", pais: "pais", direccion: "zona", telefono: "22223333", sitio_web: "www.bancox.com"});

// Crear transacciones
CREATE (:Transaccion {id_transaccion: "transaccion", monto: 150, moneda_tipo: "moneda", fecha_hora: datetime(""), motivo: "motivo"});

// Crear empresas
CREATE (:Empresa {id_empresa: "empresa", nombre: "empresa", tipo: "tipo", sector: "sector", pais: "pais", telefono: "55556666", email: "empresa@example.com", direccion: "direccion"});

// Crear tarjetas
CREATE (:Tarjeta {id_tarjeta: "tarjeta", tipo: "tipo", contactless: true, marca: "marca", fecha_expiracion: date(""), estado: "estado", numero: "1234-5678-9012-3456"});


// Crear dispositivos
CREATE (:Dispositivo {id_dispositivo: "dispotivo", tipo: "tipo", marca: "marca", modelo: "modelo", sistema_operativo: "os", fecha_ultimo_uso: datetime("")});

//Relaciones

//Usuario → TIENE → Cuenta
MATCH (u:Usuario {id_usuario: "usuario"}), (c:Cuenta {id_cuenta: "cuenta"})
CREATE (u)-[:TIENE {status: "status", cliente_vip: true, seguro: true}]->(c);

//Transacción → DESTINO → Cuenta
MATCH (t:Transaccion {id_transaccion: "trans"}), (c:Cuenta {id_cuenta: "cuenta"})
CREATE (t)-[:DESTINO {tiempo_transferencia: time("00:30:00"), confirmada_por_destino: true, internacional: false}]->(c);

//Banco → PROVEE → Cuenta
MATCH (b:Banco {id_banco: "banco"}), (c:Cuenta {id_cuenta: "cuenta"})
CREATE (b)-[:PROVEE {sucursal_origen: "eucursal", actividad_reciente: true, networking: true}]->(c);

//Banco → CONEXION_CON → Banco
MATCH (b1:Banco {id_banco: "banco1"}), (b2:Banco {id_banco: "banco2"})
CREATE (b1)-[:CONEXION_CON {tipo_conexion: "tipo", monto_total_movido: 500000, frecuencia_transacciones: 100}]->(b2);

//Empresa → TIENE → Cuenta
MATCH (e:Empresa {id_empresa: "empresa"}), (c:Cuenta {id_cuenta: "cuenta"})
CREATE (e)-[:TIENE {cliente_vip: false, status: "status", seguro: true}]->(c);

//Tarjeta → ASOCIADA_A → Cuenta
MATCH (t:Tarjeta {id_tarjeta: "tarjeta"}), (c:Cuenta {id_cuenta: "cuenta"})
CREATE (t)-[:ASOCIADA_A {limite_credito: 10000, numero_de_uso: 5, fecha_asociacion: date("")}]->(c);

//Dispositivo → USADO_EN → Transacción
MATCH (d:Dispositivo {id_dispositivo: "dispositivo"}), (t:Transaccion {id_transaccion: "transaccion"})
CREATE (d)-[:USADO_EN {conexion: "con", ip_asociados: ["192.168.1.1", "10.0.0.2"], ubicacion: "ubicacion"}]->(t);

//Tarjeta → REALIZA → Transacción
MATCH (t:Tarjeta {id_tarjeta: "tarjeta"}), (tx:Transaccion {id_transaccion: "transaccion"})
CREATE (t)-[:REALIZA {aprobada: true, tiempo_ejecucion: 0, nit: "nit"}]->(tx);

//Usuario → POSEE → Dispositivo
MATCH (u:Usuario {id_usuario: "usuario"}), (d:Dispositivo {id_dispositivo: "dispositivo"})
CREATE (u)-[:POSEE {huella_dactilar: true, reconocimiento_facial: false, ubicaciones: ["Casa", "Oficina"]}]->(d);

//Usuario → PROPIETARIO → Tarjeta
MATCH (u:Usuario {id_usuario: "usaer"}), (t:Tarjeta {id_tarjeta: "tarjeta"})
CREATE (u)-[:PROPIETARIO {chip: true, tiempo_de_uso: time("02:00:00"), membresia: "mem"}]->(t);


//READ

//Nodos

//Match usuario
MATCH (u:Usuario {id_usuario: "usuario"})
RETURN u;

//Match cuenta
MATCH (c:Cuenta {id_cuenta: "cuenta"})
RETURN c;

//Match banco
MATCH (b:Banco {id_banco: "banco"})
RETURN b;

//Match transaccion
MATCH (t:Transaccion {id_transaccion: "transaccion"})
RETURN t;

//Match empresa
MATCH (e:Empresa {id_empresa: "empresa"})
RETURN e;

//Match tarjeta
MATCH (t:Tarjeta {id_tarjeta: "tarjeta"})
RETURN t;

//Match dispositivo
MATCH (d:Dispositivo {id_dispositivo: "dispositivo"})
RETURN d;

//Relaciones

//Match usuario → TIENE → Cuenta
MATCH (u:Usuario {id_usuario: "usuario"})-[r:TIENE]->(c:Cuenta {id_cuenta: "cuenta"})
RETURN r;

//Match transacción → DESTINO → Cuenta
MATCH (t:Transaccion {id_transaccion: "transacion"})-[r:DESTINO]->(c:Cuenta {id_cuenta: "cuenta"})
RETURN r;

//Match banco → PROVEE → Cuenta
MATCH (b:Banco {id_banco: "banco"})-[r:PROVEE]->(c:Cuenta {id_cuenta: "cuenta"})
RETURN r;

//Match banco → CONEXION_CON → Banco
MATCH (b1:Banco {id_banco: "banco1"})-[r:CONEXION_CON]->(b2:Banco {id_banco: "banco2"})
RETURN r;

//Match empresa → TIENE → Cuenta
MATCH (e:Empresa {id_empresa: "empresa"})-[r:TIENE]->(c:Cuenta {id_cuenta: "cuenta"})
RETURN r;

//Match tarjeta → ASOCIADA_A → Cuenta
MATCH (t:Tarjeta {id_tarjeta: "tarjeta"})-[r:ASOCIADA_A]->(c:Cuenta {id_cuenta: "cuenta"})
RETURN r;

//Match dispositivo → USADO_EN → Transacción
MATCH (d:Dispositivo {id_dispositivo: "dispositivo"})-[r:USADO_EN]->(t:Transaccion {id_transaccion: "transaccion"})
RETURN r;

//Match tarjeta → REALIZA → Transacción
MATCH (t:Tarjeta {id_tarjeta: "tarjeta"})-[r:REALIZA]->(tx:Transaccion {id_transaccion: "transaccion"})
RETURN r;

//Match usuario → POSEE → Dispositivo
MATCH (u:Usuario {id_usuario: "usuario"})-[r:POSEE]->(d:Dispositivo {id_dispositivo: "dispositivo"})
RETURN r;

//Match usuario → PROPIETARIO → Tarjeta
MATCH (u:Usuario {id_usuario: "usuario"})-[r:PROPIETARIO]->(t:Tarjeta {id_tarjeta: "tarjeta"})
RETURN r;

//UPDATE

//Nodos

//Actualizar usuario
MATCH (u:Usuario {id_usuario: "U123"})
SET u.nombre = "Juan Carlos",
    u.apellido = "Pérez López",
    u.telefono = "87654321",
    u.email = "juancarlos@example.com",
    u.pais = "El Salvador",
    u.ciudad = "San Salvador",
    u.nit = "987654321",
    u.fecha_registro = date("2024-03-01")
RETURN u;

//Actualizar cuenta
MATCH (c:Cuenta {id_cuenta: "C123"})
SET c.tipo = "Ahorro",
    c.saldo = 1000,
    c.fecha_apertura = date("2024-03-01"),
    c.fecha_cierre = null,
    c.estado = "Activa"
RETURN c;

//Actualizar banco
MATCH (b:Banco {id_banco: "B001"})
SET b.nombre = "Banco Y",
    b.pais = "Honduras",
    b.direccion = "Centro Financiero",
    b.telefono = "33334444",
    b.sitio_web = "www.bancoy.com"
RETURN b;


//Actualizar transacción
MATCH (t:Transaccion {id_transaccion: "T789"})
SET t.monto = 200,
    t.moneda_tipo = "USD",
    t.fecha_hora = datetime("2024-03-01T14:45:00"),
    t.motivo = "Compra en línea"
RETURN t;

//Actualizar empresa
MATCH (e:Empresa {id_empresa: "E001"})
SET e.nombre = "Tech Solutions",
    e.tipo = "Fintech",
    e.sector = "Banca",
    e.pais = "México",
    e.telefono = "77778888",
    e.email = "contacto@techsolutions.com",
    e.direccion = "Av. Reforma, CDMX"
RETURN e;

//Actualizar tarjeta
MATCH (t:Tarjeta {id_tarjeta: "TAR001"})
SET t.tipo = "Débito",
    t.contactless = false,
    t.marca = "MasterCard",
    t.fecha_expiracion = date("2028-06-30"),
    t.estado = "Bloqueada",
    t.numero = "5678-1234-9012-3456"
RETURN t;

//Actualizar dispositivo
MATCH (d:Dispositivo {id_dispositivo: "D001"})
SET d.tipo = "Tablet",
    d.marca = "Apple",
    d.modelo = "iPad Pro",
    d.sistema_operativo = "iOS",
    d.fecha_ultimo_uso = datetime("2024-03-02T10:30:00")
RETURN d;

//Relaciones

//Actualizar relación usuario → TIENE → Cuenta
MATCH (u:Usuario {id_usuario: "U123"})-[r:TIENE]->(c:Cuenta {id_cuenta: "C456"})
SET r.status = "Suspendida",
    r.cliente_vip = false,
    r.seguro = false
RETURN r;

//Actualizar relación transacción → DESTINO → Cuenta
MATCH (t:Transaccion {id_transaccion: "T789"})-[r:DESTINO]->(c:Cuenta {id_cuenta: "C456"})
SET r.tiempo_transferencia = time("01:00:00"),
    r.confirmada_por_destino = false,
    r.internacional = true
RETURN r;

//Actualizar relación banco → PROVEE → Cuenta
MATCH (b:Banco {id_banco: "B001"})-[r:PROVEE]->(c:Cuenta {id_cuenta: "C456"})
SET r.sucursal_origen = "Sucursal Norte",
    r.actividad_reciente = false,
    r.networking = false
RETURN r;


//Actualizar relación banco → CONEXION_CON → Banco
MATCH (b1:Banco {id_banco: "B001"})-[r:CONEXION_CON]->(b2:Banco {id_banco: "B002"})
SET r.tipo_conexion = "Local",
    r.monto_total_movido = 800000,
    r.frecuencia_transacciones = 50
RETURN r;

//Actualizar relación empresa → TIENE → Cuenta
MATCH (e:Empresa {id_empresa: "E001"})-[r:TIENE]->(c:Cuenta {id_cuenta: "C456"})
SET r.cliente_vip = true,
    r.status = "Suspendida",
    r.seguro = false
RETURN r;

//Actualizar relación tarjeta → ASOCIADA_A → Cuenta
MATCH (t:Tarjeta {id_tarjeta: "TAR001"})-[r:ASOCIADA_A]->(c:Cuenta {id_cuenta: "C456"})
SET r.limite_credito = 5000,
    r.numero_de_uso = 10,
    r.fecha_asociacion = date("2023-08-15")
RETURN r;

//Actualizar relación dispositivo → USADO_EN → Transacción
MATCH (d:Dispositivo {id_dispositivo: "D001"})-[r:USADO_EN]->(t:Transaccion {id_transaccion: "T789"})
SET r.conexion = "Datos móviles",
    r.ip_asociados = ["192.168.10.1", "172.16.0.1"],
    r.ubicacion = "Costa Rica"
RETURN r;

//Actualizar relación tarjeta → REALIZA → Transacción
MATCH (t:Tarjeta {id_tarjeta: "TAR001"})-[r:REALIZA]->(tx:Transaccion {id_transaccion: "T789"})
SET r.aprobada = false,
    r.tiempo_ejecucion = 3,
    r.nit = "87654321"
RETURN r;


//Actualizar relación usuario → POSEE → Dispositivo
MATCH (u:Usuario {id_usuario: "U123"})-[r:POSEE]->(d:Dispositivo {id_dispositivo: "D001"})
SET r.huella_dactilar = false,
    r.reconocimiento_facial = true,
    r.ubicaciones = ["Oficina", "Cafetería"]
RETURN r;

//Actualizar relación usuario → PROPIETARIO → Tarjeta
MATCH (u:Usuario {id_usuario: "U123"})-[r:PROPIETARIO]->(t:Tarjeta {id_tarjeta: "TAR001"})
SET r.chip = false,
    r.tiempo_de_uso = time("04:30:00"),
    r.membresia = "Gold"
RETURN r;

//DELETE

// ELIMINAR RELACIONES PRIMERO (para evitar errores de restricciones)

// Eliminar relación Usuario → TIENE → Cuenta
MATCH (:Usuario {id_usuario: "U123"})-[r:TIENE]->(:Cuenta {id_cuenta: "C456"})
DELETE r;

// Eliminar relación Transacción → DESTINO → Cuenta
MATCH (:Transaccion {id_transaccion: "T789"})-[r:DESTINO]->(:Cuenta {id_cuenta: "C456"})
DELETE r;

// Eliminar relación Banco → PROVEE → Cuenta
MATCH (:Banco {id_banco: "B001"})-[r:PROVEE]->(:Cuenta {id_cuenta: "C456"})
DELETE r;

// Eliminar relación Banco → CONEXION_CON → Banco
MATCH (:Banco {id_banco: "B001"})-[r:CONEXION_CON]->(:Banco {id_banco: "B002"})
DELETE r;

// Eliminar relación Empresa → TIENE → Cuenta
MATCH (:Empresa {id_empresa: "E001"})-[r:TIENE]->(:Cuenta {id_cuenta: "C456"})
DELETE r;

// Eliminar relación Tarjeta → ASOCIADA_A → Cuenta
MATCH (:Tarjeta {id_tarjeta: "TAR001"})-[r:ASOCIADA_A]->(:Cuenta {id_cuenta: "C456"})
DELETE r;

// Eliminar relación Dispositivo → USADO_EN → Transacción
MATCH (:Dispositivo {id_dispositivo: "D001"})-[r:USADO_EN]->(:Transaccion {id_transaccion: "T789"})
DELETE r;

// Eliminar relación Tarjeta → REALIZA → Transacción
MATCH (:Tarjeta {id_tarjeta: "TAR001"})-[r:REALIZA]->(:Transaccion {id_transaccion: "T789"})
DELETE r;

// Eliminar relación Usuario → POSEE → Dispositivo
MATCH (:Usuario {id_usuario: "U123"})-[r:POSEE]->(:Dispositivo {id_dispositivo: "D001"})
DELETE r;

// Eliminar relación Usuario → PROPIETARIO → Tarjeta
MATCH (:Usuario {id_usuario: "U123"})-[r:PROPIETARIO]->(:Tarjeta {id_tarjeta: "TAR001"})
DELETE r;


//ELIMINAR NODOS (Después de eliminar relaciones)

// Eliminar un Usuario
MATCH (u:Usuario {id_usuario: "U123"})
DELETE u;

// Eliminar una Cuenta
MATCH (c:Cuenta {id_cuenta: "C456"})
DELETE c;

// Eliminar un Banco
MATCH (b:Banco {id_banco: "B001"})
DELETE b;

// Eliminar una Transacción
MATCH (t:Transaccion {id_transaccion: "T789"})
DELETE t;

// Eliminar una Empresa
MATCH (e:Empresa {id_empresa: "E001"})
DELETE e;

// Eliminar una Tarjeta
MATCH (t:Tarjeta {id_tarjeta: "TAR001"})
DELETE t;

// Eliminar un Dispositivo
MATCH (d:Dispositivo {id_dispositivo: "D001"})
DELETE d;


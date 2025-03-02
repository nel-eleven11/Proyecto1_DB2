import csv
import random
import os

def generate_csv(filename, data, fieldnames):
    """Genera un archivo CSV con los datos proporcionados, asegurando que se escriba correctamente."""
    try:
        # Obtener la ruta absoluta del archivo
        abs_path = os.path.abspath(filename)
        print(f"Escribiendo en: {abs_path}")  # Debug: Verificar la ruta

        # Escribir el archivo
        with open(abs_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)

        print(f"Archivo guardado correctamente en: {abs_path}")
    
    except Exception as e:
        print(f"Error al escribir el archivo: {e}")


#Generacion de datos para los nodos

paises = ["Guatemala", "Honduras", "El Salvador", "Nicaragua", "Costa Rica", "Panamá", "Belice"]
ciudades = ["Capital", "Ciudad1", "Ciudad2", "Ciudad3", "Ciudad4", "Ciudad5", "Ciudad6", "Ciudad7", "Ciudad8", "Ciudad9"]
nits = []

def generate_users(n):
    """Genera datos de usuarios."""
    users = []
    nit = 0
    for i in range(1, n+1):
        nit = str(random.randint(100000000,999999999))
        if nit in nits:
            while nit in nits:
                nit = str(random.randint(100000000,999999999))
        
        users.append({
            "id_usuario": f"US{i}",
            "nombre": f"Usuario{i}",
            "apellido": f"Apellido{i}",
            "fecha_nacimiento": f"19{random.randint(70, 99)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "telefono": f"{random.randint(30000000,39999999)}",
            "email": f"usuario{i}@gmail.com",
            "pais": random.choice(paises),
            "ciudad": random.choice(ciudades),
            "nit": {nit},
            "fecha_registro": f"202{random.randint(0,3)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
        })
        nits.append(nit)
    return users

def generate_accounts(n):
    """Genera datos de cuentas."""
    accounts = []
    for i in range(1, n+1):
        rand = random.randint(1, 10)
        if rand <= 2:
            saldo = random.randint(1000, 15000)
        elif 2 < rand <= 5:
            saldo = random.randint(15000, 50000)
        elif 5 < rand <= 9:
            saldo = random.randint(50000, 85000)
        else:
            saldo = random.randint(85000, 100000)
        accounts.append({
            "id_cuenta": f"CU{i}",
            "tipo": random.choice(["Ahorro", "Monetario"]),
            "saldo": saldo,
            "fecha_apertura": f"202{random.randint(0,3)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "fecha_cierre": "" if random.random() > 0.8 else f"202{random.randint(4,6)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "estado": "Activa" if random.random() > 0.8 else "Bloqueada",
        })
    return accounts

bancos = ["BancoIndustrial", "BAC", "G&T", "BAM", "Banco de Antigua", "Banco de Occidente"]

def generate_banks(n):
    """Genera datos de bancos."""
    banks = []
    for i in range(1, n+1):
        banks.append({
            "id_banco": f"Bank{i}",
            "nombre": bancos[i-1],
            "pais": random.choice(paises),
            "direccion": f"zona {random.randint(1,20)} avenida {i}",
            "telefono": f"{random.randint(20000000,29999999)}",
            "sitio_web": f"www.banco{bancos[i-1]}{i}.com"
        })
    return banks

def generate_transactions(n):
    """Genera datos de transacciones."""
    transactions = []
    for i in range(1, n+1):
        rand = random.randint(1, 10)
        if rand <= 2:
            monto = random.randint(500, 7500)
        elif 2 < rand <= 6:
            monto = random.randint(8000, 19999)
        elif 6 < rand <= 9:
            monto = random.randint(20000, 35000)
        else:
            monto = random.randint(40000, 50000)
        transactions.append({
            "id_transaccion": f"T{i}",
            "monto": monto,
            "moneda_tipo": random.choice(["GTQ", "USD", "EUR"]),
            "fecha_hora": f"2024-{random.randint(1,12):02d}-{random.randint(1,28):02d}T{random.randint(0,23):02d}:{random.randint(0,59):02d}:00",
            "motivo": f"Motivo: {i}"
        })
    return transactions

def generate_cards(n):
    """Genera datos de tarjetas."""
    cards = []
    for i in range(1, n+1):
        cards.append({
            "id_tarjeta": f"TAR{i}",
            "tipo": random.choice(["Crédito", "Débito"]),
            "contactless": random.choice(["true", "false"]),
            "marca": random.choice(["Visa", "MasterCard", "AmericanExpress"]),
            "fecha_expiracion": f"202{random.randint(5,9)}-{random.randint(1,12):02d}-01",
            "estado": "Bloqueada" if random.random() > 0.95 else "Activa",
            "numero": f"{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}"
        })
    return cards

def generate_devices(n):
    """Genera datos de dispositivos."""
    devices = []
    for i in range(1, n+1):
        devices.append({
            "id_dispositivo": f"DV{i}",
            "tipo": random.choice(["Móvil", "Laptop", "Tablet"]),
            "marca": random.choice(["Samsung", "Apple"]),
            "modelo": f"Modelo {i}",
            "sistema_operativo": random.choice(["Android", "iOS", "Windows"]),
            "fecha_ultimo_uso": f"2024-{random.randint(1,12):02d}-{random.randint(1,28):02d}T{random.randint(0,23):02d}:{random.randint(0,59):02d}:00"
        })
    return devices

def generate_companies(n):
    """Genera datos de empresas."""
    companies = []
    for i in range(1, n+1):
        companies.append({
            "id_empresa": f"EMP{i}",
            "nombre": f"Empresa {i} CO",
            "tipo": random.choice(["Sociedad Anónima", "Sociedad Limitada, " "Sociedad Colectiva"]),
            "sector": random.choice(["Software", "Banca", "Alimentos", "Automotriz"]),
            "pais": random.choice(paises),
            "telefono": f"{random.randint(40000000,49999999)}",
            "email": f"empresa{i}@gmail.com",
            "direccion": f"Direccion {i} zona {random.randint(1,20)} avenida {i+5}"
        })
    return companies

#Generacion de datos para las relaciones

def generate_user_account_relationships(users, accounts):
    accounts_X = accounts.copy()
    """Genera relaciones de usuarios con cuentas."""
    relationships = []
    for user in users:
        account = random.choice(accounts_X)
        relationships.append({
            "id_usuario": user["id_usuario"],
            "id_cuenta": account["id_cuenta"],
            "status": account["estado"],
            "cliente_vip":  "true" if account["saldo"] > 85000 else "false",
            "seguro": random.choice(["true", "false"])
        })
        accounts_X.remove(account)
    return relationships, accounts_X

def generate_transaction_destination_relationships(transactions, accounts):
    """Genera relaciones de transacciones con cuentas destino."""
    relationships = []
    for transaction in transactions:
        account = random.choice(accounts)
        relationships.append({
            "id_transaccion": transaction["id_transaccion"],
            "id_cuenta": account["id_cuenta"],
            "tiempo_transferencia": "00:30:00",
            "confirmada_por_destino": "false" if random.random() > 0.95 else "true",
            "internacional": random.choice(["true", "false"])
        })
    return relationships

def generate_bank_provides_account_relationships(banks, accounts):
    """Genera relaciones de bancos que proveen cuentas."""
    relationships = []
    for account in accounts:
        bank = random.choice(banks)
        relationships.append({
            "id_banco": bank["id_banco"],
            "id_cuenta": account["id_cuenta"],
            "sucursal_origen": f"Sucursal {random.randint(1,5)}",
            "actividad_reciente": random.choice(["true", "false"]),
            "networking": random.choice(["true", "false"])
        })
    return relationships

def generate_bank_connection_relationships(banks):
    """Genera relaciones de conexión entre bancos."""
    relationships = []
    for i in range(len(banks) - 1):
        relationships.append({
            "id_banco1": banks[i]["id_banco"],
            "id_banco2": banks[i + 1]["id_banco"],
            "tipo_conexion": random.choice(["Nacional", "Internacional"]),
            "monto_total_movido": random.randint(100000, 1000000),
            "frecuencia_transacciones": random.randint(10, 500)
        })
    return relationships

def generate_company_account_relationships(companies, accounts):
    """Genera relaciones de empresas con cuentas."""
    accounts_X = accounts.copy()
    relationships = []
    for company in companies:
        account = random.choice(accounts_X)
        relationships.append({
            "id_empresa": company["id_empresa"],
            "id_cuenta": account["id_cuenta"],
            "cliente_vip": random.choice(["true"]),
            "status": "Bloqueada" if random.random() > 0.97 else "Activa",
            "seguro": random.choice(["true"])
        })
        accounts_X.remove(account)
    return relationships

def generate_card_account_relationships(cards, accounts):
    """Genera relaciones de tarjetas con cuentas."""
    accounts_X = accounts.copy()
    relationships = []
    for card in cards:
        rand = random.randint(1, 10)
        if rand <= 2:
            credito = random.randint(1000, 5000)
        elif 2 < rand <= 5:
            credito = random.randint(5000, 9999)
        elif 5 < rand <= 9:
            credito = random.randint(10000, 19999)
        else:
            credito = random.randint(20000, 30000)
        account = random.choice(accounts_X)
        relationships.append({
            "id_tarjeta": card["id_tarjeta"],
            "id_cuenta": account["id_cuenta"],
            "limite_credito": credito,
            "numero_de_uso": random.randint(1, 100),
            "fecha_asociacion": f"2024-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
        })
        accounts_X.remove(account)
    return relationships

def generate_user_device_relationships(users, devices):
    """Genera relaciones de usuarios con dispositivos."""
    relationships = []
    for user in users:
        device = random.choice(devices)
        relationships.append({
            "id_usuario": user["id_usuario"],
            "id_dispositivo": device["id_dispositivo"],
            "huella_dactilar": random.choice(["true", "false"]),
            "reconocimiento_facial": random.choice(["true", "false"]),
            "ubicaciones": random.choice(paises) + ", " + random.choice(ciudades)
        })
    return relationships

def generate_user_card_relationships(users, cards):
    """Genera relaciones de usuarios con tarjetas."""
    relationships = []
    for user in users:
        card = random.choice(cards)
        relationships.append({
            "id_usuario": user["id_usuario"],
            "id_tarjeta": card["id_tarjeta"],
            "chip": random.choice(["true", "false"]),
            "tiempo_de_uso": f"0{random.randint(1,9)}:{random.randint(0,59):02d}:00",
            "membresia": random.choice(["Básica", "Premium", "VIP"])
        })
    return relationships

def generate_device_transaction_relationships(devices, transactions):
    """Genera relaciones de dispositivos con transacciones."""
    relationships = []
    for device in devices:
        transaction = random.choice(transactions)
        relationships.append({
            "id_dispositivo": device["id_dispositivo"],
            "id_transaccion": transaction["id_transaccion"],
            "conexion": random.choice(["WiFi", "Datos móviles"]),
            "ip_asociados": f'["192.168.{random.randint(0,255)}.{random.randint(0,255)}", "10.0.{random.randint(0,255)}.{random.randint(0,255)}"]',
            "ubicacion": random.choice(paises) + ", " + random.choice(ciudades)
        })
    return relationships

def generate_card_transaction_relationships(cards, transactions):
    """Genera relaciones de tarjetas con transacciones."""
    relationships = []
    for card in cards:
        nit = nits[random.randint(0, len(nits) - 1)]
        transaction = random.choice(transactions)
        relationships.append({
            "id_tarjeta": card["id_tarjeta"],
            "id_transaccion": transaction["id_transaccion"],
            "aprobada": random.choice(["true", "false"]),
            "tiempo_ejecucion": random.randint(1, 10),
            "nit": nit
        })
        nits.remove(nit)
    return relationships



# Generar datos
users = generate_users(1000)
accounts = generate_accounts(1006)
banks = generate_banks(6)
transactions = generate_transactions(2000)
cards = generate_cards(1000)
devices = generate_devices(500)
companies = generate_companies(100)


# Generar archivos CSV
generate_csv("./data/nodos/usuarios.csv", users, users[0].keys())
generate_csv("./data/nodos/cuentas.csv", accounts, accounts[0].keys())
generate_csv("./data/nodos/bancos.csv", banks, banks[0].keys())
generate_csv("./data/nodos/transacciones.csv", transactions, transactions[0].keys())
generate_csv("./data/nodos/tarjetas.csv", cards, cards[0].keys())
generate_csv("./data/nodos/dispositivos.csv", devices, devices[0].keys())
generate_csv("./data/nodos/empresas.csv", companies, companies[0].keys())

print("CSV generados correctamente.")


# Guardar los CSV
dataRel, dataAcc = generate_user_account_relationships(users, accounts)

generate_csv("./data/relaciones/u_tienen_c.csv", dataRel, ["id_usuario", "id_cuenta", "status", "cliente_vip", "seguro"])
generate_csv("./data/relaciones/t_destino_c.csv", generate_transaction_destination_relationships(transactions, accounts), ["id_transaccion", "id_cuenta", "tiempo_transferencia", "confirmada_por_destino", "internacional"])
generate_csv("./data/relaciones/b_proveen_c.csv", generate_bank_provides_account_relationships(banks, dataAcc), ["id_banco", "id_cuenta", "sucursal_origen", "actividad_reciente", "networking"])
generate_csv("./data/relaciones/b_conexion_b.csv", generate_bank_connection_relationships(banks), ["id_banco1", "id_banco2", "tipo_conexion", "monto_total_movido", "frecuencia_transacciones"])
generate_csv("./data/relaciones/e_tienen_c.csv", generate_company_account_relationships(companies, accounts), ["id_empresa", "id_cuenta", "cliente_vip", "status", "seguro"])
generate_csv("./data/relaciones/t_asociadas_c.csv", generate_card_account_relationships(cards, accounts), ["id_tarjeta", "id_cuenta", "limite_credito", "numero_de_uso", "fecha_asociacion"])
generate_csv("./data/relaciones/d_usados_t.csv", generate_device_transaction_relationships(devices, transactions), ["id_dispositivo", "id_transaccion", "conexion", "ip_asociados", "ubicacion"])
generate_csv("./data/relaciones/t_realizan_t.csv", generate_card_transaction_relationships(cards, transactions), ["id_tarjeta", "id_transaccion", "aprobada", "tiempo_ejecucion", "nit"])
generate_csv("./data/relaciones/u_poseen_d.csv", generate_user_device_relationships(users, devices), ["id_usuario", "id_dispositivo", "huella_dactilar", "reconocimiento_facial", "ubicaciones"])
generate_csv("./data/relaciones/u_propietarios_t.csv", generate_user_card_relationships(users, cards), ["id_usuario", "id_tarjeta", "chip", "tiempo_de_uso", "membresia"])



from flask import Flask, render_template, request, redirect, url_for, session
import pyodbc
import secrets
import hashlib
from datetime import datetime


app = Flask(__name__)
clave_secreta = secrets.token_hex(16)
app.secret_key = clave_secreta

# Configuración de la conexión a la base de datos
server = 'ANTONIO'
database = 'PROGRAWEB'
username = 'sa'
password = 'h9cmhlci'
driver = 'ODBC Driver 17 for SQL Server'

# Configuración de la conexión a la base de datos
conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tienda')
def tienda():
    return render_template('tienda.html')
@app.route('/guardar_compra', methods=['POST'])
def guardar_compra():
    if request.method == 'POST':
         # Cambia a 'nombre_comprador'
        nombre_usuario = request.form['nombre_comprador']
        productos = request.form['productos']
        total_productos = request.form['total_productos']
        total_pagar = request.form['total_pagar']
    try:
         # Modifica esta consulta según tu esquema de base de datos
        cursor.execute("INSERT INTO detalle_venta (nombre_cliente, compra, total_productos, total_pagar, fecha) VALUES (?, ?, ?, ?, GETDATE())",
                    nombre_usuario, productos, total_productos, total_pagar)
        conn.commit()

        return redirect(url_for('index'))
    except Exception as e:
            # Manejar excepciones, podrías mostrar un mensaje más específico según el error
        error = f'Error al guardar la compra en la base de datos: {str(e)}'
        return render_template('error.html', error=error)

        
@app.route('/index2')
def index2():
    return render_template('index2.html')

@app.route('/comprar_boletos')
def comprar_boletos():
    # Puedes realizar cualquier lógica adicional aquí antes de la redirección
    # Establece la variable de sesión
    session['compra_boletos'] = True
    # Redirige a la página de inicio de sesión
    return redirect(url_for('iniciosesion'))

@app.route('/cerrar_sesion')
def cerrar_sesion():
    print("Cerrando sesión...")
    # Limpia todas las variables de sesión
    session.clear()
    print("Sesión cerrada.")
    # Redirige a la página principal
    return redirect(url_for('index'))

@app.route('/iniciosesion', methods=['GET', 'POST'])
def iniciosesion():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Hash de la contraseña
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Verificar las credenciales en la base de datos
        cursor.execute("SELECT * FROM Usuario WHERE Usuario = ? AND Contraseña = ?", username, hashed_password)
        user = cursor.fetchone()
        if user:
            # Inicio de sesión exitoso
            # Obtén los nombres de las columnas
            column_names = [column[0] for column in cursor.description]

            # Obtén el nombre de usuario usando los nombres de las columnas
            nombre_usuario = user[column_names.index('Usuario')]

            # Guarda el nombre de usuario en la sesión
            session['nombre_usuario'] = nombre_usuario

            # Verifica si la variable de sesión 'compra_boletos' está presente
            if session.get('compra_boletos'):
                # Limpia la variable de sesión
                session.pop('compra_boletos', None)
                # Redirige a la lista de espera
                return redirect(url_for('tienda'))
            else:
                # Redirige a la página principal u otra página según tus necesidades
                return redirect(url_for('index2'))
        else:
            # Inicio de sesión fallido
            error = 'Credenciales incorrectas. Inténtalo de nuevo.'
            return render_template('iniciosesion.html', error=error)
    return render_template('iniciosesion.html')

@app.route('/listaespera')
def listaespera():
    # Obtén el nombre de usuario de la sesión si está disponible
    nombre_usuario = session.get('nombre_usuario', None)
    # Puedes agregar lógica adicional aquí según tus necesidades
    return render_template('listaespera.html', nombre_usuario=nombre_usuario)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nuevo_usuario = request.form['nuevo_usuario']
        correo_electronico = request.form['correo_electronico']
        nueva_contrasena = request.form['nueva_contrasena']

        try:
            # Verificar si el usuario ya existe
            cursor.execute("SELECT * FROM Usuario WHERE Usuario = ? OR Correo_Electronico = ?", nuevo_usuario, correo_electronico)
            existing_user = cursor.fetchone()

            if existing_user:
                error = 'El usuario o correo electrónico ya está registrado.'
                return render_template('registro.html', error=error)

            # Hash de la nueva contraseña
            hashed_nueva_contrasena = hashlib.sha256(nueva_contrasena.encode()).hexdigest()

            # Insertar nuevo usuario en la base de datos
            cursor.execute("INSERT INTO Usuario (Usuario, Correo_Electronico, Contraseña) VALUES (?, ?, ?)", nuevo_usuario, correo_electronico, hashed_nueva_contrasena)
            conn.commit()

            # Redirigir a la página de inicio después del registro exitoso
            return redirect(url_for('iniciosesion'))

        except Exception as e:
            # Manejar excepciones, podrías mostrar un mensaje más específico según el error
            error = f'Error en el registro: {str(e)}'
            return render_template('registro.html', error=error)

    return render_template('registro.html')

if __name__ == '__main__':
    app.run(debug=True)
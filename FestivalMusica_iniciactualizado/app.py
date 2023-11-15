from flask import Flask, render_template, request, redirect, url_for
import pyodbc

app = Flask(__name__)

# Configuración de la conexión a la base de datos
server = 'ANTONIO'
database = 'PROGRAWEB'
username = 'sa'
password = 'h9cmhlci'
driver = 'ODBC Driver 17 for SQL Server'  # Puede variar según la versión de tu ODBC Driver

# Configuración de la conexión a la base de datos
conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/iniciosesion', methods=['GET', 'POST'])
def iniciosesion():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Verificar las credenciales en la base de datos
        cursor.execute("SELECT * FROM Usuario WHERE Usuario = ? AND Contraseña = ?", username, password)
        user = cursor.fetchone()

        if user:
            # Inicio de sesión exitoso
            return redirect(url_for('index'))
        else:
            # Inicio de sesión fallido
            error = 'Credenciales incorrectas. Inténtalo de nuevo.'
            return render_template('iniciosesion.html', error=error)

    return render_template('iniciosesion.html')

if __name__ == '__main__':
    app.run(debug=True)
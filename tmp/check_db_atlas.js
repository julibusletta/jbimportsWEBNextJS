const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Cargador básico de .env para scripts independientes
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          const [key, ...valueParts] = trimmedLine.split('=');
          const value = valueParts.join('=');
          process.env[key.trim()] = value.trim();
        }
      });
      console.log('Archivo .env cargado.');
    } else {
      console.warn('Archivo .env no encontrado en la raíz.');
    }
  } catch (err) {
    console.warn('Error al cargar .env:', err.message);
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkConnection() {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI no está definido en el entorno ni en .env');
    console.log('Asegurate de que el archivo .env tenga la variable MONGODB_URI correctamente definida.');
    process.exit(1);
  }

  try {
    console.log('Intentando conectar a MongoDB Atlas...');
    // Mongoose connect
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ CONEXIÓN EXITOSA');
    console.log('-------------------');
    console.log(`Host: ${mongoose.connection.host}`);
    console.log(`Base de datos activa: ${mongoose.connection.name}`);
    
    // Listar bases de datos para confirmar permisos
    const admin = mongoose.connection.db.admin();
    const result = await admin.listDatabases();
    console.log('\nBases de datos accesibles:');
    result.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    await mongoose.disconnect();
    console.log('\n-------------------');
    console.log('Prueba finalizada. Conexión cerrada.');
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN');
    console.error('-------------------');
    console.error('Mensaje:', error.message);
    if (error.message.includes('IP address')) {
      console.error('TIP: Asegurate de haber habilitado el acceso desde tu IP actual en el panel de MongoDB Atlas.');
    }
    process.exit(1);
  }
}

checkConnection();

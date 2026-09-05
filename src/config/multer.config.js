const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento y nombres únicos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadFolder = 'src/public/uploads/documents';
    if (file.fieldname === 'profile') {
      uploadFolder = 'src/public/uploads/profiles';
    } else if (file.fieldname === 'product') {
      uploadFolder = 'src/public/uploads/products';
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Filtro de tipos permitidos (imágenes y documentos comunes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|txt|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan imágenes, PDF o documentos de texto.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter
});

module.exports = upload;
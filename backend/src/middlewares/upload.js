import multer from 'multer'

const storage = multer.memoryStorage() // guarda los archivos en memoria (como Buffer)

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máximo 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten imágenes'))
    }
    cb(null, true)
  },
})

export default upload

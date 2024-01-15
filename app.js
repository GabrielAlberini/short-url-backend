// app.mjs
import express from "express";
import shortid from "shortid";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto proporcionado por el entorno o 3000 por defecto

app.use(cors());
app.use(express.json());

// Almacenar enlaces acortados
const urlDatabase = {};

// Ruta para acortar enlaces
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res
      .status(400)
      .json({ error: "Por favor, proporciona un enlace original." });
  }

  // Generar un ID corto único
  const shortId = shortid.generate();
  const shortUrl = `${getBaseUrl(req)}/${shortId}`;

  // Almacenar el enlace en la base de datos
  urlDatabase[shortId] = originalUrl;

  res.json({ originalUrl, shortUrl });
});

// Redirigir a la URL original
app.get("/:shortId", (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlDatabase[shortId];

  if (!originalUrl) {
    return res.status(404).json({ error: "Enlace no encontrado." });
  }

  res.redirect(originalUrl);
});

function getBaseUrl(req) {
  const protocol = req.protocol;
  const host = req.get("host");

  // Puedes agregar lógica adicional aquí según tus necesidades
  return `${protocol}://${host}`;
}

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en http://localhost:${PORT}`);
});

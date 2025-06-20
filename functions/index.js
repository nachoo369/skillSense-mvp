const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
// --- Importa el SDK de Gemini ---
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai"); // Importa también las categorías de seguridad


const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE GEMINI ACTUALIZADA PARA FUNCTIONS V2 ---
// En lugar de functions.config(), ahora usamos process.env para acceder a las variables de entorno.
// Asegúrate de que la GEMINI_API_KEY esté configurada en Firebase Functions
// usando 'firebase functions:secrets:set GEMINI_API_KEY' o 'firebase deploy --set-env-vars'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || null;

if (!GEMINI_API_KEY) {
  console.warn("Advertencia: GEMINI_API_KEY no está configurada como variable de entorno. Las rutas que usen IA fallarán.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Puedes elegir el modelo que prefieras, 'gemini-pro' es para texto general
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// --- FIN CONFIGURACIÓN DE GEMINI ---


// Endpoint para analizar texto y generar recomendaciones
app.post('/api/analyze-text', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ status: 'error', message: 'Se requiere texto para el análisis.' });
  }

  console.log(`[Backend] Recibido texto para análisis: "${text.substring(0, Math.min(text.length, 100))}..."`);

  let identifiedSkills = [];
  let recommendedResources = [];

  try {
    // --- LÓGICA DE IA CON GEMINI ---
    const prompt = `Analiza el siguiente texto y extrae una lista de las habilidades principales (técnicas y blandas) que se mencionan o infieren.
    Luego, para cada habilidad identificada (o para las más importantes), sugiere un recurso de aprendizaje real (curso, tutorial, documentación, libro, etc.) con su título, URL y tipo.
    Formatea tu respuesta como un objeto JSON con dos claves principales: 'identifiedSkills' (un array de strings) y 'recommendedResources' (un array de objetos, cada uno con 'title', 'url' y 'type').
    Si no se mencionan habilidades o no se pueden inferir recursos específicos, proporciona ejemplos generales de habilidades y recursos útiles para el desarrollo profesional.
    Asegúrate de que la salida sea ÚNICAMENTE el objeto JSON.

    Texto a analizar: "${text}"`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    let textResponse = response.text();

    // --- REFUERZO DE LA LIMPIEZA DE LA RESPUESTA DE GEMINI ---
    const jsonStartIndex = textResponse.indexOf('{');
    const jsonEndIndex = textResponse.lastIndexOf('}');

    if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
        textResponse = textResponse.substring(jsonStartIndex, jsonEndIndex + 1);
    } else {
        if (textResponse.startsWith('```json')) {
            textResponse = textResponse.substring(7);
        }
        if (textResponse.endsWith('```')) {
            textResponse = textResponse.substring(0, textResponse.length - 3);
        }
        textResponse = textResponse.trim();
    }
    // --- FIN REFUERZO DE LA LIMPIEZA ---

    console.log("[Gemini Raw Response (Cleaned)]:", textResponse);

    // Intenta parsear la respuesta de Gemini
    let parsedResponse;
    try {
        parsedResponse = JSON.parse(textResponse);
        identifiedSkills = parsedResponse.identifiedSkills || [];
        recommendedResources = parsedResponse.recommendedResources || [];
        recommendedResources = recommendedResources.filter(res => res.url && res.title);

    } catch (parseError) {
        console.error('Error al parsear la respuesta JSON de Gemini:', parseError);
        identifiedSkills = ['Análisis no concluyente', 'Revisar texto'];
        recommendedResources = [{ title: 'Error en el análisis', url: '#', type: 'info' }];
    }

    // --- FIN LÓGICA DE IA CON GEMINI ---

    // Prepara los datos para guardar en Firestore
    const newAnalysis = {
      inputText: text,
      identifiedSkills: identifiedSkills,
      recommendedResources: recommendedResources,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('skillAnalyses').add(newAnalysis);

    res.status(200).json({
      status: 'success',
      analysisId: docRef.id,
      identifiedSkills: identifiedSkills,
      recommendedResources: recommendedResources,
      message: 'Análisis completado y guardado en la base de datos con IA de Gemini.'
    });

  } catch (error) {
    console.error('Error al analizar con Gemini o guardar en Firebase:', error);
    if (error.response && error.response.status) {
        console.error(`Gemini API Error Status: ${error.response.status}`);
        console.error(`Gemini API Error Data: ${JSON.stringify(error.response.data)}`);
    }
    res.status(500).json({ status: 'error', message: 'Error interno del servidor al procesar el análisis con IA.' });
  }
});

// El endpoint /api/analyses permanece igual
app.get('/api/analyses', async (req, res) => {
  try {
    const analysesSnapshot = await db.collection('skillAnalyses')
                                   .orderBy('createdAt', 'desc')
                                   .limit(10)
                                   .get();

    const analyses = [];
    analysesSnapshot.forEach(doc => {
      const data = doc.data();
      analyses.push({
        id: doc.id,
        inputText: data.inputText,
        identifiedSkills: data.identifiedSkills,
        recommendedResources: data.recommendedResources,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null
      });
    });
    res.status(200).json({ status: 'success', data: analyses });
  } catch (error) {
    console.error('Error al obtener análisis de Firebase:', error);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor al recuperar el historial.' });
  }
});

// --- EXPORTACIÓN DE LA FUNCIÓN PARA FUNCTIONS V2 ---
// Esta es la forma correcta de exportar tu aplicación Express como una Cloud Function.
// Ya eliminamos app.listen(), lo cual es correcto.
exports.api = functions.https.onRequest(app);

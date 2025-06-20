// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Importa los estilos CSS para tu aplicación

function App() {
  // Estado para almacenar el texto que el usuario ingresa
  const [inputText, setInputText] = useState('');
  // Estado para almacenar el resultado del análisis de habilidades y recomendaciones
  const [analysisResult, setAnalysisResult] = useState(null);
  // Estado para mostrar un indicador de carga mientras se procesa la solicitud
  const [loading, setLoading] = useState(false);
  // Estado para almacenar y mostrar mensajes de error
  const [error, setError] = useState(null);
  // Estado para almacenar el historial de análisis
  const [history, setHistory] = useState([]);
  // Estado para controlar qué vista está activa (analizar o historial)
  const [activeView, setActiveView] = useState('analyze'); // Por defecto, muestra la vista de análisis

  // URL base de tu backend. ¡Asegúrate de que coincida con el puerto donde está corriendo tu backend!
  const API_BASE_URL = 'https://api-sup3zbxxfa-uc.a.run.app/api'; // ¡Añadido /api al final!

  // useEffect para cargar el historial cuando el componente se monta (al inicio)
  useEffect(() => {
    fetchHistory();
  }, []); // El array vacío [] asegura que se ejecute solo una vez al montarse

  // Función para obtener el historial de análisis desde el backend
  const fetchHistory = async () => {
    try {
      setLoading(true); // Activa el estado de carga
      setError(null); // Limpia errores anteriores

      // Realiza la solicitud GET al endpoint /api/analyses de tu backend
      const response = await fetch(`${API_BASE_URL}/analyses`);

      // Verifica si la respuesta HTTP fue exitosa (código 2xx)
      if (!response.ok) {
        // Si no fue exitosa, lanza un error con el estado HTTP
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      // Parsea la respuesta JSON
      const data = await response.json();

      // Verifica si la respuesta JSON del backend indica éxito
      if (data.status === 'success') {
        setHistory(data.data); // Actualiza el estado del historial con los datos recibidos
      } else {
        // Si el backend reporta un error, lo establece en el estado
        setError(data.message || 'Error al cargar el historial.');
      }
    } catch (err) {
      // Captura cualquier error de red o de la solicitud
      console.error('Error al obtener el historial:', err);
      setError('No se pudo conectar al servidor o cargar el historial.');
    } finally {
      setLoading(false); // Desactiva el estado de carga al finalizar
    }
  };

  // Función que se ejecuta cuando el usuario hace clic en "Analizar Habilidades"
  const handleAnalyze = async () => {
    // Valida que el campo de texto no esté vacío
    if (!inputText.trim()) {
      alert('Por favor, ingresa texto para analizar.');
      return;
    }

    setLoading(true); // Activa el estado de carga
    setError(null); // Limpia errores anteriores
    setAnalysisResult(null); // Limpia resultados de análisis anteriores

    try {
      // Realiza la solicitud POST al endpoint /api/analyze-text de tu backend
      const response = await fetch(`${API_BASE_URL}/analyze-text`, {
        method: 'POST', // Método HTTP POST
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON
        },
        body: JSON.stringify({ text: inputText }), // Envía el texto ingresado como JSON
      });

      // Verifica si la respuesta HTTP fue exitosa
      if (!response.ok) {
        throw new Error(`Error HTTP! status: ${response.status}`);
      }

      // Parsea la respuesta JSON del backend
      const data = await response.json();

      // Verifica si el backend reportó éxito en el análisis
      if (data.status === 'success') {
        setAnalysisResult(data); // Almacena el resultado del análisis
        setInputText(''); // Limpia el campo de texto
        fetchHistory(); // Vuelve a cargar el historial para incluir el nuevo análisis
      } else {
        setError(data.message || 'Ocurrió un error al analizar.');
      }
    } catch (err) {
      // Captura errores durante la solicitud de análisis
      console.error('Error al analizar texto:', err);
      setError('No se pudo conectar al servidor o hubo un error en el análisis.');
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SkillSense 📚</h1>
        <nav className="navigation-tabs">
          <button
            onClick={() => setActiveView('analyze')}
            className={activeView === 'analyze' ? 'active' : ''}
          >
            Analizar Habilidades
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={activeView === 'history' ? 'active' : ''}
          >
            Historial
          </button>
        </nav>
      </header>

      {/* Vista para analizar habilidades */}
      {activeView === 'analyze' && (
        <div className="analyze-view">
          <h2>¿Qué habilidades tienes o quieres desarrollar?</h2>
          <p>Pega aquí una descripción de tu experiencia (currículum, proyecto), o tus metas de aprendizaje.</p>
          <textarea
            placeholder="Ej: 'Soy un desarrollador backend con experiencia en Node.js y bases de datos NoSQL como MongoDB. Me interesa aprender sobre Machine Learning y Big Data para análisis financiero.'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows="10"
            cols="50"
          ></textarea>
          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analizando...' : 'Analizar Habilidades'}
          </button>

          {error && <p className="error-message">{error}</p>}

          {analysisResult && (
            <div className="results-container">
              <h3>Habilidades Identificadas:</h3>
              <div className="skills-list">
                {analysisResult.identifiedSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>

              <h3>Recursos Recomendados para ti:</h3>
              <ul className="resources-list">
                {analysisResult.recommendedResources.map((resource, index) => (
                  <li key={index}>
                    <strong>{resource.title}</strong> ({resource.type}) -{' '}
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      Ver recurso
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Vista para el historial de análisis */}
      {activeView === 'history' && (
        <div className="history-view">
          <h2>Tu Historial de Análisis</h2>
          {loading && <p>Cargando historial...</p>}
          {error && <p className="error-message">{error}</p>}
          {history.length === 0 && !loading && !error && <p>No hay análisis en el historial todavía. ¡Anímate a analizar algo!</p>}
          <div className="history-list">
            {history.map((analysis) => (
              <div key={analysis.id} className="history-item">
                <p>
                  <strong>Texto Analizado:</strong>{' '}
                  {analysis.inputText.substring(0, Math.min(analysis.inputText.length, 150))}
                  {analysis.inputText.length > 150 ? '...' : ''}
                </p>
                <p>
                  <strong>Habilidades:</strong>{' '}
                  {analysis.identifiedSkills.join(', ') || 'No identificadas'}
                </p>
                <p>
                  <strong>Recursos:</strong>{' '}
                  {analysis.recommendedResources.map((r) => r.title).join(', ') || 'No hay recomendaciones'}
                </p>
                <small>
                  Analizado el:{' '}
                  {analysis.createdAt ? new Date(analysis.createdAt).toLocaleString() : 'Fecha desconocida'}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
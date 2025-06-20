# **📚 SkillSense: Análisis de Habilidades y Recomendación de Recursos**

## **Descripción del Proyecto**

ENLACE: https://skillsense-mvp.web.app/

SkillSense es una aplicación web prototipo (MVP) diseñada para ayudar a los usuarios a identificar sus habilidades clave a partir de un texto descriptivo y recibir recomendaciones de recursos de aprendizaje personalizados. También permite llevar un historial de los análisis realizados.

El objetivo principal es simular un un sistema inteligente que procesa información del usuario para ofrecerle rutas de mejora y desarrollo profesional continuos, sirviendo como un punto de partida para una plataforma de aprendizaje adaptativo.

## **Funcionalidades Principales**

* **Análisis de Texto:** Los usuarios pueden ingresar descripciones de su experiencia, currículums, o metas de aprendizaje.  
* **Identificación de Habilidades (con IA):** El sistema, ahora integrado con la **API de Google Gemini 1.5 Flash**, extrae y lista las habilidades relevantes del texto proporcionado de manera inteligente.  
* **Recomendación de Recursos (con IA):** Se sugieren enlaces a cursos, tutoriales, artículos o libros alineados con las habilidades identificadas por Gemini.  
* **Historial de Análisis:** Los análisis previos se guardan y pueden consultarse, permitiendo al usuario seguir su progreso o revisar recomendaciones pasadas.

## **Tecnologías Utilizadas**

Este proyecto es una aplicación Fullstack construida con las siguientes tecnologías:

* **Frontend:**  
  * **React.js:** Biblioteca JavaScript para construir interfaces de usuario interactivas.  
  * **Vite:** Herramienta de construcción rápida para el desarrollo de frontend.  
  * **HTML/CSS:** Para la estructura y el estilo de la interfaz.  
* **Backend (Firebase Cloud Function):**  
  * **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.  
  * **Express.js:** Framework web minimalista y flexible para Node.js, utilizado para construir la API.  
  * **Firebase Cloud Functions (2ª Generación):** Plataforma sin servidor donde se ejecuta la lógica del backend.  
  * **GoogleGenerativeAI SDK:** Para la integración con la API de Gemini (modelo gemini-1.5-flash).  
  * **Firebase Admin SDK:** Para interactuar con los servicios de Firebase (Firestore) desde el servidor.  
  * **CORS:** Middleware para habilitar el uso compartido de recursos de origen cruzado (permite que el frontend y el backend se comuniquen).  
* **Base de Datos:**  
  * **Google Firebase Firestore:** Base de datos NoSQL basada en la nube, utilizada para almacenar los análisis de habilidades y el historial.  
* **Despliegue:**  
  * **Firebase Hosting:** Para el despliegue del frontend.  
  * **Firebase CLI:** Herramienta de línea de comandos para interactuar con los servicios de Firebase (despliegue de hosting y funciones).

## **¿Cómo se Utiliza la Inteligencia Artificial (IA)?**

A diferencia de la versión prototipo inicial, SkillSense ahora utiliza directamente la **API de Google Gemini 1.5 Flash** para potenciar su funcionalidad principal:

* **Análisis Inteligente:** El texto proporcionado por el usuario se envía a la API de Gemini. Se utiliza un prompt cuidadosamente diseñado para instruir a Gemini a extraer habilidades principales (técnicas y blandas) y, simultáneamente, a sugerir recursos de aprendizaje relevantes.  
* **Formato Estructurado:** El prompt le pide a Gemini que devuelva la información en un formato JSON específico, lo que permite al backend parsear y utilizar las habilidades identificadas y las recomendaciones de recursos de manera programática.  
* **Flexibilidad:** Gemini permite una comprensión más profunda del lenguaje natural y la generación de recomendaciones más contextuales y variadas que un sistema basado en reglas simples.

La GEMINI\_API\_KEY se gestiona de forma segura a través de las variables de entorno de Firebase Functions (o Secret Manager para entornos de producción), no se expone en el código fuente.

## **Estructura de la Base de Datos (Firebase Firestore)**

La base de datos Firebase Firestore utiliza una colección principal llamada skillAnalyses. Cada documento dentro de esta colección representa un análisis de habilidades realizado y contiene los siguientes campos:

* id (generado automáticamente por Firestore): Identificador único del análisis.  
* inputText (String): El texto original que el usuario proporcionó para el análisis.  
* identifiedSkills (Array de Strings): Lista de habilidades identificadas por el sistema.  
* recommendedResources (Array de Objetos): Lista de recursos sugeridos. Cada objeto contiene:  
  * title (String): Título del recurso.  
  * url (String): URL del recurso.  
  * type (String): Tipo de recurso (ej. 'curso', 'artículo', 'tutorial').  
* createdAt (Timestamp): Fecha y hora en que se realizó el análisis (registrado por el servidor de Firebase).

## **Cómo Ejecutar el Proyecto Localmente (Emulador de Firebase Functions)**

Para ejecutar tu backend (Cloud Function) localmente y probarlo con tu frontend, usarás el emulador de Firebase Functions.

### **Prerrequisitos**

* Node.js (versión 18 o superior) y npm (versión 8 o superior) instalados.  
* Una cuenta de Google y un proyecto configurado en [Firebase](https://console.firebase.google.com/) con **Firestore Database** habilitada en "modo de prueba".  
* **Firebase CLI** instalado globalmente: npm install \-g firebase-tools  
* **Inicia sesión en Firebase CLI:** firebase login (y sigue las instrucciones del navegador).  
* **Selecciona tu proyecto de Firebase:** firebase use \--add tu-id-de-proyecto (reemplaza tu-id-de-proyecto por skillsense-mvp).  
* Un archivo de credenciales de Firebase (ej. serviceAccountKey.json) descargado de tu proyecto de Firebase y ubicado en la carpeta functions/.  
* Tu GEMINI\_API\_KEY.

### **Pasos de Instalación y Ejecución**

1. **Clona el Repositorio (o descarga el código):**  
   git clone https://github.com/nachoo369/skillSense-mvp.git  
   cd skillsense-mvp \# Navega a la carpeta raíz del proyecto

2. **Configuración del Backend (Cloud Function \- functions/):**  
   * Navega a la carpeta functions:  
     cd functions

   * Instala las dependencias del backend:  
     npm install

   * Asegúrate de tener tu archivo serviceAccountKey.json en esta carpeta.  
   * Configura tu API Key de Gemini para el emulador:  
     Crea un archivo .env en la carpeta functions/ (no en la raíz del proyecto) con el siguiente contenido. IMPORTANTE: Este .env es solo para desarrollo local. En producción, la clave se gestiona con Firebase Secret Manager o \--set-env-vars como hiciste.  
     GEMINI\_API\_KEY="TU\_CLAVE\_API\_DE\_GEMINI\_AQUI"

     Reemplaza "TU\_CLAVE\_API\_DE\_GEMINI\_AQUI" con tu clave real.  
   * Inicia el emulador de Firebase Functions:  
     Desde la carpeta functions/, ejecuta:  
     firebase emulators:start \--only functions

     Deberías ver la URL de tu función api en http://localhost:5001/skillsense-mvp/us-central1/api.  
3. **Configuración del Frontend (frontend/):**  
   * Abre una **NUEVA terminal** (o una nueva pestaña en tu terminal actual).  
   * Navega a la carpeta frontend (desde la raíz del proyecto skillsense-mvp):  
     cd ../frontend

   * Instala las dependencias del frontend:  
     npm install

   * **Actualiza la API\_BASE\_URL en frontend/src/App.jsx para apuntar al emulador:**  
     const API\_BASE\_URL \= 'http://localhost:5001/skillsense-mvp/us-central1/api';

   * Inicia la aplicación React en modo de desarrollo:  
     npm run dev

     Deberías ver un mensaje indicando la URL donde el frontend está corriendo (ej. http://localhost:5173/).  
4. **Usa la Aplicación Localmente:**  
   * Abre la URL proporcionada por npm run dev en tu navegador web.  
   * Ingresa texto en el área de análisis, haz clic en "Analizar Habilidades" y explora la pestaña "Historial".

## **Despliegue en Vivo**

Una vez que tu aplicación funcione correctamente en local, puedes desplegarla en Firebase Hosting y Cloud Functions:

1. **Asegura tu GEMINI\_API\_KEY para producción:**  
   * Si no lo has hecho ya, configura tu GEMINI\_API\_KEY en Firebase Secret Manager:  
     firebase functions:secrets:set GEMINI\_API\_KEY

     (Te pedirá el valor de la clave. Es la forma más segura).  
2. **Ajusta la API\_BASE\_URL en frontend/src/App.jsx para el despliegue en vivo:**  
   const API\_BASE\_URL \= 'https://api-sup3zbxxfa-uc.a.run.app/api'; // La URL de tu Cloud Function desplegada

3. Re-compila tu frontend:  
   Desde la carpeta frontend/:  
   npm run build

4. Despliega Hosting y Functions:  
   Desde la raíz de tu proyecto (skillsense-mvp):  
   firebase deploy \--only hosting,functions

   *Si experimentas problemas de "Push Protection" de GitHub con serviceAccountKey.json, la solución es seguir los pasos para borrar el historial de Git local y forzar el push, o crear un nuevo repositorio en GitHub.*

## **Acceso a la Aplicación Desplegada**

Una vez desplegada, tu aplicación estará disponible en la URL de Firebase Hosting:

* **URL de la Aplicación (Frontend):** https://skillsense-mvp.web.app

## **Futuras Mejoras**

* Integración con APIs de plataformas de e-learning (Coursera, Udemy) para recomendaciones de cursos más dinámicas y personalizadas (requiere alianzas o acceso a APIs de datos).  
* Autenticación de usuarios para guardar historiales individuales.  
* Perfiles de usuario con habilidades a desarrollar y seguimiento de progreso.  
* Interfaz de usuario más interactiva y visualización de datos de habilidades.

## **2\. Guion para tu Pitch Técnico (2 minutos)**

Prepara este guion para tu presentación. Practícalo para que suene natural y fluya en 2 minutos.

**Diapositiva 1: Título \- SkillSense**

* "Hola a todos, somos \[Tu nombre/Nombre de tu grupo\] y les presentamos **SkillSense**, una herramienta diseñada para ayudarte a entender y desarrollar tus habilidades."

**Diapositiva 2: El Problema**

* "En el mundo laboral actual, identificar y mejorar nuestras habilidades es crucial, pero a menudo no sabemos por dónde empezar ni qué recursos buscar."

**Diapositiva 3: Nuestra Solución: SkillSense MVP**

* "SkillSense aborda esto permitiéndote ingresar cualquier texto —como una descripción de tu experiencia, un currículum o tus metas de aprendizaje— y, en segundos, identifica habilidades clave y te sugiere recursos de aprendizaje personalizados."  
* "Además, guarda un historial de tus análisis para que puedas seguir tu evolución."

**Diapositiva 4: Demo Rápida (¡Muestra la app\!)**

* **(Aquí proyecta tu aplicación web)** "Como pueden ver, la interfaz es intuitiva. Pego mi texto aquí (ej. 'Soy desarrollador React y me interesa el Machine Learning'). Al hacer clic en 'Analizar', SkillSense me muestra las habilidades identificadas ('React.js', 'Machine Learning') y recursos recomendados con enlaces reales."  
* "Si voy a la pestaña 'Historial', veo mi análisis guardado y todos los anteriores."

**Diapositiva 5: Arquitectura Técnica**

* "¿Cómo funciona esto bajo el capó? SkillSense es una aplicación Fullstack."  
* "En el **Frontend**, usamos **React.js** con **Vite** para una interfaz rápida y reactiva."  
* "El **Backend** es una **Firebase Cloud Function** construida con **Node.js** y **Express.js**, que maneja las solicitudes y se comunica con nuestra base de datos."  
* "Para la **Base de Datos**, elegimos **Google Firebase Firestore**, una NoSQL robusta en la nube, donde almacenamos cada análisis de habilidades de manera persistente."

**Diapositiva 6: ¿Dónde está la IA?**

* "Un punto clave es cómo la Inteligencia Artificial se integra en este MVP. Hemos integrado la **API de Google Gemini 1.5 Flash** directamente en nuestro backend."  
* "Ahora, cuando ingresas texto, este se envía a Gemini, quien realiza el análisis avanzado para identificar tus habilidades y generar recomendaciones de recursos muy pertinentes."  
* "Esto eleva la calidad del análisis de habilidades y las sugerencias, ofreciendo una experiencia mucho más inteligente y dinámica."

**Diapositiva 7: Desafíos y Aprendizajes**

* "Durante el desarrollo, nos enfrentamos a desafíos como la configuración del entorno para Node.js 22, la gestión segura de variables de entorno con Firebase Functions V2 y Secret Manager, y la depuración de la comunicación entre frontend y backend."  
* "Aprendimos la importancia de una arquitectura bien definida y la robustez que ofrece Firebase para un despliegue y escalado eficientes."

**Diapositiva 8: Próximos Pasos**

* "Para el futuro, planeamos integrar APIs de plataformas de e-learning para recomendaciones de cursos aún más dinámicas, implementar autenticación de usuarios para historiales personalizados, y enriquecer la interfaz de usuario con visualizaciones de datos."

**Diapositiva 9: Preguntas**

* "¡Gracias\! ¿Alguna pregunta?"
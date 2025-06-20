# 📚 SkillSense: Análisis de Habilidades y Recomendación de Recursos

## Descripción del Proyecto

SkillSense es una aplicación web prototipo (MVP) diseñada para ayudar a los usuarios a identificar sus habilidades clave a partir de un texto descriptivo y recibir recomendaciones de recursos de aprendizaje personalizados. También permite llevar un historial de los análisis realizados.

El objetivo principal es simular un sistema inteligente que procesa información del usuario para ofrecerle rutas de mejora y desarrollo profesional continuos, sirviendo como un punto de partida para una plataforma de aprendizaje adaptativo.

## Funcionalidades Principales

* **Análisis de Texto:** Los usuarios pueden ingresar descripciones de su experiencia, currículums, o metas de aprendizaje.
* **Identificación de Habilidades:** El sistema (a través de una simulación de IA) extrae y lista las habilidades relevantes del texto proporcionado.
* **Recomendación de Recursos:** Se sugieren enlaces a cursos, tutoriales, artículos o libros alineados con las habilidades identificadas.
* **Historial de Análisis:** Los análisis previos se guardan y pueden consultarse, permitiendo al usuario seguir su progreso o revisar recomendaciones pasadas.

## Tecnologías Utilizadas

Este proyecto es una aplicación Fullstack construida con las siguientes tecnologías:

* **Frontend:**
    * **React.js:** Biblioteca JavaScript para construir interfaces de usuario interactivas.
    * **Vite:** Herramienta de construcción rápida para el desarrollo de frontend.
    * **HTML/CSS:** Para la estructura y el estilo de la interfaz.

* **Backend (API REST):**
    * **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.
    * **Express.js:** Framework web minimalista y flexible para Node.js, utilizado para construir la API.
    * **CORS:** Middleware para habilitar el uso compartido de recursos de origen cruzado (permite que el frontend y el backend se comuniquen).
    * **Dotenv:** Para gestionar variables de entorno de forma segura (como el puerto del servidor).
    * **Firebase Admin SDK:** Para interactuar con los servicios de Firebase desde el servidor.

* **Base de Datos:**
    * **Google Firebase Firestore:** Base de datos NoSQL basada en la nube, utilizada para almacenar los análisis de habilidades y el historial.

## Estructura de la Base de Datos (Firebase Firestore)

La base de datos Firebase Firestore utiliza una colección principal llamada `skillAnalyses`. Cada documento dentro de esta colección representa un análisis de habilidades realizado y contiene los siguientes campos:

* `id` (generado automáticamente por Firestore): Identificador único del análisis.
* `inputText` (String): El texto original que el usuario proporcionó para el análisis.
* `identifiedSkills` (Array de Strings): Lista de habilidades identificadas por el sistema.
* `recommendedResources` (Array de Objetos): Lista de recursos sugeridos. Cada objeto contiene:
    * `title` (String): Título del recurso.
    * `url` (String): URL del recurso.
    * `type` (String): Tipo de recurso (ej. 'curso', 'artículo', 'tutorial').
* `createdAt` (Timestamp): Fecha y hora en que se realizó el análisis (registrado por el servidor de Firebase).

## ¿Cómo se Utiliza la Inteligencia Artificial (IA) en este MVP?

Para este Producto Mínimo Viable (MVP), la funcionalidad de "IA" se simula en el backend (`backend/index.js`). No se utiliza un modelo de machine learning complejo o una API de NLP externa. En su lugar, la detección de habilidades y la recomendación de recursos se basan en **reglas simples de coincidencia de palabras clave (keywords)** dentro del texto de entrada.

* **Identificación de Habilidades:** El servidor analiza el texto del usuario en busca de palabras clave predefinidas (ej., "python", "react", "liderazgo").
* **Recomendación de Recursos:** Basándose en las habilidades detectadas por las palabras clave, se asignan y recomiendan recursos educativos de una lista predefinida con enlaces reales.

En un proyecto de producción, esta simulación sería reemplazada por una integración con un modelo de Procesamiento de Lenguaje Natural (NLP) o un servicio de IA más sofisticado (como Google Cloud Natural Language, OpenAI GPT, etc.) para una extracción de habilidades más precisa y un motor de recomendación dinámico basado en un corpus de datos mucho más amplio y complejo.

## Cómo Ejecutar el Proyecto Localmente

Sigue estos pasos para poner en marcha la aplicación SkillSense en tu máquina local.

### Prerrequisitos

* Node.js (versión 18 o superior) y npm (versión 8 o superior) instalados.
* Una cuenta de Google y un proyecto configurado en [Firebase](https://console.firebase.google.com/) con Firestore Database habilitada en "modo de prueba".
* Un archivo de credenciales de Firebase (ej. `serviceAccountKey.json`) descargado y ubicado en la carpeta `backend/`.

### Pasos de Instalación y Ejecución

1.  **Clona el Repositorio (o descarga el código):**
    ```bash
    git clone <https://github.com/nachoo369/skillSense-mvp.git>
    cd skillsense-mvp # Navega a la carpeta raíz del proyecto
    ```

2.  **Configuración del Backend:**
    * Navega a la carpeta `backend`:
        ```bash
        cd backend
        ```
    * Instala las dependencias del backend:
        ```bash
        npm install
        ```
    * Asegúrate de tener tu archivo `serviceAccountKey.json` en esta carpeta.
    * Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:
        ```
        PORT=5000
        ```
    * Inicia el servidor backend:
        ```bash
        node index.js
        ```
        Deberías ver un mensaje como: `Backend SkillSense corriendo en http://localhost:5000`

3.  **Configuración del Frontend:**
    * Abre una **NUEVA terminal** (o una nueva pestaña en tu terminal actual).
    * Navega a la carpeta `frontend` (desde la raíz del proyecto `skillsense-mvp`):
        ```bash
        cd ../frontend
        ```
    * Instala las dependencias del frontend:
        ```bash
        npm install
        ```
    * Inicia la aplicación React en modo de desarrollo:
        ```bash
        npm run dev
        ```
        Deberías ver un mensaje indicando la URL donde el frontend está corriendo (ej. `http://localhost:5173/`).

4.  **Usa la Aplicación:**
    * Abre la URL proporcionada por `npm run dev` en tu navegador web.
    * Ingresa texto en el área de análisis, haz clic en "Analizar Habilidades" y explora la pestaña "Historial".

## Futuras Mejoras

* Integración con modelos de NLP reales (ej. Hugging Face, OpenAI GPT) para una extracción de habilidades y análisis semántico más avanzado.
* Integración con APIs de plataformas de e-learning (Coursera, Udemy) para recomendaciones de cursos más dinámicas y personalizadas (requiere alianzas o acceso a APIs de datos).
* Autenticación de usuarios para guardar historiales individuales.
* Perfiles de usuario con habilidades a desarrollar y seguimiento de progreso.
* Interfaz de usuario más interactiva y visualización de datos de habilidades.

---

## **2. Guion para tu Pitch Técnico (2 minutos)**

Prepara este guion para tu presentación. Practícalo para que suene natural y fluya en 2 minutos.

**Diapositiva 1: Título - SkillSense**

* "Hola a todos, somos [Tu nombre/Nombre de tu grupo] y les presentamos **SkillSense**, una herramienta diseñada para ayudarte a entender y desarrollar tus habilidades."

**Diapositiva 2: El Problema**

* "En el mundo laboral actual, identificar y mejorar nuestras habilidades es crucial, pero a menudo no sabemos por dónde empezar ni qué recursos buscar."

**Diapositiva 3: Nuestra Solución: SkillSense MVP**

* "SkillSense aborda esto permitiéndote ingresar cualquier texto —como una descripción de tu experiencia, un currículum o tus metas de aprendizaje— y, en segundos, identifica habilidades clave y te sugiere recursos de aprendizaje personalizados."
* "Además, guarda un historial de tus análisis para que puedas seguir tu evolución."

**Diapositiva 4: Demo Rápida (¡Muestra la app!)**

* **(Aquí proyecta tu aplicación web)** "Como pueden ver, la interfaz es intuitiva. Pego mi texto aquí (ej. 'Soy desarrollador React y me interesa el Machine Learning'). Al hacer clic en 'Analizar', SkillSense me muestra las habilidades identificadas ('React.js', 'Machine Learning') y recursos recomendados con enlaces reales."
* "Si voy a la pestaña 'Historial', veo mi análisis guardado y todos los anteriores."

**Diapositiva 5: Arquitectura Técnica**

* "¿Cómo funciona esto bajo el capó? SkillSense es una aplicación Fullstack."
* "En el **Frontend**, usamos **React.js** con **Vite** para una interfaz rápida y reactiva."
* "El **Backend** es una API REST construida con **Node.js** y **Express.js**, que maneja las solicitudes del frontend y se comunica con nuestra base de datos."
* "Para la **Base de Datos**, elegimos **Google Firebase Firestore**, una NoSQL robusta en la nube, donde almacenamos cada análisis de habilidades de manera persistente."

**Diapositiva 6: ¿Dónde está la IA?**

* "Un punto clave es cómo la 'Inteligencia Artificial' se integra en este MVP. Para esta versión, la IA se simula directamente en nuestro backend de Node.js."
* "Funciona mediante **reglas de coincidencia de palabras clave**: el sistema escanea tu texto en busca de términos específicos para identificar habilidades y luego, basado en esas habilidades, te ofrece recursos de una lista predefinida pero con enlaces reales a plataformas educativas."
* "En una versión completa, esta simulación sería reemplazada por modelos avanzados de Procesamiento de Lenguaje Natural (NLP) para un análisis mucho más preciso y un motor de recomendación verdaderamente dinámico."

**Diapositiva 7: Desafíos y Aprendizajes**

* "Durante el desarrollo, nos enfrentamos a desafíos comunes como la configuración inicial del entorno Node.js/npm, la correcta gestión de las variables de entorno y las credenciales de Firebase, y asegurar la comunicación entre frontend y backend a través de CORS."
* "Aprendimos la importancia de estructurar un proyecto Fullstack y la flexibilidad que ofrece Firebase para un rápido prototipado."

**Diapositiva 8: Próximos Pasos**

* "Para el futuro, planeamos integrar IA real, permitir perfiles de usuario con seguimiento de progreso, y ofrecer recomendaciones aún más personalizadas integrando APIs de plataformas de cursos."

**Diapositiva 9: Preguntas**

* "¡Gracias! ¿Alguna pregunta?"

---

## **3. Comandos para Subir tu Proyecto a GitHub**

**Antes de comenzar:**

* Asegúrate de tener Git instalado en tu computadora.
* **Crea un nuevo repositorio vacío en GitHub.** Nómbralo `skillsense-mvp` (o el nombre que le diste a tu carpeta raíz). **No marques la opción para inicializarlo con un `README.md` ni `.gitignore` al crearlo.** Una vez creado, GitHub te dará la URL remota (ej. `https://github.com/tu-usuario/skillsense-mvp.git`).

**Pasos en tu terminal:**

1.  **Navega a la carpeta raíz de tu proyecto.**
    * Si estás en `frontend` o `backend`, sube hasta la carpeta `skillsense-mvp`:
        ```bash
        cd ../../ # O ajusta según donde estés
        # Asegúrate de estar en la carpeta padre de frontend y backend
        # Por ejemplo: C:\Users\ignac\MVP>
        ```

2.  **Inicializa Git en tu carpeta raíz (`skillsense-mvp`):**
    ```bash
    git init
    ```

3.  **Verifica tus archivos `.gitignore`:**
    * Asegúrate de que tienes un `.gitignore` en la carpeta `backend/` con al menos:
        ```
        node_modules/
        .env
        serviceAccountKey.json
        ```
    * Y otro `.gitignore` en la carpeta `frontend/` con al menos:
        ```
        node_modules/
        .env # Si usaste un .env en frontend
        dist/
        ```
    * **¡Esto es crucial para no subir tus credenciales!**

4.  **Añade todos los archivos al área de preparación de Git:**
    ```bash
    git add .
    ```

5.  **Confirma los cambios:**
    ```bash
    git commit -m "Initial commit: SkillSense MVP project setup"
    ```

6.  **Vincula tu repositorio local con el remoto de GitHub:**
    * Reemplaza `<URL_DEL_REPOSITORIO_GITHUB>` con la URL que obtuviste de GitHub (ej. `https://github.com/tu-usuario/skillsense-mvp.git`).
    ```bash
    git remote add origin <URL_DEL_REPOSITORIO_GITHUB>
    ```

7.  **Empuja tus cambios al repositorio remoto (GitHub):**
    * Si es la primera vez, y tu rama principal se llama `main`:
        ```bash
        git push -u origin main
        ```
    * Si tu rama principal se llama `master` (esto es menos común ahora, pero puede pasar):
        ```bash
        git push -u origin master
        ```
    * Si te pide usuario y contraseña, ingresa tus credenciales de GitHub. Si tienes 2FA, podría pedirte un token de acceso personal en lugar de la contraseña.

¡Con esto, tendrás tu proyecto en GitHub y estarás listo para la presentación! Mucha suerte.
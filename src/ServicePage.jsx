import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { trackEvent } from "./utils/analytics";
import "./service-page.css";

const DEVELOPMENT_SERVICE_PAGES = {
  "paginas-web-landing-pages": {
    type: "paginas-web-landing-pages",
    eyebrow: "Desarrollo / Web y landing pages",
    title: "Páginas claras para negocios que necesitan generar consultas.",
    accent: "Sin vueltas.",
    intro:
      "Desarrollamos sitios web y landing pages rápidas, ordenadas y pensadas para explicar tu oferta, generar confianza y llevar al visitante al próximo paso.",
    cta: "Quiero mi página",
    sections: [
      {
        title: "Landing pages comerciales",
        text: "Una página enfocada en una oferta, servicio, campaña o rubro puntual, con estructura preparada para convertir visitas en consultas.",
      },
      {
        title: "Sitios web institucionales",
        text: "Una presencia completa para presentar marca, servicios, casos, equipo, contacto y todo lo que un cliente necesita ver antes de escribir.",
      },
      {
        title: "Plantilla o a medida",
        text: "Podemos partir de una base profesional para ir más rápido o diseñar desde cero cuando el proyecto necesita diferenciación real.",
      },
      {
        title: "Publicación y medición",
        text: "Dejamos la web lista para usar, compartir, recibir consultas y medir eventos importantes cuando haya campañas activas.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "Una página no debería ser decoración. Tiene que vender, explicar o destrabar una decisión.",
      text: "Ordenamos el mensaje, diseñamos la experiencia y construimos una web que acompañe el objetivo real: conseguir consultas, presentar servicios, validar una idea o darle seriedad a la marca.",
      items: [
        {
          title: "Estructura comercial",
          text: "Definimos qué tiene que ver primero el visitante, qué dudas aparecen y qué CTA conviene usar.",
        },
        {
          title: "Copy y diseño",
          text: "Trabajamos textos, jerarquías, secciones, imágenes y ritmo visual para que la página se entienda rápido.",
        },
        {
          title: "Responsive real",
          text: "La experiencia se piensa para celular y escritorio, cuidando lectura, velocidad y botones fáciles de tocar.",
        },
        {
          title: "Conexión a contacto",
          text: "WhatsApp, formularios, analítica, píxeles o herramientas necesarias para que cada consulta llegue ordenada.",
        },
      ],
    },
    showcase: {
      eyebrow: "Casos típicos",
      title: "No todas las páginas tienen que hacer lo mismo.",
      text: "Definimos el formato según el objetivo del negocio, no según una plantilla fija que intenta servir para todo.",
      items: [
        ["01", "Página para servicio", "Presentar qué hacés, para quién, cómo trabajás y por qué deberían escribirte."],
        ["02", "Landing de campaña", "Una oferta concreta, pocos desvíos y CTA preparado para tráfico pago o acciones comerciales."],
        ["03", "Sitio institucional", "Una presencia más completa con servicios, marca, confianza, contacto y secciones internas."],
        ["04", "Página de validación", "Una versión rápida para probar una idea, nuevo servicio o rubro antes de invertir de más."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Una página publicada, entendible y preparada para recibir consultas.",
      text: "El alcance exacto depende del proyecto, pero la entrega se arma para que puedas usarla de verdad desde el primer día.",
      items: [
        "Estructura de secciones y recorrido comercial.",
        "Diseño responsive adaptado a marca y objetivo.",
        "Textos base o copy completo según alcance.",
        "Conexión a WhatsApp, formulario, dominio y medición cuando corresponda.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Para arrancar te pedimos lo justo, no una carpeta eterna.",
      text: "Con una primera conversación podemos definir si conviene plantilla, diseño a medida o una web más completa.",
      items: [
        ["01", "Objetivo", "Qué tiene que lograr la página: consultas, ventas, turnos, presentación o validación."],
        ["02", "Oferta", "Qué vendés, para quién, qué diferencia al negocio y qué objeciones suelen aparecer."],
        ["03", "Material", "Logo, colores, fotos, referencias, redes y cualquier contenido que ya exista."],
        ["04", "Próximo paso", "Definimos estructura, alcance, tiempos y forma de publicación."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Primero ordenamos el mensaje. Después lo convertimos en una página usable.",
      steps: [
        ["01", "Brief comercial", "Entendemos negocio, público, oferta y objetivo principal."],
        ["02", "Arquitectura", "Definimos secciones, recorrido, CTAs y contenido necesario."],
        ["03", "Diseño y desarrollo", "Armamos la experiencia visual y la dejamos funcionando."],
        ["04", "Publicación", "Conectamos dominio, contacto, medición y ajustes finales."],
      ],
    },
    faq: [
      ["¿Puede ser económica?", "Sí. Si el objetivo lo permite, podemos partir de una base profesional y adaptarla a tu marca."],
      ["¿También hacen los textos?", "Sí. El copy forma parte del trabajo porque una página linda sin mensaje claro no alcanza."],
      ["¿Puedo usar mi propio dominio?", "Sí. Podemos conectarlo o ayudarte a gestionarlo si todavía no lo tenés."],
      ["¿Sirve para campañas?", "Sí. Podemos dejarla lista para Meta Ads, Google Ads, píxeles, eventos y formularios."],
    ],
    proofTitle: "La web tiene que trabajar para el negocio.",
    proofText:
      "No buscamos llenar secciones porque sí. Cada bloque tiene que ayudar a entender, confiar o avanzar.",
    comparisonEyebrow: "Dos formas de crearla",
    comparisonTitle: "Plantilla profesional cuando conviene. A medida cuando la página necesita algo propio.",
    comparison: [
      {
        label: "Base profesional",
        title: "Elegís una referencia y la adaptamos",
        price: "Más simple de presupuestar",
        text: "Partimos de diseños navegables para acelerar el proyecto sin que la web se vea improvisada.",
        bullets: ["Ideal para empezar", "Menos tiempo", "Adaptada a tu marca"],
        cta: "Ver diseños disponibles",
        href: "https://www.219shops.com.ar/disenos",
        external: true,
      },
      {
        label: "Desarrollo a medida",
        title: "Diseñamos desde cero",
        price: "Alcance personalizado",
        text: "Conviene cuando la marca, el contenido, la estructura o las funciones necesitan una solución más específica.",
        bullets: ["Mayor diferenciación", "Estructura propia", "Funciones específicas"],
        cta: "Consultar a medida",
        href: "/aplicar?servicio=paginas-web-landing-pages",
      },
    ],
    catalog: {
      eyebrow: "Referencias navegables",
      title: "Podés mirar diseños reales antes de decidir.",
      text: "El catálogo de 219Shops ayuda a elegir dirección visual, entender posibilidades y bajar a tierra una página sin depender solo de imaginarla.",
      href: "https://www.219shops.com.ar/disenos",
      cta: "Explorar catálogo de diseños",
      items: ["Diseños por rubro", "Adaptables a marca", "Base para cotizar mejor"],
    },
  },
  "software-a-medida": {
    type: "software-a-medida",
    eyebrow: "Desarrollo / Software a medida",
    title: "Cuando tu operación no entra en una herramienta genérica.",
    accent: "La construimos.",
    intro:
      "Creamos sistemas propios para ordenar clientes, reservas, pedidos, procesos internos, reportes o tareas que hoy dependen de planillas y mensajes sueltos.",
    cta: "Quiero evaluar un sistema",
    sections: [
      {
        title: "Gestión interna",
        text: "Paneles para administrar clientes, turnos, pedidos, presupuestos, tareas, estados y responsables.",
      },
      {
        title: "Procesos propios",
        text: "Flujos adaptados a la forma real en la que trabaja tu equipo, sin forzar el negocio a una app genérica.",
      },
      {
        title: "Usuarios y permisos",
        text: "Accesos diferenciados para dueños, equipo, clientes o áreas internas según lo que necesite la operación.",
      },
      {
        title: "Reportes y control",
        text: "Información ordenada para tomar decisiones sin buscar datos en veinte lugares distintos.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "El software a medida tiene sentido cuando el desorden ya cuesta tiempo, plata o oportunidades.",
      text: "No se trata de construir por construir. Primero detectamos qué parte del negocio está trabada y después diseñamos una herramienta que resuelva eso con la menor complejidad posible.",
      items: [
        {
          title: "Operación diaria",
          text: "Automatizamos y ordenamos tareas repetidas para que el equipo trabaje con menos fricción.",
        },
        {
          title: "Información centralizada",
          text: "Clientes, pedidos, reservas, estados y notas dejan de vivir desperdigados entre chats y planillas.",
        },
        {
          title: "Escalabilidad",
          text: "Construimos pensando en lo que necesitás ahora y en cómo puede crecer el sistema después.",
        },
        {
          title: "Experiencia simple",
          text: "Un sistema interno tiene que ser claro para el equipo, no una herramienta que nadie quiere abrir.",
        },
      ],
    },
    showcase: {
      eyebrow: "Ejemplos prácticos",
      title: "Sistemas internos para procesos que ya existen, pero funcionan a fuerza de paciencia.",
      text: "No vendemos software por moda. Lo pensamos cuando hay una operación real que necesita orden, trazabilidad o velocidad.",
      items: [
        ["01", "Reservas y turnos", "Calendarios, estados, responsables, clientes y recordatorios en un flujo propio."],
        ["02", "Pedidos y presupuestos", "Alta de solicitudes, seguimiento, aprobación, cambios y comunicación interna."],
        ["03", "Clientes y operaciones", "Historial, notas, archivos, permisos y tareas para que nada dependa solo de un chat."],
        ["04", "Paneles de control", "Vistas para entender qué está pendiente, qué avanzó y dónde se traba el trabajo."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Una primera versión usable, no una idea eterna en un documento.",
      text: "Bajamos el sistema a módulos concretos para que el negocio pueda probar, usar y decidir mejoras con información real.",
      items: [
        "Mapa funcional con módulos, roles y datos principales.",
        "Interfaz diseñada para el equipo que realmente la va a usar.",
        "Primera versión operativa con funciones priorizadas.",
        "Base preparada para soporte, mejoras e integraciones futuras.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Antes de hablar de tecnología, mapeamos cómo trabaja el negocio.",
      text: "Ese mapa define qué conviene construir primero y qué puede esperar.",
      items: [
        ["01", "Proceso actual", "Cómo se hace hoy la tarea, quién participa y dónde se pierde tiempo."],
        ["02", "Datos importantes", "Qué información hay que guardar, consultar, modificar o reportar."],
        ["03", "Roles", "Quién usa el sistema y qué puede ver o hacer cada perfil."],
        ["04", "Primera versión", "Definimos un MVP útil para salir con algo concreto y mejorarlo con uso real."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Construimos por etapas para no convertir una buena idea en un monstruo inmanejable.",
      steps: [
        ["01", "Diagnóstico operativo", "Detectamos el problema central y el costo real de seguir igual."],
        ["02", "Alcance funcional", "Definimos módulos, pantallas, datos, permisos e integraciones necesarias."],
        ["03", "Desarrollo iterativo", "Entregamos avances visibles para validar antes de cerrar todo."],
        ["04", "Soporte y evolución", "Acompañamos uso, mejoras, correcciones y nuevas funciones."],
      ],
    },
    faq: [
      ["¿Cuándo conviene software a medida?", "Cuando las herramientas existentes no resuelven bien tu proceso o te obligan a trabajar incómodo."],
      ["¿Puede empezar chico?", "Sí. De hecho suele ser lo mejor: una primera versión concreta, útil y preparada para crecer."],
      ["¿También diseñan la interfaz?", "Sí. Diseñamos pantallas y flujos para que el sistema sea usable por personas reales."],
      ["¿Lo mantienen después?", "Sí. Podemos seguir corrigiendo, midiendo y sumando funciones según el uso."],
    ],
    proofTitle: "Un sistema propio tiene que simplificar, no sumar burocracia.",
    proofText:
      "Por eso priorizamos claridad operativa, módulos útiles y una evolución controlada.",
  },
  "tiendas-online-plataformas": {
    type: "tiendas-online-plataformas",
    eyebrow: "Desarrollo / Tiendas online",
    title: "Tiendas y plataformas para vender sin perder el control.",
    accent: "Ni la operación.",
    intro:
      "Creamos soluciones comerciales para mostrar productos, recibir pedidos, gestionar stock, cobrar, ordenar clientes y conectar mejor el negocio.",
    cta: "Quiero vender online",
    sections: [
      {
        title: "Catálogo y productos",
        text: "Estructura para mostrar productos, variantes, precios, imágenes, categorías y disponibilidad.",
      },
      {
        title: "Pedidos y clientes",
        text: "Flujo claro para recibir consultas, ventas o solicitudes sin que todo dependa de mensajes sueltos.",
      },
      {
        title: "Pagos y envíos",
        text: "Conectamos medios de pago, métodos de entrega y herramientas necesarias según el modelo de venta.",
      },
      {
        title: "Plataforma propia",
        text: "Cuando una tienda estándar queda corta, podemos pensar una experiencia comercial a medida.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "Vender online no es solo subir productos. Es ordenar una operación comercial.",
      text: "La tienda tiene que ser fácil de navegar para el cliente y fácil de administrar para el negocio. Si no, termina siendo una vidriera linda que nadie mantiene.",
      items: [
        {
          title: "Experiencia de compra",
          text: "Organizamos el recorrido para que el cliente encuentre, entienda y avance sin fricción.",
        },
        {
          title: "Administración",
          text: "Preparamos la gestión para cargar productos, revisar pedidos y mantener la tienda viva.",
        },
        {
          title: "Integraciones comerciales",
          text: "Pagos, envíos, WhatsApp, analítica o herramientas externas según lo que el negocio necesite.",
        },
        {
          title: "Escala",
          text: "La solución puede empezar simple y crecer hacia una plataforma más completa.",
        },
      ],
    },
    showcase: {
      eyebrow: "Casos de uso",
      title: "La tienda correcta depende de cómo vendés, cómo cobrás y cómo entregás.",
      text: "Puede ser catálogo simple, tienda completa o plataforma comercial a medida. La decisión sale de la operación.",
      items: [
        ["01", "Catálogo con consulta", "Productos ordenados y CTA a WhatsApp cuando la venta necesita conversación."],
        ["02", "Tienda con checkout", "Carrito, pagos, envíos o retiro para vender con un flujo más automatizado."],
        ["03", "Pedidos B2B", "Listas, solicitudes, estados y gestión para clientes frecuentes o ventas mayoristas."],
        ["04", "Plataforma propia", "Una experiencia comercial con reglas, paneles o funciones que una tienda común no cubre."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Una experiencia de venta que el cliente entiende y el negocio puede administrar.",
      text: "La tienda se entrega con estructura comercial y criterios operativos, no como un catálogo suelto sin mantenimiento posible.",
      items: [
        "Arquitectura de categorías, productos, variantes y recorrido de compra.",
        "Configuración de contacto, pagos, envíos o consulta según el modelo.",
        "Panel o base de administración según la solución elegida.",
        "Medición y pruebas de flujo antes de lanzar.",
      ],
    },
    comparisonEyebrow: "Dos caminos posibles",
    comparisonTitle: "219Shops cuando necesitás salir ordenado. Desarrollo propio cuando la operación pide más.",
    comparison: [
      {
        label: "Base comercial",
        title: "Tienda con 219Shops",
        price: "Más directa de lanzar",
        text: "Conviene cuando el objetivo es tener catálogo, diseño profesional y venta online sin construir una plataforma desde cero.",
        bullets: ["Catálogo claro", "Menor complejidad inicial", "Diseños disponibles"],
        cta: "Ver diseños",
        href: "https://www.219shops.com.ar/disenos",
        external: true,
      },
      {
        label: "A medida",
        title: "Plataforma personalizada",
        price: "Alcance personalizado",
        text: "Conviene cuando hay reglas comerciales, usuarios, paneles, integraciones o procesos que una tienda estándar no resuelve.",
        bullets: ["Reglas propias", "Paneles internos", "Integraciones específicas"],
        cta: "Consultar plataforma",
        href: "/aplicar?servicio=tiendas-online-plataformas",
      },
    ],
    onboarding: {
      eyebrow: "Onboarding",
      title: "Para armar una tienda bien, necesitamos entender cómo vendés hoy.",
      text: "No todos los negocios necesitan el mismo checkout, catálogo o panel.",
      items: [
        ["01", "Tipo de productos", "Cantidad, variantes, categorías, precios y cambios frecuentes."],
        ["02", "Forma de venta", "Si se cobra online, por WhatsApp, por reserva, con envío o retiro."],
        ["03", "Operación", "Quién carga productos, quién responde pedidos y cómo se administra stock."],
        ["04", "Integraciones", "Pagos, envíos, analítica, CRM, sistemas internos o herramientas existentes."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Diseñamos la tienda alrededor de la compra y de la gestión diaria.",
      steps: [
        ["01", "Mapa comercial", "Entendemos productos, clientes, precios, logística y canales actuales."],
        ["02", "Arquitectura", "Definimos catálogo, navegación, checkout, contacto y administración."],
        ["03", "Implementación", "Construimos la tienda o plataforma, cargamos base inicial y conectamos herramientas."],
        ["04", "Lanzamiento", "Probamos compra, consultas, pagos, envíos y medición."],
      ],
    },
    faq: [
      ["¿Usan 219Shops?", "Puede ser una opción según el caso. También podemos desarrollar una solución personalizada."],
      ["¿Puedo vender sin pago online?", "Sí. Algunos negocios prefieren catálogo con consulta por WhatsApp o pedido asistido."],
      ["¿Conectan medios de pago?", "Sí. Evaluamos la herramienta más conveniente según país, operación y modelo de venta."],
      ["¿Me ayudan a ordenar productos?", "Sí. La estructura del catálogo es parte clave de que la tienda funcione."],
    ],
    proofTitle: "Una tienda bien hecha vende mejor porque se entiende mejor.",
    proofText:
      "La tecnología importa, pero la claridad comercial y operativa es lo que hace que la tienda se use todos los días.",
  },
  automatizaciones: {
    type: "automatizaciones",
    eyebrow: "Desarrollo / Automatizaciones",
    title: "Menos tareas repetidas. Más seguimiento real.",
    accent: "Más orden.",
    intro:
      "Armamos flujos para responder consultas, ordenar datos, conectar formularios, avisar al equipo y reducir trabajo manual innecesario.",
    cta: "Quiero automatizar",
    sections: [
      {
        title: "Formularios conectados",
        text: "Cada consulta puede llegar a una planilla, CRM, correo, WhatsApp o tablero de seguimiento.",
      },
      {
        title: "Avisos internos",
        text: "Notificaciones automáticas para que el equipo no se entere tarde de una venta, pedido o solicitud.",
      },
      {
        title: "Datos ordenados",
        text: "Recolectamos y normalizamos información para evitar copiar y pegar entre herramientas.",
      },
      {
        title: "Flujos comerciales",
        text: "Seguimiento de leads, respuestas iniciales, recordatorios y pasos simples para no perder oportunidades.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "La automatización buena no reemplaza criterio. Saca del medio tareas que no deberían consumir energía.",
      text: "Buscamos puntos concretos donde el negocio pierde tiempo, olvida respuestas o duplica trabajo, y diseñamos flujos simples que sostengan mejor la operación.",
      items: [
        {
          title: "Captación",
          text: "Consultas de web, formularios o campañas ingresan ordenadas al canal correcto.",
        },
        {
          title: "Seguimiento",
          text: "Recordatorios y estados ayudan a que ningún lead quede perdido.",
        },
        {
          title: "Comunicación interna",
          text: "El equipo recibe avisos claros cuando hay algo que requiere acción.",
        },
        {
          title: "Ahorro operativo",
          text: "Menos carga manual y menos errores repetidos por mover datos a mano.",
        },
      ],
    },
    showcase: {
      eyebrow: "Ejemplos prácticos",
      title: "Automatizaciones chicas pueden ordenar problemas grandes.",
      text: "Priorizamos flujos concretos, fáciles de probar y con impacto visible en la rutina del equipo.",
      items: [
        ["01", "Consulta a registro", "Un formulario entra en planilla, tablero o CRM con datos limpios."],
        ["02", "Pedido a aviso", "Cuando entra una venta o solicitud, el equipo recibe una notificación accionable."],
        ["03", "Estado a seguimiento", "Cada cambio dispara una tarea, recordatorio o mensaje interno."],
        ["04", "Reporte automático", "Datos de campañas, formularios o ventas se consolidan sin copiar y pegar."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Un flujo probado, documentado y conectado a las herramientas reales del negocio.",
      text: "La entrega busca que el equipo entienda qué dispara la automatización, qué hace y cómo detectar si algo necesita ajuste.",
      items: [
        "Mapa del flujo con disparador, condiciones, destino y excepciones.",
        "Automatización configurada en las herramientas definidas.",
        "Pruebas con casos reales antes de dejarla activa.",
        "Documentación simple para operar y pedir mejoras.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Empezamos detectando dónde se repite la misma tarea todos los días.",
      text: "Ahí suele estar la primera automatización útil.",
      items: [
        ["01", "Tarea repetida", "Qué se copia, avisa, responde, clasifica o revisa manualmente."],
        ["02", "Herramientas actuales", "Qué usan hoy: formularios, WhatsApp, Sheets, CRM, correo, sistema o panel."],
        ["03", "Reglas", "Qué tiene que pasar en cada caso y qué excepciones existen."],
        ["04", "Prueba controlada", "Implementamos primero un flujo pequeño, lo probamos y lo ajustamos."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Automatizamos lo que ya tiene sentido operativo, no lo que todavía está confuso.",
      steps: [
        ["01", "Mapa del flujo", "Vemos qué dispara la acción, qué datos entran y cuál es el resultado esperado."],
        ["02", "Diseño de reglas", "Definimos condiciones, mensajes, destinos y responsables."],
        ["03", "Implementación", "Conectamos herramientas y probamos casos reales."],
        ["04", "Monitoreo", "Revisamos errores, tiempos y oportunidades de mejora."],
      ],
    },
    faq: [
      ["¿Necesito tener CRM?", "No necesariamente. Podemos empezar con herramientas simples y después escalar."],
      ["¿Automatizan WhatsApp?", "Podemos conectar flujos relacionados a WhatsApp según el caso y las herramientas disponibles."],
      ["¿Esto reemplaza al equipo?", "No. La idea es que el equipo tenga menos tareas repetitivas y más foco en responder mejor."],
      ["¿Puede ser una automatización chica?", "Sí. Muchas veces una automatización pequeña mejora muchísimo el orden diario."],
    ],
    proofTitle: "Automatizar bien es ordenar antes de acelerar.",
    proofText:
      "Si el proceso está mal pensado, automatizar solo hace que el desorden viaje más rápido. Primero lo entendemos.",
  },
  integraciones: {
    type: "integraciones",
    eyebrow: "Desarrollo / Integraciones",
    title: "Conectamos herramientas para que la información no quede desperdigada.",
    accent: "Ni duplicada.",
    intro:
      "Integramos pagos, analítica, formularios, campañas, sistemas, tiendas y herramientas internas para que el negocio trabaje con datos más conectados.",
    cta: "Quiero integrar herramientas",
    sections: [
      {
        title: "Pagos y ventas",
        text: "Conectamos medios de pago, tiendas, pedidos, formularios y sistemas comerciales.",
      },
      {
        title: "Analítica y campañas",
        text: "Eventos, píxeles, conversiones y medición para entender qué acciones generan resultados.",
      },
      {
        title: "Formularios y CRM",
        text: "Los leads pueden entrar ordenados a una base, pipeline, planilla o herramienta de seguimiento.",
      },
      {
        title: "Sistemas existentes",
        text: "Evaluamos APIs, exportaciones o conexiones posibles para no depender siempre de carga manual.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "Cuando cada herramienta guarda una parte de la verdad, el negocio empieza a perder control.",
      text: "Las integraciones ayudan a que los datos viajen mejor: consultas, pagos, pedidos, clientes, métricas y operaciones conectadas donde realmente hacen falta.",
      items: [
        {
          title: "Menos duplicación",
          text: "Evitamos cargar la misma información en varios lugares.",
        },
        {
          title: "Mejor medición",
          text: "Conectamos eventos y conversiones para que marketing no trabaje a ciegas.",
        },
        {
          title: "Flujos entre áreas",
          text: "Ventas, administración y operación pueden recibir la información que necesitan.",
        },
        {
          title: "Base para escalar",
          text: "Una integración bien pensada prepara el camino para automatizaciones y sistemas más sólidos.",
        },
      ],
    },
    showcase: {
      eyebrow: "Ejemplos prácticos",
      title: "Integrar es hacer que el dato llegue donde se usa.",
      text: "Cada integración se define por necesidad real, permisos disponibles y nivel de confiabilidad que requiere la operación.",
      items: [
        ["01", "Formulario a CRM", "Las consultas entran con origen, datos y estado inicial para seguimiento comercial."],
        ["02", "Pago a pedido", "Una venta o cobro puede actualizar un pedido, avisar al equipo o registrar una operación."],
        ["03", "Web a analítica", "Eventos y conversiones quedan preparados para leer campañas con más claridad."],
        ["04", "Sistema a planilla", "Cuando no hay API completa, buscamos caminos controlados para ordenar datos exportables."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Una conexión útil, con límites claros y pruebas antes de depender de ella.",
      text: "No todas las herramientas permiten lo mismo. Por eso dejamos explícito qué se conecta, qué no y cómo se monitorea.",
      items: [
        "Relevamiento de APIs, permisos, webhooks o alternativas posibles.",
        "Diseño del flujo de datos entre origen y destino.",
        "Implementación y pruebas con casos reales.",
        "Notas de operación, accesos necesarios y puntos de control.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Para integrar bien, primero revisamos qué herramientas hablan entre sí.",
      text: "No todas las plataformas permiten lo mismo, por eso evaluamos posibilidades reales antes de prometer.",
      items: [
        ["01", "Herramientas", "Qué sistemas, webs, tiendas, formularios, pagos o planillas usan hoy."],
        ["02", "Dato clave", "Qué información tiene que moverse y hacia dónde."],
        ["03", "Frecuencia", "Si el dato debe viajar en tiempo real, por lote o bajo demanda."],
        ["04", "Accesos", "Revisamos APIs, credenciales, permisos, documentación o alternativas."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Conectamos solo lo necesario, con pruebas antes de dejarlo en producción.",
      steps: [
        ["01", "Relevamiento", "Identificamos herramientas, datos, permisos y limitaciones."],
        ["02", "Diseño de integración", "Definimos origen, destino, reglas, seguridad y manejo de errores."],
        ["03", "Implementación", "Conectamos, probamos y documentamos el flujo."],
        ["04", "Validación", "Revisamos casos reales y dejamos listo el seguimiento."],
      ],
    },
    faq: [
      ["¿Pueden integrar cualquier herramienta?", "Depende de si la herramienta ofrece API, exportación, webhooks o alguna forma segura de conexión."],
      ["¿También configuran píxeles?", "Sí. Podemos configurar medición de eventos para campañas y landings."],
      ["¿Necesito compartir accesos?", "En algunos casos sí, pero se hace de forma controlada y solo para lo necesario."],
      ["¿Puede conectarse con un sistema viejo?", "Lo evaluamos. A veces hay API, a veces exportaciones, y a veces conviene otro camino."],
    ],
    proofTitle: "Integrar es hacer que la operación tenga una sola conversación.",
    proofText:
      "Cuando los datos están conectados, las decisiones son más rápidas y los errores más fáciles de detectar.",
  },
  "mantenimiento-mejoras": {
    type: "mantenimiento-mejoras",
    eyebrow: "Desarrollo / Mantenimiento",
    title: "No dejamos la tecnología tirada después de publicarla.",
    accent: "La acompañamos.",
    intro:
      "Podemos seguir midiendo, corrigiendo, optimizando y sumando funciones cuando el negocio cambia o crece.",
    cta: "Necesito mantenimiento",
    sections: [
      {
        title: "Correcciones",
        text: "Ajustes técnicos, errores, problemas visuales, formularios, enlaces, performance o comportamiento inesperado.",
      },
      {
        title: "Mejoras evolutivas",
        text: "Nuevas secciones, funciones, pantallas, módulos o cambios que acompañan el crecimiento del negocio.",
      },
      {
        title: "Optimización",
        text: "Revisión de velocidad, claridad, conversión, experiencia mobile y puntos que frenan consultas.",
      },
      {
        title: "Soporte continuo",
        text: "Un esquema de seguimiento para que la web, sistema o plataforma no dependa de apagar incendios.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "Publicar no es terminar. Es empezar a ver cómo se comporta la herramienta en la vida real.",
      text: "El mantenimiento evita que la tecnología envejezca mal, se rompa en silencio o quede desactualizada frente a nuevas necesidades del negocio.",
      items: [
        {
          title: "Estabilidad",
          text: "Revisamos errores, formularios, integraciones y puntos críticos.",
        },
        {
          title: "Mejoras por uso",
          text: "Sumamos cambios basados en lo que pasa realmente, no en suposiciones eternas.",
        },
        {
          title: "Contenido y secciones",
          text: "Actualizamos textos, servicios, productos, fotos o páginas internas.",
        },
        {
          title: "Evolución técnica",
          text: "Preparamos la base para nuevas funciones sin romper lo que ya funciona.",
        },
      ],
    },
    showcase: {
      eyebrow: "Tipos de mejora",
      title: "A veces hace falta apagar un incendio. Otras, evolucionar con calma.",
      text: "Separar urgencias de mejoras evita gastar energía en cambios que no mueven nada importante.",
      items: [
        ["01", "Correcciones críticas", "Formularios, enlaces, errores visuales, integraciones o partes que dejaron de funcionar."],
        ["02", "Contenido y secciones", "Nuevos servicios, textos, imágenes, páginas internas o ajustes de comunicación."],
        ["03", "Performance y mobile", "Revisión de carga, lectura, botones, jerarquías y puntos que traban consultas."],
        ["04", "Nuevas funciones", "Módulos, pantallas o conexiones que la operación necesita después del lanzamiento."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Un plan de acción claro antes de tocar cosas a ciegas.",
      text: "La entrega puede ser puntual o continua, pero siempre arranca por entender estado, prioridad y riesgo.",
      items: [
        "Revisión inicial de estado técnico, visual y funcional.",
        "Lista priorizada de correcciones y mejoras.",
        "Ejecución de ajustes definidos y pruebas básicas.",
        "Recomendaciones para continuidad, soporte o próximas etapas.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Primero hacemos una revisión honesta del estado actual.",
      text: "Necesitamos entender qué existe, qué falla y qué nivel de acompañamiento tiene sentido.",
      items: [
        ["01", "Acceso y contexto", "Qué plataforma, hosting, dominio, repositorio o panel existe hoy."],
        ["02", "Problemas actuales", "Qué falla, qué molesta o qué está trabando al negocio."],
        ["03", "Prioridades", "Separar urgencias reales de mejoras deseables."],
        ["04", "Plan", "Definimos si conviene trabajo puntual, bolsa de horas o mantenimiento mensual."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Priorizamos estabilidad, después mejora.",
      steps: [
        ["01", "Auditoría rápida", "Revisamos estado técnico, visual y funcional."],
        ["02", "Lista de prioridades", "Ordenamos impacto, urgencia y esfuerzo."],
        ["03", "Ejecución", "Aplicamos correcciones y mejoras con control."],
        ["04", "Seguimiento", "Dejamos un esquema claro para futuros ajustes."],
      ],
    },
    faq: [
      ["¿Mantienen webs que no hicieron ustedes?", "Podemos evaluarlo. Primero necesitamos revisar tecnología, accesos y estado general."],
      ["¿Puede ser un arreglo puntual?", "Sí. No todo tiene que ser mensual. Depende del caso."],
      ["¿Incluye nuevas funciones?", "Puede incluirlas si se define dentro del alcance o como mejora evolutiva."],
      ["¿También actualizan contenido?", "Sí. Textos, secciones, enlaces, imágenes y pequeños cambios pueden entrar en mantenimiento."],
    ],
    proofTitle: "La tecnología útil necesita cuidado, no abandono.",
    proofText:
      "Un buen mantenimiento evita urgencias, mejora rendimiento y mantiene la herramienta alineada al negocio.",
  },
  dominios: {
    type: "dominios",
    eyebrow: "Desarrollo / Dominios",
    title: "Gestionamos tu dominio para que tu marca tenga casa propia.",
    accent: "Y orden.",
    intro:
      "Vendemos, configuramos y administramos dominios con servicio de marca blanca para que tu web, correo y presencia digital queden bien resueltos.",
    cta: "Quiero gestionar mi dominio",
    sections: [
      {
        title: "Venta de dominios",
        text: "Te ayudamos a elegir, registrar y dejar activo el dominio adecuado para tu marca o proyecto.",
      },
      {
        title: "Gestión técnica",
        text: "Configuramos DNS, conexión con web, correos, verificaciones y herramientas necesarias.",
      },
      {
        title: "Marca blanca",
        text: "Podemos operar la gestión de dominios bajo una modalidad prolija para clientes y proyectos comerciales.",
      },
      {
        title: "Renovaciones",
        text: "Acompañamos vencimientos, cambios y continuidad para evitar que el dominio quede perdido o caído.",
      },
    ],
    detail: {
      eyebrow: "Qué resolvemos",
      title: "El dominio parece chico hasta que algo no funciona.",
      text: "Un dominio mal gestionado puede dejar caída una web, cortar correos o complicar campañas. Por eso lo tratamos como parte real de la infraestructura del negocio.",
      items: [
        {
          title: "Registro",
          text: "Buscamos disponibilidad y gestionamos el alta según la extensión que convenga.",
        },
        {
          title: "DNS",
          text: "Configuramos registros para web, email, verificaciones, herramientas y servicios externos.",
        },
        {
          title: "Conexión con web",
          text: "Dejamos el dominio apuntando correctamente al sitio, landing o plataforma.",
        },
        {
          title: "Administración",
          text: "Ordenamos renovaciones, accesos y cambios futuros para que no dependa de la memoria de nadie.",
        },
      ],
    },
    showcase: {
      eyebrow: "Casos habituales",
      title: "Dominio, DNS y correo tienen que estar ordenados antes de que el negocio los necesite urgente.",
      text: "La gestión prolija evita pérdidas de acceso, configuraciones duplicadas y lanzamientos frenados por detalles técnicos.",
      items: [
        ["01", "Registro nuevo", "Buscamos disponibilidad, alternativas y extensión conveniente para la marca."],
        ["02", "Dominio existente", "Revisamos proveedor, titularidad, vencimiento y registros activos."],
        ["03", "Conexión web", "Apuntamos dominio y subdominios a landing, tienda, web o plataforma."],
        ["04", "Correo y verificaciones", "Configuramos registros necesarios para email, herramientas, campañas o servicios externos."],
      ],
    },
    deliverables: {
      eyebrow: "Qué queda listo",
      title: "Dominio operativo, configurado y con administración más clara.",
      text: "Buscamos que el dominio no sea una caja negra: se registra, se conecta y se deja ordenado para futuros cambios.",
      items: [
        "Registro, revisión o gestión del dominio según el caso.",
        "Configuración DNS para web, correo y verificaciones necesarias.",
        "Conexión con landing, sitio, tienda o plataforma.",
        "Resumen de configuración, vencimientos y próximos cuidados.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Para empezar, revisamos si ya existe dominio o si hay que registrarlo desde cero.",
      text: "Con eso definimos el camino técnico y administrativo correcto.",
      items: [
        ["01", "Nombre", "Marca, dominio deseado y alternativas si no está disponible."],
        ["02", "Uso", "Web, landing, tienda, correo, campañas o plataforma."],
        ["03", "Accesos", "Si ya existe, revisamos proveedor actual, DNS y titularidad."],
        ["04", "Configuración", "Dejamos registros, conexión y renovaciones ordenadas."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Dominio registrado, configurado y listo para usar.",
      steps: [
        ["01", "Búsqueda", "Revisamos disponibilidad y alternativas."],
        ["02", "Registro o traspaso", "Gestionamos alta, compra o revisión del dominio existente."],
        ["03", "Configuración DNS", "Conectamos web, correos y herramientas."],
        ["04", "Entrega ordenada", "Dejamos claro qué se configuró y cómo se administra."],
      ],
    },
    faq: [
      ["¿Venden dominios?", "Sí. Podemos vender y gestionar dominios para proyectos web y marcas."],
      ["¿Qué significa marca blanca?", "Que podemos gestionar dominios de forma prolija para proyectos donde el cliente no necesita ver toda la operación técnica."],
      ["¿Pueden conectar un dominio que ya tengo?", "Sí. Revisamos accesos, DNS y proveedor actual."],
      ["¿También configuran correos?", "Podemos configurar registros necesarios para correo o conectar el dominio con la herramienta que uses."],
    ],
    proofTitle: "El dominio es infraestructura, no un detalle administrativo.",
    proofText:
      "Cuando está bien gestionado, nadie lo nota. Cuando está mal, todo se frena.",
  },
  crm: {
    type: "crm",
    eyebrow: "Desarrollo / CRM",
    title: "Estamos preparando soluciones CRM para ordenar clientes y oportunidades.",
    accent: "Próximamente.",
    intro:
      "Vamos a sumar CRM para negocios que necesitan registrar contactos, seguir oportunidades, medir estados comerciales y no perder consultas por falta de orden.",
    cta: "Quiero que me avisen",
    sections: [
      {
        title: "Leads ordenados",
        text: "Consultas, contactos y oportunidades en un flujo claro para saber qué responder y cuándo seguir.",
      },
      {
        title: "Estados comerciales",
        text: "Pipeline simple para entender en qué etapa está cada oportunidad y qué acción falta.",
      },
      {
        title: "Seguimiento",
        text: "Recordatorios, notas y tareas para que las ventas no dependan solo de memoria o chats.",
      },
      {
        title: "Conexiones futuras",
        text: "Base preparada para integrarse con formularios, campañas, automatizaciones y herramientas internas.",
      },
    ],
    detail: {
      eyebrow: "Qué viene",
      title: "Un CRM tiene sentido cuando el problema no es conseguir consultas, sino no perderlas.",
      text: "Estamos preparando una línea de trabajo para ordenar leads, ventas y relaciones comerciales sin volver complejo lo simple.",
      items: [
        {
          title: "Contactos",
          text: "Base limpia de clientes, prospectos, conversaciones y datos importantes.",
        },
        {
          title: "Oportunidades",
          text: "Estados para saber qué está frío, qué está caliente y qué necesita seguimiento.",
        },
        {
          title: "Equipo",
          text: "Responsables, tareas y notas para que ventas no sea una caja negra.",
        },
        {
          title: "Medición",
          text: "Datos para entender cuántas consultas entran, cuántas avanzan y dónde se caen.",
        },
      ],
    },
    notice: {
      eyebrow: "Estado actual",
      title: "CRM está en preparación, pero el problema de seguimiento se puede empezar a ordenar ahora.",
      text: "Si hoy perdés consultas, no hace falta esperar a una suite completa. Podemos relevar el proceso, conectar formularios, ordenar una base inicial o preparar automatizaciones simples mientras la línea CRM termina de tomar forma.",
    },
    showcase: {
      eyebrow: "Qué estamos preparando",
      title: "Una solución para seguir oportunidades sin volver pesado el trabajo comercial.",
      text: "La idea es que el CRM ayude a responder mejor, priorizar y entender qué pasa con cada oportunidad.",
      items: [
        ["01", "Entrada de leads", "Consultas desde web, campañas, formularios o canales comerciales en un lugar más ordenado."],
        ["02", "Pipeline simple", "Estados claros para saber qué está nuevo, en conversación, pendiente o cerrado."],
        ["03", "Tareas y notas", "Próximas acciones, responsables y contexto para que el seguimiento no dependa de memoria."],
        ["04", "Base para integrar", "Preparado para conectarse con automatizaciones, campañas y herramientas internas."],
      ],
    },
    deliverables: {
      eyebrow: "Qué se puede avanzar ahora",
      title: "Diagnóstico comercial y base de orden antes de implementar CRM.",
      text: "Aunque la línea CRM esté en preparación, podemos dejar listo el terreno para que la adopción sea más simple.",
      items: [
        "Mapa de entrada de consultas y seguimiento actual.",
        "Definición de estados comerciales y datos mínimos necesarios.",
        "Recomendación de camino: CRM, automatización, formulario o integración.",
        "Lista de espera contextualizada para avanzar cuando corresponda.",
      ],
    },
    onboarding: {
      eyebrow: "Onboarding",
      title: "Mientras preparamos CRM, podemos relevar tu proceso comercial.",
      text: "Eso nos permite saber si necesitás CRM, automatización, formulario, landing o una mezcla.",
      items: [
        ["01", "Entrada de leads", "De dónde llegan hoy las consultas."],
        ["02", "Seguimiento", "Cómo registran respuestas, estados y próximas acciones."],
        ["03", "Equipo", "Quién vende, quién responde y quién necesita ver información."],
        ["04", "Prioridad", "Qué habría que ordenar primero para no perder oportunidades."],
      ],
    },
    workflow: {
      eyebrow: "Próximo paso",
      title: "Podemos dejarte en lista para CRM o resolver ahora el problema de captación y seguimiento.",
      steps: [
        ["01", "Consulta", "Nos contás cómo llegan y cómo se siguen los leads hoy."],
        ["02", "Diagnóstico", "Vemos si el cuello de botella es CRM, web, campaña o proceso interno."],
        ["03", "Camino posible", "Definimos una solución simple para empezar a ordenar."],
        ["04", "CRM", "Cuando la línea esté lista, ya tenemos contexto para implementarla mejor."],
      ],
    },
    faq: [
      ["¿Ya está disponible?", "Está en preparación. Podemos relevar tu caso y avisarte cuando tenga sentido avanzar."],
      ["¿Puede integrarse con una web?", "Esa es la idea: formularios, campañas y consultas deberían entrar ordenadas."],
      ["¿Sirve para negocios chicos?", "Sí, si ya hay consultas o clientes que necesitan seguimiento."],
      ["¿Pueden armar algo antes?", "Sí. Podemos resolver captación, formularios, automatizaciones o seguimiento simple mientras tanto."],
    ],
    proofTitle: "CRM no es tener una base de datos. Es no perder oportunidades.",
    proofText:
      "La herramienta vale cuando el equipo la usa y cuando ayuda a vender mejor.",
  },
};

const PAGE_DATA = {
  desarrollo: {
    type: "desarrollo",
    eyebrow: "Desarrollo y tecnología",
    title: "Creamos la herramienta digital que tu negocio necesita.",
    accent: "No al revés.",
    intro:
      "Páginas web, landing pages, tiendas online, sistemas internos y software a medida para empresas que necesitan ordenar, vender o trabajar mejor.",
    cta: "Contar qué quiero desarrollar",
    sections: [
      {
        title: "Páginas web y landing pages",
        text: "Una presencia clara, rápida y preparada para generar consultas. Puede ser con plantilla o completamente a medida.",
        href: "/desarrollo/paginas-web-landing-pages",
        cta: "Ver webs y landings",
      },
      {
        title: "Software a medida",
        text: "Sistemas de gestión, reservas, clientes, operaciones internas o procesos que hoy se hacen manualmente.",
        href: "/desarrollo/software-a-medida",
        cta: "Ver software",
      },
      {
        title: "Tiendas online y plataformas",
        text: "Soluciones comerciales para vender, administrar productos y conectar mejor la operación del negocio.",
        href: "/desarrollo/tiendas-online-plataformas",
        cta: "Ver tiendas",
      },
      {
        title: "Automatizaciones",
        text: "Flujos para responder consultas, ordenar datos, conectar formularios, avisar al equipo o evitar tareas repetidas.",
        href: "/desarrollo/automatizaciones",
        cta: "Ver automatizaciones",
      },
      {
        title: "Integraciones",
        text: "Conectamos herramientas, pagos, analítica, formularios y sistemas para que la información no quede desperdigada.",
        href: "/desarrollo/integraciones",
        cta: "Ver integraciones",
      },
      {
        title: "Mantenimiento y mejoras",
        text: "No dejamos la tecnología tirada. Podemos seguir midiendo, corrigiendo y sumando funciones cuando el negocio crece.",
        href: "/desarrollo/mantenimiento-mejoras",
        cta: "Ver mantenimiento",
      },
      {
        title: "Dominios",
        text: "Vendemos, configuramos y gestionamos tu dominio. También contamos con servicio de marca blanca.",
        href: "/desarrollo/dominios",
        cta: "Ver dominios",
      },
      {
        title: "CRM",
        text: "Estamos preparando soluciones para ordenar clientes, oportunidades, seguimiento comercial y consultas entrantes.",
        href: "/desarrollo/crm",
        cta: "Ver CRM",
      },
    ],
    detail: {
      eyebrow: "Qué desarrollamos",
      title: "Tecnología para negocios que necesitan algo más que una página linda.",
      text: "A veces alcanza con una landing clara. Otras veces hace falta un sistema, una tienda, un panel interno o una herramienta que acompañe cómo trabaja la empresa. Lo importante es no empezar por la tecnología: empezamos por el problema.",
      items: [
        {
          title: "Webs comerciales",
          text: "Para presentar servicios, generar confianza y recibir consultas sin explicar todo por WhatsApp.",
        },
        {
          title: "Sistemas internos",
          text: "Para ordenar clientes, turnos, pedidos, procesos, reservas, presupuestos o tareas del equipo.",
        },
        {
          title: "Productos digitales",
          text: "Para negocios que quieren lanzar una plataforma propia o validar una idea con una primera versión usable.",
        },
        {
          title: "E-commerce",
          text: "Para vender online con catálogo, stock, pedidos, cobros, envíos y clientes mejor conectados.",
        },
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Primero entendemos el negocio. Después escribimos código.",
      steps: [
        ["01", "Diagnóstico", "Vemos qué querés lograr, qué ya existe y qué está trabando la operación."],
        ["02", "Alcance", "Definimos qué conviene hacer ahora, qué puede esperar y qué no tiene sentido construir."],
        ["03", "Diseño y desarrollo", "Armamos estructura, pantallas, lógica, contenido y funcionalidades con entregas claras."],
        ["04", "Lanzamiento y mejora", "Probamos, publicamos, medimos y dejamos preparado el camino para futuras mejoras."],
      ],
    },
    faq: [
      ["¿Tengo que saber qué tecnología necesito?", "No. De hecho, es mejor que vengas con el problema. Nosotros definimos si conviene una landing, una web, un sistema o algo más simple."],
      ["¿Hacen páginas con plantilla y también a medida?", "Sí. Si necesitás algo accesible, podemos partir de una base. Si el proyecto requiere diferenciación o funciones propias, lo hacemos desde cero."],
      ["¿Pueden desarrollar un sistema para mi forma de trabajar?", "Sí. Justamente el software a medida sirve cuando tu negocio no encaja bien en herramientas genéricas."],
      ["¿También se encargan del diseño y el copy?", "Sí. No entregamos solo código. La estructura, los textos y la experiencia forman parte del trabajo."],
    ],
    proofTitle: "También construimos nuestras propias plataformas.",
    proofText:
      "219Shops funciona como prueba concreta de nuestra capacidad para pensar producto, diseño, operación y tecnología. Las líneas en evaluación se comunican solo con alcance validado.",
  },
  ...DEVELOPMENT_SERVICE_PAGES,
  marketing: {
    type: "marketing",
    eyebrow: "Marketing y contenido",
    title: "Tu negocio puede tener un gran producto.",
    accent: "Pero si nadie lo entiende, cuesta vender.",
    intro:
      "Creamos campañas publicitarias, contenido y estrategias para que más personas descubran tu marca, entiendan qué ofrecés y tengan motivos para elegirte.",
    cta: "Consultar marketing",
    sections: [
      {
        title: "Publicidad digital",
        text: "Campañas en Meta, Google y otros canales para llegar a personas con intención real de comprar o consultar.",
      },
      {
        title: "Contenido y creatividad",
        text: "Videos, reels, diseños, fotografías y mensajes que hacen que tu marca se vea profesional y cercana.",
      },
      {
        title: "Estrategia y seguimiento",
        text: "Planificación, medición y ajustes para que la inversión tenga una dirección y no sea publicar por publicar.",
      },
      {
        title: "Gestión de redes",
        text: "Calendario, publicaciones, mensajes y presencia constante para que la marca no dependa de inspiración de último momento.",
      },
      {
        title: "Diseño gráfico",
        text: "Piezas visuales para redes, campañas, promociones, lanzamientos y comunicación diaria.",
      },
      {
        title: "Producción audiovisual",
        text: "Contenido real para marcas que necesitan mostrar personas, productos, espacios, procesos y resultados.",
      },
    ],
    detail: {
      eyebrow: "Cómo lo pensamos",
      title: "Marketing no es hacer ruido. Es ayudar a que el cliente entienda por qué elegirte.",
      text: "El problema de muchos negocios no es que no publican. Es que publican sin una idea clara, sin oferta, sin seguimiento y sin una página o canal que convierta ese interés en consulta.",
      items: [
        {
          title: "Mensaje",
          text: "Aclaramos qué vendés, para quién, por qué importa y qué tiene que hacer la persona después.",
        },
        {
          title: "Contenido",
          text: "Creamos piezas que muestran el negocio de forma profesional, cercana y fácil de entender.",
        },
        {
          title: "Tráfico",
          text: "Usamos publicidad para llegar a personas que pueden tener interés real en tu producto o servicio.",
        },
        {
          title: "Medición",
          text: "Miramos qué funciona, qué no y dónde conviene ajustar antes de seguir gastando.",
        },
      ],
    },
    modalities: {
      eyebrow: "Modalidades",
      title: "Trabajá con nosotros como lo necesites.",
      text: "Algunos negocios necesitan acompañamiento mensual. Otros llegan con una necesidad concreta. Las dos formas son válidas si el objetivo está claro.",
      items: [
        {
          label: "Plan mensual",
          title: "Estrategia y acompañamiento continuo",
          text: "Para marcas que necesitan planificación, producción de contenido, campañas, seguimiento y mejoras mes a mes.",
          bullets: ["Campañas", "Contenido", "Seguimiento"],
          cta: "Consultar plan mensual",
          href: "/aplicar?servicio=marketing",
        },
        {
          label: "Trabajo puntual",
          title: "Una necesidad concreta, bien resuelta",
          text: "Para quienes necesitan un reel, una campaña, piezas de diseño, producción audiovisual o una acción específica.",
          bullets: ["Reels", "Diseños", "Campañas puntuales"],
          cta: "Solicitar trabajo puntual",
          href: "/aplicar?servicio=marketing",
        },
      ],
    },
    showcase: {
      eyebrow: "Qué podemos mostrar",
      title: "Marketing se entiende mejor cuando ves las piezas, no solo la explicación.",
      text: "En una consulta podemos revisar ejemplos reales disponibles, el tipo de contenido que necesita tu marca y qué formato conviene producir. No usamos métricas ni casos que no estén verificados.",
      items: [
        ["01", "Reels y producción", "Videos cortos, contenido humanizado y piezas audiovisuales para mostrar personas, productos, espacios o procesos."],
        ["02", "Diseños y piezas", "Creatividades para redes, promociones, campañas, lanzamientos y comunicación diaria."],
        ["03", "Campañas", "Anuncios con objetivo, mensaje, segmentación y seguimiento para no pautar por inercia."],
        ["04", "Calendario", "Planificación de publicaciones y acciones para sostener presencia sin depender de inspiración de último momento."],
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Dejamos de improvisar y armamos un sistema comercial simple.",
      steps: [
        ["01", "Diagnóstico comercial", "Entendemos qué vendés, quién compra, qué objeciones aparecen y qué canales usás hoy."],
        ["02", "Plan de contenido y campañas", "Definimos mensajes, piezas, frecuencia, inversión y objetivos de cada acción."],
        ["03", "Producción y lanzamiento", "Creamos contenido, configuramos campañas y conectamos la medición necesaria."],
        ["04", "Optimización", "Revisamos consultas, anuncios, contenido y conversiones para mejorar el rendimiento."],
      ],
    },
    faq: [
      ["¿Trabajan solo redes sociales?", "No. Podemos trabajar redes, anuncios, contenido, diseño, landing pages y medición. La idea es que todo tenga una dirección."],
      ["¿Puedo contratar un plan mensual?", "Sí. Es la modalidad recomendada cuando necesitás estrategia continua, producción de contenido, campañas y seguimiento."],
      ["¿Puedo contratar un trabajo puntual?", "Sí. También podemos resolver una campaña, reel, diseño, producción audiovisual o necesidad concreta."],
      ["¿Necesito invertir en publicidad?", "No siempre, pero si querés acelerar resultados, la pauta ayuda. Lo importante es no pautar sin una oferta y una página preparadas."],
      ["¿Pueden producir contenido real?", "Sí. Podemos trabajar piezas de diseño, reels, videos, fotos y contenido humanizado según el tipo de negocio."],
      ["¿Prometen resultados exactos?", "No inventamos promesas. Trabajamos con estrategia, medición y mejora, pero no vendemos números imposibles sin contexto."],
    ],
    proofTitle: "Marketing que se ve y se mide.",
    proofText:
      "Trabajamos con casos reales, métricas y aprendizaje continuo. Cuando no hay datos suficientes, no inventamos resultados.",
  },
  "landing-pages": {
    type: "landing-pages",
    eyebrow: "Landing pages",
    title: "Tu negocio necesita una página profesional.",
    accent: "Adaptada a lo que querés lograr.",
    intro:
      "Tenemos dos formas de trabajar: partir de un diseño profesional para hacerlo más accesible o crear una página desde cero para una necesidad específica.",
    cta: "Consultar por mi página",
    sections: [
      {
        title: "Con plantilla",
        text: "Una opción más económica para tener presencia profesional, explicar tus servicios y empezar a recibir consultas.",
      },
      {
        title: "A medida",
        text: "Diseño, estructura y funciones pensadas desde cero según tu marca, tus objetivos y tu forma de vender.",
      },
      {
        title: "Preparada para convertir",
        text: "Copy claro, secciones ordenadas, CTA visibles y una experiencia simple para que el visitante entienda qué hacer.",
      },
    ],
    detail: {
      eyebrow: "Qué incluye",
      title: "Una landing no es una portada. Es una conversación ordenada.",
      text: "La página tiene que explicar rápido qué ofrecés, generar confianza, resolver dudas y llevar a la persona al próximo paso sin hacerla pensar de más.",
      items: [
        {
          title: "Estructura comercial",
          text: "Secciones pensadas para que el visitante entienda la oferta, el valor y el próximo paso.",
        },
        {
          title: "Copy claro",
          text: "Textos simples, directos y sin tecnicismos innecesarios para que cualquier persona entienda qué vendés.",
        },
        {
          title: "Diseño responsive",
          text: "La página se adapta a celular y escritorio, porque la mayoría de las consultas llegan desde el teléfono.",
        },
        {
          title: "CTA y contacto",
          text: "Botones, WhatsApp o formulario conectados con la intención real del visitante.",
        },
      ],
    },
    workflow: {
      eyebrow: "Proceso",
      title: "Elegimos la forma de trabajo según tu presupuesto y tu necesidad.",
      steps: [
        ["01", "Definimos objetivo", "No es lo mismo vender servicios, mostrar un catálogo, captar turnos o validar una idea."],
        ["02", "Elegimos camino", "Vemos si conviene partir de un diseño existente o crear una página completamente a medida."],
        ["03", "Adaptamos o diseñamos", "Trabajamos textos, estructura, imágenes, colores, secciones y llamados a la acción."],
        ["04", "Publicamos y medimos", "Dejamos la página lista para recibir visitas, consultas y futuras campañas."],
      ],
    },
    faq: [
      ["¿Puedo elegir una base del catálogo?", "Sí. Podés usar los diseños de 219Shops como referencia y después adaptarlos a tu marca, rubro y contenido."],
      ["¿Una plantilla sirve para cualquier negocio?", "Sirve si el objetivo es tener una página profesional, clara y accesible. Si necesitás algo muy específico, conviene ir a medida."],
      ["¿La página puede conectarse con campañas?", "Sí. Podemos prepararla para recibir tráfico de anuncios y medir eventos importantes."],
      ["¿Me ayudan con los textos?", "Sí. La idea es que no tengas que inventar todo. Nosotros ordenamos el mensaje y lo llevamos a una página concreta."],
    ],
    proofTitle: "La opción accesible no tiene que verse barata.",
    proofText:
      "La diferencia está en el nivel de personalización, no en hacer algo improvisado. La idea es que cada cliente entienda qué está comprando.",
    comparisonEyebrow: "Dos caminos",
    comparisonTitle: "Plantilla cuando conviene. A medida cuando hace falta.",
    comparison: [
      {
        label: "Opción accesible",
        title: "Partimos de una base real",
        price: "Más rápida y económica",
        text: "Elegís una referencia navegable y la adaptamos con tu marca, textos, imágenes, colores, secciones y llamados a la acción.",
        bullets: ["Ideal para empezar", "Diseños por rubro", "Menos tiempo de producción"],
        cta: "Ver diseños disponibles",
        href: "https://www.219shops.com.ar/disenos",
        external: true,
      },
      {
        label: "Opción personalizada",
        title: "Diseñamos desde cero",
        price: "Presupuesto a medida",
        text: "Pensamos la estructura completa según tu negocio, tu oferta, tu forma de vender y las funciones que necesitás.",
        bullets: ["Mayor diferenciación", "Arquitectura propia", "Funciones específicas"],
        cta: "Consultar desarrollo a medida",
        href: "/aplicar?servicio=landing-pages",
      },
    ],
    catalog: {
      eyebrow: "Catálogo de referencias",
      title: "Ya tenemos bases navegables para distintos rubros.",
      text: "En 219Shops podés explorar diseños reales para servicios profesionales, arquitectura, belleza, gastronomía, coaching, energía, turismo, salud, inmobiliaria y eventos. El cliente no tiene que imaginar la página: puede verla funcionando.",
      href: "https://www.219shops.com.ar/disenos",
      cta: "Explorar catálogo de diseños",
      items: ["16 experiencias navegables", "Vistas escritorio y celular", "Adaptables a cualquier rubro"],
    },
  },
  productos: {
    type: "productos",
    eyebrow: "Plataformas propias",
    title: "Creamos productos digitales.",
    accent: "No solo servicios para clientes.",
    intro:
      "219Shops y 219Meds muestran cómo 219Labs convierte problemas concretos en plataformas digitales completas: comercio online, salud, gestión operativa y experiencia de usuario.",
    cta: "Hablar sobre plataformas",
    sections: [
      {
        title: "219Shops",
        text: "Tienda online, productos, stock, pedidos, cobros, envíos y clientes conectados para administrar mejor un negocio.",
      },
      {
        title: "219Meds",
        text: "Plataforma para gestión médica y farmacéutica: turnos, pacientes, historias clínicas, stock, ventas, reportes y comunicación segura.",
      },
      {
        title: "Desarrollo de producto",
        text: "Diseñamos interfaces, flujos, paneles, lógica operativa y recorridos comerciales para convertir una necesidad repetida en una herramienta usable.",
      },
    ],
    notice: {
      eyebrow: "Productos en acción",
      title: "Mostramos plataformas con uso concreto, no ideas sueltas.",
      text: "219Shops ordena comercio online. 219Meds apunta a consultorios, profesionales y equipos de salud que necesitan centralizar agenda, pacientes, historia clínica, stock, ventas y reportes.",
    },
    detail: {
      eyebrow: "Productos",
      title: "Cada plataforma nace de un problema concreto.",
      text: "Nos interesa construir tecnología que el dueño de un negocio pueda usar sin sentirse perdido. Por eso nuestros productos priorizan claridad, operación y control.",
      items: [
        {
          title: "219Shops",
          text: "Tienda online para reunir productos, pedidos, cobros, stock, envíos y clientes en una misma plataforma.",
          href: "https://www.219shops.com.ar/",
          cta: "Visitar 219Shops",
        },
        {
          title: "Diseños 219Shops",
          text: "Catálogo de bases navegables para que una marca pueda elegir una referencia y adaptarla sin empezar de cero.",
          href: "https://www.219shops.com.ar/disenos",
          cta: "Ver diseños",
        },
        {
          title: "219Meds",
          text: "Plataforma de gestión médica y farmacéutica para administrar turnos, pacientes, historias clínicas, stock, ventas, reportes y comunicación desde un mismo sistema.",
          href: "https://219meds.vercel.app/",
          cta: "Ver 219Meds",
        },
        {
          title: "Próximas plataformas",
          text: "La estructura queda preparada para sumar nuevos productos sin que 219Labs pierda claridad comercial.",
        },
      ],
    },
    showcase: {
      eyebrow: "Prueba visible",
      title: "El producto también sirve como evidencia de cómo pensamos diseño, operación y tecnología.",
      text: "219Shops y 219Meds permiten mostrar plataformas reales: una orientada a comercio online y otra a gestión médica, pacientes, agenda, stock y operación de consultorio.",
      items: [
        ["01", "Producto activo", "219Shops funciona como plataforma propia para vender y administrar un negocio online."],
        ["02", "Diseños navegables", "El catálogo permite ver referencias reales antes de decidir una dirección visual."],
        ["03", "Salud digital", "219Meds centraliza turnos, pacientes, historias clínicas, stock, ventas y reportes para equipos de salud."],
        ["04", "Base de aprendizaje", "Cada producto propio alimenta mejores decisiones para desarrollos a medida."],
      ],
    },
    deliverables: {
      eyebrow: "Qué demuestra",
      title: "Producto propio significa experiencia real construyendo algo que tiene que sostenerse.",
      text: "No es solo una pieza visual. Una plataforma exige decisiones de interfaz, administración, soporte y evolución.",
      items: [
        "Capacidad para transformar una necesidad repetida en una solución reusable.",
        "Criterio para separar producto existente de desarrollo personalizado.",
        "Experiencia en diseño de pantallas, flujos y operaciones completas.",
        "Comunicación clara sobre alcance, módulos y casos donde conviene producto o desarrollo a medida.",
      ],
    },
    workflow: {
      eyebrow: "Cómo nacen",
      title: "No hacemos productos para sonar tecnológicos. Los hacemos para resolver operaciones reales.",
      steps: [
        ["01", "Problema repetido", "Detectamos una necesidad que aparece en varios negocios o rubros."],
        ["02", "Producto usable", "Diseñamos una primera versión que resuelva lo esencial sin volver complejo lo simple."],
        ["03", "Uso real", "Probamos con negocios concretos, escuchamos fricción y mejoramos la experiencia."],
        ["04", "Evolución", "Sumamos funciones cuando aportan valor, no solo porque quedan bien en una lista."],
      ],
    },
    faq: [
      ["¿219Shops es parte de 219Labs?", "Sí. Es una plataforma propia desarrollada por el equipo para ayudar a negocios a vender y administrarse mejor."],
      ["¿Las plataformas reemplazan los servicios a medida?", "No. Algunas empresas pueden usar un producto existente. Otras necesitan desarrollo personalizado."],
      ["¿219Meds ya se puede consultar?", "Sí. La plataforma ya tiene una propuesta clara para consultorios y equipos de salud. Según el caso, revisamos alcance, demo, implementación y módulos necesarios."],
      ["¿Puedo pedir una plataforma parecida para mi rubro?", "Sí. Si tenés una necesidad específica, podemos evaluar si conviene adaptar algo existente o crear una solución propia."],
      ["¿Por qué mostrar productos en la web de 219Labs?", "Porque demuestra capacidad real: diseño, software, operación, soporte, contenido y visión comercial trabajando juntos."],
    ],
    proofTitle: "Una agencia que también construye producto entiende distinto.",
    proofText:
      "Porque no solo diseñamos pantallas. Pensamos experiencia, operación, soporte, escalabilidad y ventas.",
  },
};

export default function ServicePage({ type }) {
  const navigate = useNavigate();
  const page = PAGE_DATA[type] || PAGE_DATA.desarrollo;

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent("service_view", {
      service: page.type,
      path: window.location.pathname,
    });
  }, [type]);

  const goApply = () => {
    trackEvent("cta_click", {
      service: page.type,
      destination: "/aplicar",
    });
    navigate(`/aplicar?servicio=${page.type}`);
  };

  const trackOutbound = (label, href) => {
    trackEvent("product_outbound_click", {
      service: page.type,
      label,
      href,
    });
  };

  return (
    <main className={`sp-page sp-page--${page.type}`}>
      <section className="sp-hero">
        <div className="sp-orb" aria-hidden="true" />
        <div className="sp-hero__content">
          <span className="sp-eyebrow">{page.eyebrow}</span>
          <h1>
            {page.title} <em>{page.accent}</em>
          </h1>
          <p>{page.intro}</p>
          <button type="button" className="sp-cta" onClick={goApply}>
            <span>{page.cta}</span>
            <Arrow />
          </button>
        </div>
      </section>

      <section className="sp-grid" aria-label="Servicios">
        {page.sections.map((section, index) => {
          const content = (
            <>
            <span>0{index + 1}</span>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
              {section.href && (
                <span className="sp-card__cta">
                  {section.cta || "Ver servicio"}
                  <Arrow />
                </span>
              )}
            </>
          );

          return section.href ? (
            <Link className="sp-card sp-card--link" to={section.href} key={section.title}>
              {content}
            </Link>
          ) : (
            <article className="sp-card" key={section.title}>
              {content}
            </article>
          );
        })}
      </section>
      <ServiceCTA
        eyebrow="Convertir intención"
        title="Si algo de esto te suena, podemos bajarlo a un plan."
        text="Contanos qué necesitás resolver y te respondemos con el camino más simple para avanzar."
        label={page.cta}
        onClick={goApply}
      />

      {page.modalities && (
        <section className="sp-modes" aria-label={page.modalities.eyebrow}>
          <div className="sp-modes__header">
            <span className="sp-eyebrow">{page.modalities.eyebrow}</span>
            <h2>{page.modalities.title}</h2>
            <p>{page.modalities.text}</p>
          </div>
          <div className="sp-modes__grid">
            {page.modalities.items.map((item) => (
              <article className="sp-modes__card" key={item.title}>
                <p className="sp-compare__label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link to={item.href} className="sp-link">
                  <span>{item.cta}</span>
                  <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.detail && (
        <section className="sp-detail" aria-label={page.detail.eyebrow}>
          <div className="sp-detail__intro">
            <span className="sp-eyebrow">{page.detail.eyebrow}</span>
            <h2>{page.detail.title}</h2>
            <p>{page.detail.text}</p>
          </div>
          <div className="sp-detail__list">
            {page.detail.items.map((item, index) => (
              <article className="sp-detail__item" key={item.title}>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.href && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-link"
                    onClick={() => trackOutbound(item.title, item.href)}
                  >
                    <span>{item.cta || "Conocer más"}</span>
                    <Arrow />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {page.notice && (
        <section className="sp-note" aria-label={page.notice.eyebrow}>
          <span className="sp-eyebrow">{page.notice.eyebrow}</span>
          <h2>{page.notice.title}</h2>
          <p>{page.notice.text}</p>
        </section>
      )}

      {page.showcase && (
        <section className="sp-showcase" aria-label={page.showcase.eyebrow}>
          <div className="sp-showcase__intro">
            <span className="sp-eyebrow">{page.showcase.eyebrow}</span>
            <h2>{page.showcase.title}</h2>
            <p>{page.showcase.text}</p>
          </div>
          <div className="sp-showcase__grid">
            {page.showcase.items.map(([num, title, text]) => (
              <article key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.deliverables && (
        <section className="sp-deliverables" aria-label={page.deliverables.eyebrow}>
          <div className="sp-deliverables__header">
            <span className="sp-eyebrow">{page.deliverables.eyebrow}</span>
            <h2>{page.deliverables.title}</h2>
            <p>{page.deliverables.text}</p>
          </div>
          <ul className="sp-deliverables__list">
            {page.deliverables.items.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {page.onboarding && (
        <section className="sp-onboarding" aria-label={page.onboarding.eyebrow}>
          <div className="sp-onboarding__intro">
            <span className="sp-eyebrow">{page.onboarding.eyebrow}</span>
            <h2>{page.onboarding.title}</h2>
            <p>{page.onboarding.text}</p>
          </div>
          <div className="sp-onboarding__steps">
            {page.onboarding.items.map(([num, title, text]) => (
              <article key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {page.comparison && (
        <section className="sp-compare" aria-label={page.comparisonEyebrow || "Opciones del servicio"}>
          <div className="sp-compare__header">
            <span className="sp-eyebrow">{page.comparisonEyebrow || "Dos caminos"}</span>
            <h2>{page.comparisonTitle || "Plantilla cuando conviene. A medida cuando hace falta."}</h2>
          </div>
          <div className="sp-compare__grid">
            {page.comparison.map((item) => (
              <article className="sp-compare__card" key={item.title}>
                <p className="sp-compare__label">{item.label}</p>
                <h3>{item.title}</h3>
                <strong>{item.price}</strong>
                <p>{item.text}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-link"
                    onClick={() => trackOutbound(item.title, item.href)}
                  >
                    <span>{item.cta}</span>
                    <Arrow />
                  </a>
                ) : (
                  <Link to={item.href} className="sp-link">
                    <span>{item.cta}</span>
                    <Arrow />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {page.comparison && (
        <ServiceCTA
          eyebrow="Decidir camino"
          title="¿Plantilla, producto o a medida? Te ayudamos a elegir sin vueltas."
          text="La decisión correcta no siempre es la más grande. Es la que más rápido resuelve el problema real."
          label="Elegir con ayuda"
          onClick={goApply}
        />
      )}

      {page.catalog && (
        <section className="sp-catalog" aria-label="Catálogo de diseños de landing pages">
          <div>
            <span className="sp-eyebrow">{page.catalog.eyebrow}</span>
            <h2>{page.catalog.title}</h2>
            <p>{page.catalog.text}</p>
            <a
              href={page.catalog.href}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-cta sp-cta--dark"
              onClick={() => trackOutbound(page.catalog.title, page.catalog.href)}
            >
              <span>{page.catalog.cta}</span>
              <Arrow />
            </a>
          </div>
          <ul>
            {page.catalog.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}
      {page.catalog && (
        <ServiceCTA
          eyebrow="Después de mirar"
          title="Si viste una referencia que te sirve, la adaptamos a tu negocio."
          text="Pasamos de inspiración a una página concreta, con textos, estructura, marca y objetivo comercial."
          label="Adaptar un diseño"
          onClick={goApply}
        />
      )}

      {page.workflow && (
        <section className="sp-workflow" aria-label={page.workflow.eyebrow}>
          <div className="sp-workflow__header">
            <span className="sp-eyebrow">{page.workflow.eyebrow}</span>
            <h2>{page.workflow.title}</h2>
          </div>
          <ol className="sp-workflow__steps">
            {page.workflow.steps.map(([num, title, text]) => (
              <li key={num}>
                <span>{num}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="sp-proof">
        <div>
          <span className="sp-eyebrow">Por qué importa</span>
          <h2>{page.proofTitle}</h2>
        </div>
        <p>{page.proofText}</p>
      </section>

      {page.faq && (
        <section className="sp-page-faq" aria-label="Preguntas frecuentes">
          <div className="sp-page-faq__header">
            <span className="sp-eyebrow">Preguntas frecuentes</span>
            <h2>Dudas normales antes de avanzar.</h2>
          </div>
          <div className="sp-page-faq__list">
            {page.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <button type="button" className="sp-cta" onClick={goApply}>
            <span>{page.cta}</span>
            <Arrow />
          </button>
        </section>
      )}

      <Footer onWhatsAppClick={goApply} />
      <FloatingWhatsApp onWhatsAppClick={goApply} />
    </main>
  );
}

function ServiceCTA({ eyebrow, title, text, label, onClick }) {
  return (
    <section className="sp-conversion" aria-label={eyebrow}>
      <div>
        <span className="sp-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <p>{text}</p>
      <button type="button" className="sp-cta" onClick={onClick}>
        <span>{label}</span>
        <Arrow />
      </button>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

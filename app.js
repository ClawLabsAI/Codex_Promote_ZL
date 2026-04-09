const STORAGE_KEY = "zerolimitai-growth-dashboard";
const EXTERNAL_DATA_URL = "./data/dashboard.json";

const defaultState = {
  summary: {
    northStar:
      "Aumentar trial starts cualificados y mejorar el paso de trial a pago en ZeroLimitAI.",
    positioning:
      "La alternativa lifetime a ChatGPT, Claude y Perplexity para usuarios intensivos que quieren mejores modelos, memoria y automatización sin pagar otra suscripción mensual."
  },
  positioningPoints: [
    "Usar una narrativa principal en la home y dejar ZeroLabs, ZeroClaw y API como capas secundarias.",
    "Hablar más de casos de uso concretos y menos de lista de capacidades.",
    "Priorizar el ángulo 'pay once, use forever' solo si se apoya con confianza y prueba social.",
    "Crear landings separadas para developers, creators, AI power users y comparativas contra competidores."
  ],
  kpis: [
    { id: "sessions", label: "Sesiones semanales", value: "0", target: "5000", note: "Todo el tráfico" },
    { id: "trial_starts", label: "Trial starts", value: "0", target: "250", note: "KPI principal" },
    { id: "activation", label: "Activation rate", value: "0%", target: "35%", note: "D1 activado" },
    { id: "trial_to_paid", label: "Trial to paid", value: "0%", target: "10%", note: "Conversión" }
  ],
  weeklyFocus: {
    sprint: "Semana 1",
    objective: "Instrumentar el embudo y lanzar los primeros activos de adquisición.",
    wins: "",
    blockers: ""
  },
  weeklyRoute: [],
  sprintTemplates: [],
  launchPriorities: [],
  assetPipeline: [],
  firstUsersPipeline: [],
  learningLoop: [],
  setupAssumptions: [],
  firstRunChecklist: [],
  audiences: [],
  offers: [],
  contentPillars: [],
  distribution: [],
  socialSystem: [],
  weeklyAssets: [],
  publishingWorkflow: [],
  xPostingWorkflow: [],
  publishingAutomation: [],
  xAutomationConfig: {
    mode: "Semi-auto",
    frequency: "1/day",
    windowStart: "10:00",
    windowEnd: "18:00",
    days: "Mon-Fri",
    scheduler: "Buffer / Metricool",
    approval: "Manual",
    mix: "Comparativas 50% · Founder 30% · Producto 20%",
    defaultCta: "Mira la comparativa"
  },
  channelAutomationPlan: [],
  linkedinSetup: [],
  campaignTracker: [],
  paidAcquisition: [],
  budgetPlanner: [],
  budgetRules: [],
  editorialSprint: [],
  monthPlan: [],
  directorySprint: [],
  outreachQueue: [],
  outreachCRM: [],
  outreachTemplates: [],
  xCopyBank: [],
  linkedinCopyBank: [],
  videoScriptBank: [],
  shortsAutomationSystem: [],
  shortsWorkflow: [],
  shortsToolStack: [],
  shortsReviewRules: [],
  landingAudit: [],
  messageTesting: [],
  objectionTracker: [],
  conversionChangeLog: [],
  homepageFocusMap: [],
  landingMessaging: [],
  ctaBank: [],
  experiments: [],
  sourceMap: [],
  tasks: [],
  channels: [],
  contentCalendar: [],
  automations: [],
  roadmap: [],
  productHunt: [],
  appsumo: [],
  directoryLaunch: [],
  launchAssets: [],
  launchRules: [],
  nextActions: [],
  notes: ""
};

let state = structuredClone(defaultState);
let sourceLabel = "defaultState";
let activeView = "today";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function deepMerge(base, patch) {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base !== "object" || base === null) return patch ?? base;

  const result = { ...base };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (key in base) result[key] = deepMerge(base[key], value);
    else result[key] = value;
  });
  return result;
}

function parseValue(value) {
  const cleaned = String(value).replace(/[^\d.]/g, "");
  return cleaned ? Number(cleaned) : 0;
}

function saveState() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  sourceLabel = "localStorage";
  renderSourceStatus();
}

function renderSourceStatus() {
  $("#source-status").textContent = sourceLabel;
}

function setAutomationFeedback(message) {
  const node = $("#automation-feedback");
  if (node) node.textContent = `Estado: ${message}`;
}

async function copyToClipboard(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    setAutomationFeedback(successMessage);
    window.alert(successMessage);
    return true;
  } catch {
    try {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      document.body.removeChild(helper);
      setAutomationFeedback(successMessage);
      window.alert(successMessage);
      return true;
    } catch {
      setAutomationFeedback("No pude copiar automáticamente.");
      window.alert("No pude copiar automáticamente.");
      return false;
    }
  }
}

function getScreensForElement(element) {
  return (element.dataset.screen || "")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function setLibraryMode(view) {
  const strategyLibrary = $("#strategy-library");
  if (!strategyLibrary) return;

  const details = Array.from(strategyLibrary.querySelectorAll(".library-section"));
  const operationsDetail = $("#operations-data");

  if (view === "ops") {
    details.forEach((item) => {
      item.open = item === operationsDetail;
    });
    operationsDetail?.scrollIntoView({ block: "start" });
    return;
  }

  if (view === "library") {
    details.forEach((item, index) => {
      item.open = index === 0;
    });
  }
}

function setActiveView(view, { scroll = true } = {}) {
  activeView = view;

  $$("[data-screen]").forEach((section) => {
    const screens = getScreensForElement(section);
    section.classList.toggle("screen-hidden", !screens.includes(view));
  });

  $$(".nav a[data-view]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.view === view);
  });

  setLibraryMode(view);

  if (scroll) {
    $(".main-content")?.scrollTo?.({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function resolveViewFromHash(hash) {
  if (!hash) return null;
  const element = document.querySelector(hash);
  if (!element) return null;

  const navMatch = document.querySelector(`.nav a[href="${hash}"]`);
  if (navMatch?.dataset.view) return navMatch.dataset.view;

  const screenOwner = element.closest("[data-screen]");
  if (screenOwner) {
    const screens = getScreensForElement(screenOwner);
    if (element.id === "operations-data" || screens.includes("ops")) return "ops";
    return screens[0] || null;
  }

  if (element.closest("#strategy-library")) {
    return element.closest("#operations-data") || element.id === "operations-data" ? "ops" : "library";
  }

  return null;
}

function renderSummary() {
  $("#north-star").textContent = state.summary.northStar;
  const positioning = $("#positioning");
  if (positioning) positioning.textContent = state.summary.positioning;
  $("#focus-sprint").textContent = state.weeklyFocus.sprint;
  $("#focus-objective").textContent = state.weeklyFocus.objective;
  $("#sprint").value = state.weeklyFocus.sprint;
  $("#objective").value = state.weeklyFocus.objective;
  $("#wins").value = state.weeklyFocus.wins;
  $("#blockers").value = state.weeklyFocus.blockers;

  const points = $("#positioning-points");
  if (points) {
    points.innerHTML = "";
    state.positioningPoints.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      points.appendChild(li);
    });
  }
}

function renderKpis() {
  const primaryContainer = $("#metrics");
  const secondaryContainer = $("#secondary-metrics");
  primaryContainer.innerHTML = "";
  if (secondaryContainer) secondaryContainer.innerHTML = "";

  state.kpis.forEach((kpi, index) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `
      <p class="metric-label">${kpi.label}</p>
      <input class="metric-input" data-kpi-id="${kpi.id}" data-field="value" value="${kpi.value}" />
      <div class="metric-row">
        <span class="metric-note">${kpi.note}</span>
        <label class="metric-target">
          Objetivo
          <input data-kpi-id="${kpi.id}" data-field="target" value="${kpi.target}" />
        </label>
      </div>
    `;
    if (index < 4) primaryContainer.appendChild(card);
    else if (secondaryContainer) secondaryContainer.appendChild(card);
  });
}

function buildWeeklyScorecard() {
  const drafts = state.publishingWorkflow.filter((item) => item.stage === "Draft").length;
  const scheduled = state.publishingWorkflow.filter((item) => item.stage === "Scheduled").length;
  const published = state.publishingWorkflow.filter((item) => item.stage === "Published").length;
  const liveCampaigns = state.campaignTracker.filter((item) => item.stage === "Live").length;
  const optimizingCampaigns = state.campaignTracker.filter((item) => item.stage === "Optimizing").length;
  const liveAds = state.paidAcquisition.filter((item) => item.stage === "Live").length;
  const waitingReplies = state.outreachCRM.filter((item) =>
    ["Contacted", "Waiting reply", "Follow-up"].includes(item.stage)
  ).length;

  const recommendedMoves = [
    drafts ? `Convertir ${drafts} borradores en piezas programadas.` : "Crear al menos 2 borradores nuevos esta semana.",
    liveCampaigns
      ? `Optimizar ${liveCampaigns} campañas live con mejor CTA o landing.`
      : "Activar al menos 1 campaña live con landing y CTA claros.",
    waitingReplies
      ? `Hacer follow-up a ${waitingReplies} contactos del outreach CRM.`
      : "Añadir 3 contactos nuevos al outreach CRM y enviar los primeros mensajes."
  ];

  return [
    {
      title: "Publishing",
      value: `${published} published`,
      note: `${drafts} draft · ${scheduled} scheduled`
    },
    {
      title: "Campaigns",
      value: `${liveCampaigns} live`,
      note: `${optimizingCampaigns} optimizing · ${liveAds} ads live`
    },
    {
      title: "Outreach",
      value: `${waitingReplies} pendientes`,
      note: "Contactos esperando respuesta o follow-up"
    },
    {
      title: "Recommended Moves",
      value: state.weeklyFocus.sprint,
      note: recommendedMoves.join(" ")
    }
  ];
}

function renderWeeklyScorecard() {
  const container = $("#weekly-scorecard");
  if (!container) return;
  container.innerHTML = "";

  buildWeeklyScorecard().forEach((item) => {
    const card = document.createElement("article");
    card.className = "metric-card scorecard-card";
    card.innerHTML = `
      <p class="metric-label">${item.title}</p>
      <p class="scorecard-value">${item.value}</p>
      <p class="scorecard-note">${item.note}</p>
    `;
    container.appendChild(card);
  });
}

function normalizeDate(value) {
  if (!value || value === "Sin fecha") return Number.MAX_SAFE_INTEGER;
  const time = Date.parse(value);
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function priorityWeight(priority) {
  return { High: 0, Medium: 1, Low: 2 }[priority] ?? 1;
}

function stageWeight(stage) {
  return { Draft: 0, Idea: 1, Scheduled: 2, Published: 3 }[stage] ?? 4;
}

function buildXAutomationQueue() {
  return [...state.publishingWorkflow]
    .filter((item) => item.channel === "X")
    .sort((a, b) => {
      const stageDiff = stageWeight(a.stage) - stageWeight(b.stage);
      if (stageDiff !== 0) return stageDiff;
      return a.title.localeCompare(b.title, "es");
    })
    .map((item, index) => {
      const config = state.xAutomationConfig || defaultState.xAutomationConfig;
      const slot = buildSuggestedSlot(index, config);
      return {
        ...item,
        slotLabel: slot.label,
        slotMeta: slot.meta
      };
    });
}

function buildSuggestedSlot(index, config) {
  const frequency = config.frequency || "1/day";
  const start = config.windowStart || "10:00";
  const end = config.windowEnd || "18:00";
  const days = config.days || "Mon-Fri";
  const dayNames = days === "Mon-Fri" ? ["Lun", "Mar", "Mie", "Jue", "Vie"] : days.split(/[,\s]+/).filter(Boolean);

  if (frequency === "2/day") {
    const slots = [start, end];
    return {
      label: `${dayNames[Math.floor(index / 2) % dayNames.length]} · ${slots[index % 2] || start}`,
      meta: "2 publicaciones por dia"
    };
  }

  if (frequency === "3/week") {
    const days3 = dayNames.slice(0, 3);
    return {
      label: `${days3[index % days3.length] || "Lun"} · ${start}`,
      meta: "Cadencia ligera"
    };
  }

  if (frequency === "5/week") {
    return {
      label: `${dayNames[index % dayNames.length] || "Lun"} · ${start}`,
      meta: "Cadencia diaria laborable"
    };
  }

  return {
    label: `${dayNames[index % dayNames.length] || "Lun"} · ${start}`,
    meta: "1 publicacion por dia"
  };
}

function buildXAutomationStatusCards() {
  const config = state.xAutomationConfig || defaultState.xAutomationConfig;
  const queue = buildXAutomationQueue();
  const pending = queue.filter((item) => item.stage !== "Published");
  const scheduled = queue.filter((item) => item.stage === "Scheduled").length;

  return [
    {
      title: "Modo activo",
      body:
        config.mode === "Manual"
          ? "Tu revisas y publicas todo manualmente."
          : config.mode === "Semi-auto"
            ? "El sistema te prepara la cola y tu solo revisas antes de programar."
            : "La estructura queda lista para autopilot parcial cuando conectes un scheduler.",
      meta: [config.mode, `${pending.length} pendientes`],
      list: [
        `Frecuencia: ${config.frequency}`,
        `Ventana: ${config.windowStart} - ${config.windowEnd}`,
        `Revisión: ${config.approval}`
      ]
    },
    {
      title: "Siguiente recomendación",
      body:
        pending[0]
          ? `El siguiente post a mover es "${pending[0].title}".`
          : "No quedan posts pendientes en la cola de X.",
      meta: [scheduled ? `${scheduled} scheduled` : "Sin scheduled"],
      list: [
        `Scheduler: ${config.scheduler}`,
        `Mix: ${config.mix}`,
        `CTA base: ${config.defaultCta}`
      ]
    }
  ];
}

function buildXAutomationRunbook() {
  const config = state.xAutomationConfig || defaultState.xAutomationConfig;
  return [
    {
      title: "1. Genera o elige el borrador",
      body: "Empieza desde la tarea de X, el X Copy Bank o la cola actual.",
      meta: ["Input"],
      list: [
        "Abre Automatizaciones",
        "Copia el siguiente post",
        "Ajusta solo una frase si hace falta"
      ]
    },
    {
      title: "2. Programa sin pensar la hora",
      body: "Usa la franja ya definida para no decidir cada vez cuándo publicar.",
      meta: [config.frequency, `${config.windowStart} - ${config.windowEnd}`],
      list: [
        `Scheduler recomendado: ${config.scheduler}`,
        "Mantén la mezcla de contenidos",
        "Marca Scheduled en cuanto lo dejes cargado"
      ]
    },
    {
      title: "3. Cierra el bucle",
      body: "Después de publicar o programar, vuelve al dashboard y cambia el estado para que la cola se actualice sola.",
      meta: ["Loop"],
      list: [
        "Scheduled si ya está programado",
        "Published cuando salga",
        "Anota si el ángulo merece repetirse"
      ]
    }
  ];
}

function getNextPublishingItem(channelMatcher) {
  return [...state.publishingWorkflow]
    .filter((item) => channelMatcher(item))
    .sort((a, b) => {
      const stageDiff = stageWeight(a.stage) - stageWeight(b.stage);
      if (stageDiff !== 0) return stageDiff;
      return a.title.localeCompare(b.title, "es");
    })[0];
}

function getNextVideoScript() {
  return state.videoScriptBank[0] || null;
}

function buildChannelPostCards() {
  const nextX = getNextPublishingItem((item) => item.channel === "X");
  const nextLinkedIn = getNextPublishingItem((item) => item.channel === "LinkedIn");
  const nextShort = getNextPublishingItem((item) => /short/i.test(item.channel) || /video/i.test(item.format));

  return [
    nextX
      ? {
          title: "X",
          body: nextX.hook,
          meta: [nextX.stage, nextX.format],
          list: [`Post: ${nextX.title}`, "Usa el boton de copiar y luego abre X"]
        }
      : {
          title: "X",
          body: "No hay post de X listo ahora mismo.",
          meta: ["Sin cola"],
          list: ["Crea un nuevo post en Publishing Workflow"]
        },
    nextLinkedIn
      ? {
          title: "LinkedIn",
          body: nextLinkedIn.hook,
          meta: [nextLinkedIn.stage, nextLinkedIn.format],
          list: [`Post: ${nextLinkedIn.title}`, "Adapta el tono a founder insight o comparativa"]
        }
      : {
          title: "LinkedIn",
          body: "No hay post de LinkedIn listo ahora mismo.",
          meta: ["Sin cola"],
          list: ["Reutiliza el mejor post de X"]
        },
    nextShort
      ? {
          title: "Shorts / Reels",
          body: nextShort.hook,
          meta: [nextShort.stage, nextShort.format],
          list: [`Pieza: ${nextShort.title}`, "Graba una sola idea y recicla en 3 plataformas"]
        }
      : {
          title: "Shorts / Reels",
          body: "No hay demo corta lista ahora mismo.",
          meta: ["Sin cola"],
          list: ["Usa Short Video Scripts para grabar el siguiente demo"]
        }
  ];
}

function getTodayTaskCandidates() {
  return [...state.tasks]
    .filter((task) => task.status !== "Done")
    .sort((a, b) => {
      const statusWeight = { Doing: 0, Todo: 1 };
      const left = statusWeight[a.status] ?? 2;
      const right = statusWeight[b.status] ?? 2;
      if (left !== right) return left - right;
      const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return normalizeDate(a.due) - normalizeDate(b.due);
    })
    .slice(0, 3);
}

function getExecutionQueue() {
  const ordered = [];
  const seen = new Set();
  const route = getDerivedWeeklyRoute();

  route.forEach((step) => {
    const linkedTasks = (step.taskIds || [])
      .map((taskId) => state.tasks.find((task) => task.id === taskId))
      .filter((task) => task && task.status !== "Done")
      .sort((a, b) => {
        const statusWeight = { Doing: 0, Todo: 1 };
        const left = statusWeight[a.status] ?? 2;
        const right = statusWeight[b.status] ?? 2;
        if (left !== right) return left - right;
        return priorityWeight(a.priority) - priorityWeight(b.priority);
      });

    linkedTasks.forEach((task) => {
      if (!seen.has(task.id)) {
        ordered.push(task);
        seen.add(task.id);
      }
    });
  });

  state.tasks
    .filter((task) => task.status !== "Done" && !seen.has(task.id))
    .sort((a, b) => {
      const statusWeight = { Doing: 0, Todo: 1 };
      const left = statusWeight[a.status] ?? 2;
      const right = statusWeight[b.status] ?? 2;
      if (left !== right) return left - right;
      const priorityDiff = priorityWeight(a.priority) - priorityWeight(b.priority);
      if (priorityDiff !== 0) return priorityDiff;
      return normalizeDate(a.due) - normalizeDate(b.due);
    })
    .forEach((task) => ordered.push(task));

  return ordered.slice(0, 3);
}

function buildAutopilotRecommendations() {
  const drafts = state.publishingWorkflow.filter((item) => item.stage === "Draft").length;
  const contactQueue = state.outreachCRM.filter((item) => item.stage === "Pendiente").length;
  const hasPublishedShort = state.publishingWorkflow.some(
    (item) => item.stage === "Published" && /short|reel|video/i.test(`${item.channel} ${item.format}`)
  );

  return [
    {
      title: "Plantilla de shorts",
      body: hasPublishedShort
        ? "Ya tienes base para repetirla. Convierte el último short en plantilla reusable."
        : "Monta una plantilla única para grabar y publicar demos cortas sin empezar desde cero.",
      meta: "Alta prioridad",
      list: [
        "CapCut o Descript",
        "Hook + demo + CTA fijo",
        "Subtítulos grandes",
        "Export vertical"
      ]
    },
    {
      title: "Factory de borradores",
      body: drafts
        ? `Ahora mismo tienes ${drafts} borradores: automatiza hook -> draft -> scheduling.`
        : "Configura un flujo simple para pasar de idea a borrador sin bloquearte.",
      meta: "Contenido",
      list: [
        "Input: ángulo + landing",
        "Output: X, LinkedIn y short",
        "Revisión humana final"
      ]
    },
    {
      title: "Outreach semiautomático",
      body: contactQueue
        ? `Tienes ${contactQueue} contactos pendientes: prepara primeras líneas y follow-ups reutilizables.`
        : "Deja preparada una secuencia para outreach y follow-up cuando crezca el CRM.",
      meta: "Distribución",
      list: [
        "Template por tipo de contacto",
        "Primer follow-up",
        "Estado en CRM"
      ]
    }
  ];
}

function renderTodayLayer() {
  const todayTasks = getExecutionQueue();
  const autopilot = buildAutopilotRecommendations();
  const progress = buildProjectProgress();

  renderInfoCards("#today-tasks-grid", getTodayTaskCandidates(), {
    title: (item) => item.title,
    body: (item) => item.instruction || "Define una instrucción clara para esta tarea.",
    meta: (item) => [item.status, item.priority || "Medium", item.channel, item.due],
    list: (item) => [`Owner: ${item.owner}`]
  });

  renderInfoCards("#autopilot-grid", autopilot, {
    title: (item) => item.title,
    body: (item) => item.body,
    meta: (item) => [item.meta],
    list: (item) => item.list
  });

  const stepContainer = $("#today-only-step");
  if (stepContainer) {
    stepContainer.innerHTML = `
      <h4>${progress.currentStep.step} · ${progress.currentStep.title}</h4>
      <p>${progress.currentStep.summary}</p>
      <div class="info-meta">
        <span class="pill">${progress.currentStep.status || "Todo"}</span>
        ${progress.currentStep.progressNote ? `<span class="pill">${progress.currentStep.progressNote}</span>` : ""}
      </div>
    `;
  }

  const tasksContainer = $("#today-only-tasks");
  if (tasksContainer) {
    const labels = ["Haz ahora", "Haz después", "Más tarde"];
    tasksContainer.innerHTML = todayTasks
      .map(
        (task, index) => `
          <article class="today-only-task">
            <p class="eyebrow">${labels[index] || "En cola"}</p>
            <h4>${task.title}</h4>
            <p>${task.instruction || "Sin instrucción definida."}</p>
            <div class="info-meta">
              <span class="pill">${task.status}</span>
              <span class="pill">${task.priority || "Medium"}</span>
              <span class="pill">${task.channel}</span>
            </div>
            <a class="secondary inline-button task-link" href="${getTaskWorkflowLink(task).href}">${getTaskWorkflowLink(task).label}</a>
          </article>
        `
      )
      .join("");
  }

  const autopilotContainer = $("#today-only-autopilot");
  if (autopilotContainer) {
    const firstAutopilot = autopilot[0];
    autopilotContainer.innerHTML = firstAutopilot
      ? `
          <h4>${firstAutopilot.title}</h4>
          <p>${firstAutopilot.body}</p>
          <div class="info-meta"><span class="pill">${firstAutopilot.meta}</span></div>
          <ul>${firstAutopilot.list.map((item) => `<li>${item}</li>`).join("")}</ul>
        `
      : "<p>No hay recomendación automática todavía.</p>";
  }

  renderInfoCards("#x-workflow-grid", state.xPostingWorkflow, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.stage, item.output],
    list: (item) => item.items
  });

  renderInfoCards("#publishing-automation-grid", state.publishingAutomation, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.tool, item.stage],
    list: (item) => item.items
  });
}

function renderInfoCards(containerId, items, config) {
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "info-card";
    const bullets = (config.list(item) || []).map((entry) => `<li>${entry}</li>`).join("");
    const meta = (config.meta ? config.meta(item) : [])
      .filter(Boolean)
      .map((entry) => `<span class="pill">${entry}</span>`)
      .join("");

    card.innerHTML = `
      <h4>${config.title(item)}</h4>
      <p>${config.body(item)}</p>
      ${meta ? `<div class="info-meta">${meta}</div>` : ""}
      ${bullets ? `<ul>${bullets}</ul>` : ""}
    `;
    container.appendChild(card);
  });
}

function getTaskWorkflowLink(task) {
  const text = `${task.title} ${task.instruction || ""} ${task.channel || ""}`.toLowerCase();

  if (/\bx\b|thread|tweet|post en x|linkedin|instagram|tiktok|youtube/.test(text)) {
    return { href: "#automation-center", label: "Abrir automatizaciones" };
  }
  if (/short|reel|video|demo/.test(text)) {
    return { href: "#shorts-os", label: "Abrir workflow Shorts" };
  }
  if (/outreach|creator|newsletter|community|crm/.test(text)) {
    return { href: "#outreach-crm-grid", label: "Abrir outreach CRM" };
  }
  if (/landing|hero|home|pricing|faq/.test(text)) {
    return { href: "#landing-audit-grid", label: "Abrir landing workspace" };
  }
  if (/director|listing/.test(text)) {
    return { href: "#directory-launch-grid", label: "Abrir directorios" };
  }

  return { href: "#execution", label: "Abrir siguiente paso" };
}

function renderTaskBoard() {
  const statuses = ["Todo", "Doing", "Done"];
  const board = $("#task-board");
  board.innerHTML = "";

  statuses.forEach((status) => {
    const column = document.createElement("section");
    column.className = "task-column";
    const tasks = state.tasks.filter((task) => task.status === status);
    const cards = tasks
      .map(
        (task) => {
          const workflow = getTaskWorkflowLink(task);
          return `
          <article class="task-card">
            <div class="task-top">
              <h4>${task.title}</h4>
              <div class="task-selects">
                <select data-task-id="${task.id}" data-field="status">
                  ${statuses
                    .map(
                      (option) =>
                        `<option value="${option}" ${option === task.status ? "selected" : ""}>${option}</option>`
                    )
                    .join("")}
                </select>
                <select data-task-id="${task.id}" data-field="priority">
                  ${["High", "Medium", "Low"]
                    .map(
                      (option) =>
                        `<option value="${option}" ${option === (task.priority || "Medium") ? "selected" : ""}>${option}</option>`
                    )
                    .join("")}
                </select>
              </div>
            </div>
            ${task.instruction ? `<p class="task-instruction">${task.instruction}</p>` : ""}
            <div class="task-meta">
              <span class="pill priority-${String(task.priority || "Medium").toLowerCase()}">${task.priority || "Medium"}</span>
              <span class="pill">${task.channel}</span>
              <span class="pill">${task.owner}</span>
            </div>
            <p class="task-due">Entrega: ${task.due}</p>
            <a class="secondary inline-button task-link" href="${workflow.href}">${workflow.label}</a>
          </article>
        `;
        }
      )
      .join("");

    column.innerHTML = `
      <div class="task-header">
        <h3>${status}</h3>
        <span class="task-count">${tasks.length}</span>
      </div>
      <div class="task-stack">${cards || '<p class="empty">Sin tareas</p>'}</div>
    `;
    board.appendChild(column);
  });
}

function getDerivedWeeklyRoute() {
  return state.weeklyRoute.map((step) => {
    const linkedTasks = (step.taskIds || [])
      .map((taskId) => state.tasks.find((task) => task.id === taskId))
      .filter(Boolean);

    let status = step.status || "Todo";

    if (linkedTasks.length) {
      const allDone = linkedTasks.every((task) => task.status === "Done");
      const anyDoing = linkedTasks.some((task) => task.status === "Doing");
      const anyDone = linkedTasks.some((task) => task.status === "Done");

      if (allDone) status = "Done";
      else if (anyDoing || anyDone) status = "Doing";
      else status = "Todo";
    }

    return {
      ...step,
      status,
      progressNote: linkedTasks.length
        ? `${linkedTasks.filter((task) => task.status === "Done").length}/${linkedTasks.length} tareas done`
        : null
    };
  });
}

function buildProjectProgress() {
  const total = state.tasks.length;
  const done = state.tasks.filter((task) => task.status === "Done").length;
  const doing = state.tasks.filter((task) => task.status === "Doing").length;
  const todo = state.tasks.filter((task) => task.status === "Todo").length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const derivedRoute = getDerivedWeeklyRoute();
  const currentStep =
    derivedRoute.find((step) => step.status !== "Done") ||
    derivedRoute[0] || {
      step: "Paso actual",
      title: "Empieza por la primera tarea prioritaria",
      summary: state.weeklyFocus.objective
    };

  return { total, done, doing, todo, progress, currentStep, derivedRoute };
}

function renderProjectManager() {
  const progress = buildProjectProgress();
  const container = $("#project-progress");
  if (container) {
    container.innerHTML = `
      <div class="progress-top">
        <div>
          <p class="eyebrow">Progreso actual</p>
          <h3>${progress.progress}% completado</h3>
        </div>
        <span class="pill">${progress.done}/${progress.total} tareas done</span>
      </div>
      <div class="progress-bar">
        <span style="width: ${progress.progress}%"></span>
      </div>
      <div class="progress-stats">
        <article class="metric-mini">
          <strong>${progress.todo}</strong>
          <span>Por hacer</span>
        </article>
        <article class="metric-mini">
          <strong>${progress.doing}</strong>
          <span>En curso</span>
        </article>
        <article class="metric-mini">
          <strong>${progress.done}</strong>
          <span>Hechas</span>
        </article>
      </div>
      <article class="current-step-card">
        <p class="eyebrow">Paso actual recomendado</p>
        <h4>${progress.currentStep.step} · ${progress.currentStep.title}</h4>
        <p>${progress.currentStep.summary}</p>
      </article>
    `;
  }

  renderInfoCards("#route-grid", progress.derivedRoute, {
    title: (item) => `${item.step} · ${item.title}`,
    body: (item) => item.summary,
    meta: (item) => [item.status, item.owner, item.progressNote],
    list: (item) => item.items
  });
}

function renderSprintTemplates() {
  const container = $("#sprint-template-grid");
  if (!container) return;
  container.innerHTML = "";

  state.sprintTemplates.forEach((template, index) => {
    const card = document.createElement("article");
    card.className = "info-card template-card";
    card.innerHTML = `
      <h4>${template.name}</h4>
      <p>${template.objective}</p>
      <div class="info-meta">
        <span class="pill">${template.theme}</span>
        <span class="pill">${template.tasks.length} tareas</span>
      </div>
      <ul>
        ${template.highlights.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <button class="secondary" type="button" data-sprint-template-index="${index}">
        Usar esta plantilla
      </button>
    `;
    container.appendChild(card);
  });
}

function applySprintTemplate(template) {
  state.weeklyFocus = {
    sprint: template.name,
    objective: template.objective,
    wins: "",
    blockers: ""
  };
  state.weeklyRoute = structuredClone(template.route);
  state.tasks = structuredClone(template.tasks).map((task) => ({
    priority: "Medium",
    ...task
  }));
  state.nextActions = [...template.nextActions];
}

function renderPublishBoard() {
  const statuses = ["Idea", "Draft", "Scheduled", "Published"];
  const board = $("#publish-board");
  if (!board) return;
  board.innerHTML = "";

  statuses.forEach((status) => {
    const column = document.createElement("section");
    column.className = "task-column";
    const items = state.publishingWorkflow.filter((item) => item.stage === status);
    const cards = items
      .map(
        (item) => `
          <article class="task-card publish-card">
            <div class="task-top">
              <h4>${item.title}</h4>
              <select data-publish-id="${item.id}" data-field="stage">
                ${statuses
                  .map(
                    (option) =>
                      `<option value="${option}" ${option === item.stage ? "selected" : ""}>${option}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <p>${item.channel} · ${item.format}</p>
            <p class="publish-hook">${item.hook}</p>
            <p class="task-due">Owner: ${item.owner}</p>
          </article>
        `
      )
      .join("");

    column.innerHTML = `
      <div class="task-header">
        <h3>${status}</h3>
        <span class="task-count">${items.length}</span>
      </div>
      <div class="task-stack">${cards || '<p class="empty">Sin piezas</p>'}</div>
    `;
    board.appendChild(column);
  });
}

function renderCampaignBoard() {
  const statuses = ["Planned", "Live", "Optimizing", "Completed"];
  const board = $("#campaign-board");
  if (!board) return;
  board.innerHTML = "";

  statuses.forEach((status) => {
    const column = document.createElement("section");
    column.className = "task-column";
    const items = state.campaignTracker.filter((item) => item.stage === status);
    const cards = items
      .map(
        (item) => `
          <article class="task-card campaign-card">
            <div class="task-top">
              <h4>${item.name}</h4>
              <select data-campaign-id="${item.id}" data-field="stage">
                ${statuses
                  .map(
                    (option) =>
                      `<option value="${option}" ${option === item.stage ? "selected" : ""}>${option}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <p>${item.channel} · ${item.landing}</p>
            <p class="publish-hook">CTA: ${item.cta}</p>
            <p class="task-due">Goal: ${item.target} · Owner: ${item.owner}</p>
          </article>
        `
      )
      .join("");

    column.innerHTML = `
      <div class="task-header">
        <h3>${status}</h3>
        <span class="task-count">${items.length}</span>
      </div>
      <div class="task-stack">${cards || '<p class="empty">Sin campañas</p>'}</div>
    `;
    board.appendChild(column);
  });
}

function renderPaidBoard() {
  const statuses = ["Planned", "Building", "Live", "Reviewing"];
  const board = $("#paid-board");
  if (!board) return;
  board.innerHTML = "";

  statuses.forEach((status) => {
    const column = document.createElement("section");
    column.className = "task-column";
    const items = state.paidAcquisition.filter((item) => item.stage === status);
    const cards = items
      .map(
        (item) => `
          <article class="task-card campaign-card">
            <div class="task-top">
              <h4>${item.name}</h4>
              <select data-paid-id="${item.id}" data-field="stage">
                ${statuses
                  .map(
                    (option) =>
                      `<option value="${option}" ${option === item.stage ? "selected" : ""}>${option}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <p>${item.platform} · ${item.audience}</p>
            <p class="publish-hook">Creative: ${item.creative}</p>
            <p class="task-due">Budget: ${item.budget}</p>
            <p class="task-due">Hypothesis: ${item.hypothesis}</p>
          </article>
        `
      )
      .join("");

    column.innerHTML = `
      <div class="task-header">
        <h3>${status}</h3>
        <span class="task-count">${items.length}</span>
      </div>
      <div class="task-stack">${cards || '<p class="empty">Sin tests paid</p>'}</div>
    `;
    board.appendChild(column);
  });
}

function renderChannels() {
  const grid = $("#channels-grid");
  grid.innerHTML = "";

  state.channels.forEach((channel, index) => {
    const card = document.createElement("article");
    card.className = "channel-card";
    card.innerHTML = `
      <div class="channel-header">
        <h4>${channel.name}</h4>
        <span class="pill">${channel.priority}</span>
      </div>
      <label class="field">
        Estado
        <input data-channel-index="${index}" data-field="stage" value="${channel.stage}" />
      </label>
      <label class="field">
        Objetivo
        <input data-channel-index="${index}" data-field="target" value="${channel.target}" />
      </label>
      <label class="field">
        Métrica
        <input data-channel-index="${index}" data-field="metric" value="${channel.metric}" />
      </label>
    `;
    grid.appendChild(card);
  });
}

function renderCalendar() {
  const grid = $("#calendar-grid");
  grid.innerHTML = "";

  state.contentCalendar.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "calendar-day";
    card.innerHTML = `
      <h4>${entry.day}</h4>
      <label class="field">
        Foco
        <input data-calendar-index="${index}" data-field="focus" value="${entry.focus}" />
      </label>
      <label class="field">
        Activo
        <input data-calendar-index="${index}" data-field="asset" value="${entry.asset}" />
      </label>
    `;
    grid.appendChild(card);
  });
}

function renderEditorialSprint() {
  renderInfoCards("#editorial-grid", state.editorialSprint, {
    title: (item) => `${item.day} · ${item.title}`,
    body: (item) => item.angle,
    meta: (item) => [item.week, item.channel, item.status],
    list: (item) => [
      `Format: ${item.format}`,
      `CTA: ${item.cta}`,
      `Landing: ${item.landing}`
    ]
  });
}

function renderBudgetPlanner() {
  renderInfoCards("#budget-grid", state.budgetPlanner, {
    title: (item) => item.channel,
    body: (item) => item.summary,
    meta: (item) => [item.budget, item.status],
    list: (item) => [`Goal: ${item.goal}`, `Primary use: ${item.use}`, `Cap: ${item.cap}`]
  });

  renderInfoCards("#budget-rules-grid", state.budgetRules, {
    title: (item) => item.name,
    body: (item) => item.rule,
    meta: (item) => [item.stage],
    list: (item) => [`Why: ${item.why}`, `Action: ${item.action}`]
  });
}

function renderAutomations() {
  const list = $("#automation-list");
  list.innerHTML = "";

  state.automations.forEach((automation, index) => {
    const card = document.createElement("article");
    card.className = "automation-card";
    card.innerHTML = `
      <h4>${automation.name}</h4>
      <label class="field">
        Herramienta
        <input data-automation-index="${index}" data-field="tool" value="${automation.tool}" />
      </label>
      <label class="field">
        Estado
        <input data-automation-index="${index}" data-field="status" value="${automation.status}" />
      </label>
      <label class="field">
        Descripción
        <textarea data-automation-index="${index}" data-field="description">${automation.description}</textarea>
      </label>
    `;
    list.appendChild(card);
  });
}

function renderAutomationCenter() {
  const config = state.xAutomationConfig || defaultState.xAutomationConfig;
  const queue = buildXAutomationQueue().filter((item) => item.stage !== "Published").slice(0, 3);

  const mapping = [
    ["#x-mode", config.mode],
    ["#x-frequency", config.frequency],
    ["#x-window-start", config.windowStart],
    ["#x-window-end", config.windowEnd],
    ["#x-days", config.days],
    ["#x-scheduler", config.scheduler],
    ["#x-approval", config.approval],
    ["#x-mix", config.mix],
    ["#x-default-cta", config.defaultCta]
  ];

  mapping.forEach(([selector, value]) => {
    const input = $(selector);
    if (input) input.value = value;
  });

  renderInfoCards("#x-queue-grid", queue, {
    title: (item) => item.title,
    body: (item) => item.hook,
    meta: (item) => [item.stage, item.slotLabel, item.slotMeta],
    list: (item) => [
      `Formato: ${item.format}`,
      `Owner: ${item.owner}`,
      `CTA: ${(state.xAutomationConfig || defaultState.xAutomationConfig).defaultCta}`
    ]
  });

  renderInfoCards("#x-automation-status", buildXAutomationStatusCards(), {
    title: (item) => item.title,
    body: (item) => item.body,
    meta: (item) => item.meta,
    list: (item) => item.list
  });

  renderInfoCards("#x-automation-runbook", buildXAutomationRunbook(), {
    title: (item) => item.title,
    body: (item) => item.body,
    meta: (item) => item.meta,
    list: (item) => item.list
  });
}

function renderRoadmap() {
  const container = $("#roadmap-columns");
  container.innerHTML = "";

  state.roadmap.forEach((phase) => {
    const card = document.createElement("article");
    card.className = "roadmap-card";
    card.innerHTML = `
      <h4>${phase.title}</h4>
      <p>${phase.focus}</p>
      <ul class="list">${phase.items.map((item) => `<li>${item}</li>`).join("")}</ul>
      <span class="tag">${phase.focus}</span>
    `;
    container.appendChild(card);
  });
}

function renderChecklists() {
  const next = $("#next-actions");
  next.innerHTML = "";

  state.nextActions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    next.appendChild(li);
  });
}

function buildWeeklyReport() {
  const focusKpis = state.kpis.slice(0, 4);

  const done = state.tasks.filter((task) => task.status === "Done").length;
  const doing = state.tasks.filter((task) => task.status === "Doing").length;
  const todo = state.tasks.filter((task) => task.status === "Todo").length;

  const gaps = focusKpis
    .map((item) => ({
      label: item.label,
      current: item.value,
      target: item.target,
      ratio: parseValue(item.target) ? parseValue(item.value) / parseValue(item.target) : 0
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const lowest = gaps[0];
  const strongest = [...gaps].sort((a, b) => b.ratio - a.ratio)[0];
  const topExperiment = state.experiments.find((item) => item.status === "Live") || state.experiments[0];

  return {
    summary: `${state.weeklyFocus.sprint}: ${state.weeklyFocus.objective}`,
    performance: `Mejor progreso: ${strongest.label} (${strongest.current} / ${strongest.target}). Mayor gap: ${lowest.label} (${lowest.current} / ${lowest.target}).`,
    execution: `Tareas: ${done} done, ${doing} doing, ${todo} pendientes.`,
    bets: topExperiment ? `Experimento prioritario: ${topExperiment.title}.` : "Sin experimento prioritario definido.",
    wins: state.weeklyFocus.wins || "Sin wins registrados todavía.",
    blockers: state.weeklyFocus.blockers || "Sin blockers registrados."
  };
}

function renderWeeklyReport() {
  const report = buildWeeklyReport();
  $("#weekly-report").innerHTML = `
    <p><strong>Foco:</strong> ${report.summary}</p>
    <p><strong>Performance:</strong> ${report.performance}</p>
    <p><strong>Ejecución:</strong> ${report.execution}</p>
    <p><strong>Bet principal:</strong> ${report.bets}</p>
    <p><strong>Wins:</strong> ${report.wins}</p>
    <p><strong>Blockers:</strong> ${report.blockers}</p>
  `;
}

function renderNotes() {
  $("#notes").value = state.notes;
}

function renderPlanSections() {
  renderInfoCards("#launch-priority-grid", state.launchPriorities, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.priority, item.owner],
    list: (item) => item.actions
  });

  renderInfoCards("#asset-pipeline-grid", state.assetPipeline, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.status],
    list: (item) => item.items
  });

  renderInfoCards("#first-users-grid", state.firstUsersPipeline, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.stage, item.owner],
    list: (item) => item.items
  });

  renderInfoCards("#learning-loop-grid", state.learningLoop, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.frequency],
    list: (item) => item.items
  });

  renderInfoCards("#setup-grid", state.setupAssumptions, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.status],
    list: (item) => item.items
  });

  renderInfoCards("#first-run-grid", state.firstRunChecklist, {
    title: (item) => item.title,
    body: (item) => item.description,
    meta: (item) => [item.owner, item.priority],
    list: (item) => item.steps
  });

  renderInfoCards("#audience-grid", state.audiences, {
    title: (item) => item.name,
    body: (item) => item.pain,
    meta: (item) => [item.priority, item.goal],
    list: (item) => [`Hook: ${item.hook}`, `Oferta: ${item.offer}`]
  });

  renderInfoCards("#offers-grid", state.offers, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.audience, item.price],
    list: (item) => item.bullets
  });

  renderInfoCards("#content-pillars", state.contentPillars, {
    title: (item) => item.name,
    body: (item) => item.description,
    meta: (item) => [item.channel, item.frequency],
    list: (item) => item.angles
  });

  renderInfoCards("#distribution-grid", state.distribution, {
    title: (item) => item.name,
    body: (item) => item.why,
    meta: (item) => [item.priority, item.owner],
    list: (item) => item.actions
  });

  renderInfoCards("#social-grid", state.socialSystem, {
    title: (item) => item.name,
    body: (item) => item.description,
    meta: (item) => [item.channel, item.goal],
    list: (item) => item.actions
  });

  renderInfoCards("#asset-grid", state.weeklyAssets, {
    title: (item) => item.name,
    body: (item) => item.description,
    meta: (item) => [item.frequency],
    list: (item) => item.examples
  });

  renderInfoCards("#x-workflow-grid", state.xPostingWorkflow, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.stage, item.output],
    list: (item) => item.items
  });

  renderInfoCards("#publishing-automation-grid", state.publishingAutomation, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.tool, item.stage],
    list: (item) => item.items
  });

  renderInfoCards("#month-plan-grid", state.monthPlan, {
    title: (item) => item.week,
    body: (item) => item.goal,
    meta: (item) => [item.theme],
    list: (item) => item.deliverables
  });

  renderInfoCards("#directory-grid", state.directorySprint, {
    title: (item) => item.name,
    body: (item) => item.why,
    meta: (item) => [item.priority, item.status],
    list: (item) => item.notes
  });

  renderInfoCards("#outreach-grid", state.outreachQueue, {
    title: (item) => item.name,
    body: (item) => item.angle,
    meta: (item) => [item.type, item.status],
    list: (item) => item.actions
  });

  renderInfoCards("#outreach-crm-grid", state.outreachCRM, {
    title: (item) => item.name,
    body: item => `${item.channel} · ${item.contact}`,
    meta: (item) => [item.stage, item.priority],
    list: (item) => [
      `Angle: ${item.angle}`,
      `Next step: ${item.nextStep}`,
      `Owner: ${item.owner}`
    ]
  });

  renderInfoCards("#outreach-templates-grid", state.outreachTemplates, {
    title: (item) => item.name,
    body: (item) => item.opener,
    meta: (item) => [item.channel, item.useCase],
    list: (item) => [
      `Subject: ${item.subject}`,
      `Main ask: ${item.mainAsk}`,
      `CTA: ${item.cta}`,
      `Personalize with: ${item.personalize}`
    ]
  });

  renderInfoCards("#x-copy-grid", state.xCopyBank, {
    title: (item) => item.title,
    body: (item) => item.copy,
    meta: (item) => [item.goal],
    list: (item) => item.notes
  });

  renderInfoCards("#linkedin-copy-grid", state.linkedinCopyBank, {
    title: (item) => item.title,
    body: (item) => item.copy,
    meta: (item) => [item.goal],
    list: (item) => item.notes
  });

  renderInfoCards("#video-script-grid", state.videoScriptBank, {
    title: (item) => item.title,
    body: (item) => item.hook,
    meta: (item) => [item.goal, item.duration],
    list: (item) => [
      `Scene 1: ${item.scene1}`,
      `Scene 2: ${item.scene2}`,
      `Scene 3: ${item.scene3}`,
      `CTA: ${item.cta}`
    ]
  });

  renderInfoCards("#shorts-system-grid", state.shortsAutomationSystem, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.owner, item.output],
    list: (item) => item.items
  });

  renderInfoCards("#shorts-workflow-grid", state.shortsWorkflow, {
    title: (item) => item.step,
    body: (item) => item.summary,
    meta: (item) => [item.timing, item.tool],
    list: (item) => item.items
  });

  renderInfoCards("#shorts-tools-grid", state.shortsToolStack, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.role, item.mode],
    list: (item) => item.items
  });

  renderInfoCards("#shorts-rules-grid", state.shortsReviewRules, {
    title: (item) => item.name,
    body: (item) => item.rule,
    meta: (item) => [item.priority],
    list: (item) => [`Check: ${item.check}`, `Action: ${item.action}`]
  });

  renderInfoCards("#landing-copy-grid", state.landingMessaging, {
    title: (item) => item.name,
    body: (item) => item.promise,
    meta: (item) => [item.audience],
    list: (item) => [
      `Hook: ${item.hook}`,
      `Proof: ${item.proof}`,
      `CTA focus: ${item.cta}`
    ]
  });

  renderInfoCards("#landing-audit-grid", state.landingAudit, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.priority, item.owner],
    list: (item) => item.items
  });

  renderInfoCards("#message-testing-grid", state.messageTesting, {
    title: (item) => item.name,
    body: (item) => item.hypothesis,
    meta: (item) => [item.stage, item.channel],
    list: (item) => [`Hook: ${item.hook}`, `CTA: ${item.cta}`, `Landing: ${item.landing}`]
  });

  renderInfoCards("#objection-grid", state.objectionTracker, {
    title: (item) => item.objection,
    body: (item) => item.risk,
    meta: (item) => [item.priority],
    list: (item) => [`Answer: ${item.answer}`, `Fix: ${item.fix}`]
  });

  renderInfoCards("#conversion-log-grid", state.conversionChangeLog, {
    title: (item) => item.change,
    body: (item) => item.reason,
    meta: (item) => [item.stage, item.expectedImpact],
    list: (item) => [`Owner: ${item.owner}`, `Track: ${item.track}`]
  });

  renderInfoCards("#homepage-focus-grid", state.homepageFocusMap, {
    title: (item) => item.area,
    body: (item) => item.rule,
    meta: (item) => [item.priority],
    list: (item) => item.items
  });

  renderInfoCards("#cta-bank-grid", state.ctaBank, {
    title: (item) => item.name,
    body: (item) => item.copy,
    meta: (item) => [item.context],
    list: (item) => item.notes
  });

  renderInfoCards("#experiments-grid", state.experiments, {
    title: (item) => item.title,
    body: (item) => item.hypothesis,
    meta: (item) => [item.channel, item.status],
    list: (item) => [`Success metric: ${item.metric}`, `Next step: ${item.next}`]
  });

  renderInfoCards("#sources-grid", state.sourceMap, {
    title: (item) => item.name,
    body: (item) => item.description,
    meta: (item) => [item.file, item.refresh],
    list: (item) => item.fields
  });

  renderInfoCards("#product-hunt-grid", state.productHunt, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.status, item.owner],
    list: (item) => item.items
  });

  renderInfoCards("#appsumo-grid", state.appsumo, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.status, item.owner],
    list: (item) => item.items
  });

  renderInfoCards("#directory-launch-grid", state.directoryLaunch, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.status, item.owner],
    list: (item) => item.items
  });

  renderInfoCards("#launch-assets-grid", state.launchAssets, {
    title: (item) => item.name,
    body: (item) => item.summary,
    meta: (item) => [item.priority],
    list: (item) => item.items
  });

  renderInfoCards("#launch-rules-grid", state.launchRules, {
    title: (item) => item.name,
    body: (item) => item.rule,
    meta: (item) => [item.stage],
    list: (item) => [`Why: ${item.why}`, `Action: ${item.action}`]
  });
}

function renderAll() {
  renderSourceStatus();
  renderSummary();
  renderTodayLayer();
  renderWeeklyScorecard();
  renderKpis();
  renderSprintTemplates();
  renderPlanSections();
  renderTaskBoard();
  renderProjectManager();
  renderPublishBoard();
  renderCampaignBoard();
  renderPaidBoard();
  renderBudgetPlanner();
  renderEditorialSprint();
  renderChannels();
  renderCalendar();
  renderAutomations();
  renderAutomationCenter();
  renderRoadmap();
  renderChecklists();
  renderWeeklyReport();
  renderNotes();
}

function bindEditableInputs() {
  document.addEventListener("input", (event) => {
    const target = event.target;

    if (target.matches("[data-kpi-id]")) {
      const item = state.kpis.find((kpi) => kpi.id === target.dataset.kpiId);
      item[target.dataset.field] = target.value;
      saveState();
      renderWeeklyReport();
    }

    if (target.matches("[data-channel-index]")) {
      const item = state.channels[Number(target.dataset.channelIndex)];
      item[target.dataset.field] = target.value;
      saveState();
    }

    if (target.matches("[data-calendar-index]")) {
      const item = state.contentCalendar[Number(target.dataset.calendarIndex)];
      item[target.dataset.field] = target.value;
      saveState();
    }

    if (target.matches("[data-automation-index]")) {
      const item = state.automations[Number(target.dataset.automationIndex)];
      item[target.dataset.field] = target.value;
      saveState();
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;

    if (target.matches("[data-task-id]")) {
      const task = state.tasks.find((item) => item.id === target.dataset.taskId);
      task[target.dataset.field] = target.value;
      saveState();
      renderTodayLayer();
      renderTaskBoard();
      renderProjectManager();
      renderWeeklyReport();
    }

    if (target.matches("[data-publish-id]")) {
      const item = state.publishingWorkflow.find((entry) => entry.id === target.dataset.publishId);
      item[target.dataset.field] = target.value;
      saveState();
      renderPublishBoard();
      renderAutomationCenter();
    }

    if (target.matches("[data-campaign-id]")) {
      const item = state.campaignTracker.find((entry) => entry.id === target.dataset.campaignId);
      item[target.dataset.field] = target.value;
      saveState();
      renderCampaignBoard();
    }

    if (target.matches("[data-paid-id]")) {
      const item = state.paidAcquisition.find((entry) => entry.id === target.dataset.paidId);
      item[target.dataset.field] = target.value;
      saveState();
      renderPaidBoard();
    }
  });
}

function bindForms() {
  $("#weekly-focus-form").addEventListener("submit", (event) => {
    event.preventDefault();
    state.weeklyFocus.sprint = $("#sprint").value;
    state.weeklyFocus.objective = $("#objective").value;
    state.weeklyFocus.wins = $("#wins").value;
    state.weeklyFocus.blockers = $("#blockers").value;
    saveState();
    renderSummary();
    renderWeeklyReport();
    window.alert("Foco semanal actualizado.");
  });

  $("#task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = $("#task-title").value.trim();
    if (!title) return;

    state.tasks.push({
      id: `task-${Date.now()}`,
      title,
      instruction: $("#task-instruction").value.trim(),
      owner: $("#task-owner").value.trim() || "Founder",
      due: $("#task-due").value || "Sin fecha",
      channel: $("#task-channel").value.trim() || "General",
      status: $("#task-status").value,
      priority: $("#task-priority").value
    });

    saveState();
    renderTodayLayer();
    renderTaskBoard();
    renderProjectManager();
    renderWeeklyReport();
    event.target.reset();
  });

  $("#publish-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const title = $("#publish-title").value.trim();
    if (!title) return;

    state.publishingWorkflow.push({
      id: `publish-${Date.now()}`,
      title,
      channel: $("#publish-channel").value.trim() || "X",
      format: $("#publish-format").value.trim() || "Post",
      hook: $("#publish-hook").value.trim() || "Definir hook principal",
      stage: $("#publish-stage").value,
      owner: $("#publish-owner").value.trim() || "Founder"
    });

    saveState();
    renderPublishBoard();
    renderAutomationCenter();
    event.target.reset();
  });

  $("#campaign-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#campaign-name").value.trim();
    if (!name) return;

    state.campaignTracker.push({
      id: `campaign-${Date.now()}`,
      name,
      landing: $("#campaign-landing").value.trim() || "/",
      channel: $("#campaign-channel").value.trim() || "General",
      cta: $("#campaign-cta").value.trim() || "Start free trial",
      target: $("#campaign-target").value.trim() || "Definir objetivo",
      stage: $("#campaign-stage").value,
      owner: $("#campaign-owner").value.trim() || "Founder"
    });

    saveState();
    renderCampaignBoard();
    event.target.reset();
  });

  $("#paid-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#paid-name").value.trim();
    if (!name) return;

    state.paidAcquisition.push({
      id: `paid-${Date.now()}`,
      name,
      platform: $("#paid-platform").value.trim() || "Meta",
      audience: $("#paid-audience").value.trim() || "Warm audience",
      creative: $("#paid-creative").value.trim() || "Static creative",
      budget: $("#paid-budget").value.trim() || "$10/day",
      stage: $("#paid-stage").value,
      hypothesis: $("#paid-hypothesis").value.trim() || "Definir hipótesis"
    });

    saveState();
    renderPaidBoard();
    event.target.reset();
  });

  $("#x-automation-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.xAutomationConfig = {
      mode: $("#x-mode").value,
      frequency: $("#x-frequency").value,
      windowStart: $("#x-window-start").value.trim() || "10:00",
      windowEnd: $("#x-window-end").value.trim() || "18:00",
      days: $("#x-days").value.trim() || "Mon-Fri",
      scheduler: $("#x-scheduler").value.trim() || "Buffer / Metricool",
      approval: $("#x-approval").value,
      mix: $("#x-mix").value.trim() || "Comparativas 50% · Founder 30% · Producto 20%",
      defaultCta: $("#x-default-cta").value.trim() || "Mira la comparativa"
    };

    saveState();
    renderAutomationCenter();
    window.alert("Configuración de X guardada.");
  });
}

function buildReportText() {
  const report = buildWeeklyReport();
  return [
    "ZeroLimitAI Weekly Growth Report",
    "",
    `Source: ${sourceLabel}`,
    `Focus: ${report.summary}`,
    `Performance: ${report.performance}`,
    `Execution: ${report.execution}`,
    `Top bet: ${report.bets}`,
    `Wins: ${report.wins}`,
    `Blockers: ${report.blockers}`
  ].join("\n");
}

function bindActions() {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const view = anchor.dataset.view || resolveViewFromHash(anchor.getAttribute("href"));
    if (!view) return;

    event.preventDefault();
    setActiveView(view, { scroll: false });

    const target = document.querySelector(anchor.getAttribute("href"));
    target?.scrollIntoView({ block: "start", behavior: "smooth" });
  });

  $("#focus-button").addEventListener("click", () => {
    window.alert(`${state.weeklyFocus.sprint}: ${state.weeklyFocus.objective}`);
  });

  $("#export-button").addEventListener("click", async () => {
    const payload = JSON.stringify(state, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      window.alert("Estado del dashboard copiado al portapapeles.");
    } catch {
      window.alert("No pude copiarlo automáticamente.");
    }
  });

  $("#report-button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(buildReportText());
      window.alert("Reporte semanal copiado al portapapeles.");
    } catch {
      window.alert("No pude copiar el reporte automáticamente.");
    }
  });

  $("#reset-button").addEventListener("click", () => {
    if (!window.confirm("Esto borrará el estado guardado del dashboard. ¿Continuar?")) return;
    state = structuredClone(defaultState);
    saveState();
    renderAll();
  });

  $("#import-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      state = deepMerge(structuredClone(defaultState), JSON.parse(text));
      sourceLabel = `import:${file.name}`;
      saveState();
      renderAll();
      window.alert("Importación completada.");
    } catch {
      window.alert("El archivo no tiene un JSON válido.");
    }
  });

  $("#notes").addEventListener("input", (event) => {
    state.notes = event.target.value;
    saveState();
  });

  $("#copy-x-post-button")?.addEventListener("click", async () => {
    const firstXPost = state.publishingWorkflow.find(
      (item) => item.channel === "X" && ["Draft", "Idea", "Scheduled"].includes(item.stage)
    );

    if (!firstXPost) {
      window.alert("No encontré ningún post de X listo para copiar.");
      return;
    }

    const text = `${firstXPost.title}\n\n${firstXPost.hook}`;
    await copyToClipboard(text, `Copiado al portapapeles: ${firstXPost.title}`);
  });

  $("#copy-next-x-post")?.addEventListener("click", async () => {
    const nextXPost = buildXAutomationQueue().find((item) => item.stage !== "Published");

    if (!nextXPost) {
      setAutomationFeedback("No queda ningún post pendiente en la cola de X.");
      window.alert("No queda ningún post pendiente en la cola de X.");
      return;
    }

    const text = `${nextXPost.title}\n\n${nextXPost.hook}\n\nCTA: ${state.xAutomationConfig.defaultCta}`;
    await copyToClipboard(text, `Copiado el siguiente post: ${nextXPost.title}`);
  });

  $("#copy-next-x-post-quick")?.addEventListener("click", async () => {
    const nextXPost = buildXAutomationQueue().find((item) => item.stage !== "Published");

    if (!nextXPost) {
      setAutomationFeedback("No queda ningún post pendiente en X.");
      window.alert("No queda ningún post pendiente en X.");
      return;
    }

    const text = `${nextXPost.title}\n\n${nextXPost.hook}\n\nCTA: ${state.xAutomationConfig.defaultCta}`;
    await copyToClipboard(text, `Copiado el siguiente post de X: ${nextXPost.title}`);
  });

  $("#copy-next-linkedin-post")?.addEventListener("click", async () => {
    const item = getNextPublishingItem((entry) => entry.channel === "LinkedIn");
    if (!item) {
      window.alert("No hay post de LinkedIn listo ahora mismo.");
      return;
    }

    const text = `${item.title}\n\n${item.hook}`;
    await copyToClipboard(text, `Copiado el siguiente post de LinkedIn: ${item.title}`);
  });

  $("#copy-next-short-script")?.addEventListener("click", async () => {
    const item = getNextVideoScript();
    if (!item) {
      window.alert("No hay guion de short disponible.");
      return;
    }

    const text = [
      item.title,
      "",
      `Hook: ${item.hook}`,
      `Scene 1: ${item.scene1}`,
      `Scene 2: ${item.scene2}`,
      `Scene 3: ${item.scene3}`,
      `CTA: ${item.cta}`
    ].join("\n");

    await copyToClipboard(text, `Copiado el siguiente guion short: ${item.title}`);
  });

  $("#queue-next-x-post")?.addEventListener("click", () => {
    const nextXPost = buildXAutomationQueue().find((item) => ["Idea", "Draft"].includes(item.stage));

    if (!nextXPost) {
      setAutomationFeedback("No hay posts en Idea o Draft para programar.");
      window.alert("No hay posts en Idea o Draft para programar.");
      return;
    }

    const item = state.publishingWorkflow.find((entry) => entry.id === nextXPost.id);
    if (!item) return;
    item.stage = "Scheduled";
    saveState();
    renderPublishBoard();
    renderAutomationCenter();
    setAutomationFeedback(`Marcado como Scheduled: ${item.title}`);
    window.alert(`Post movido a Scheduled: ${item.title}`);
  });

  $("#copy-x-schedule-plan")?.addEventListener("click", async () => {
    const queue = buildXAutomationQueue().filter((item) => item.stage !== "Published");
    if (!queue.length) {
      window.alert("No hay cola pendiente para X.");
      return;
    }

    const config = state.xAutomationConfig || defaultState.xAutomationConfig;
    const text = [
      "Plan de programacion X",
      "",
      `Modo: ${config.mode}`,
      `Frecuencia: ${config.frequency}`,
      `Ventana: ${config.windowStart} - ${config.windowEnd}`,
      `Dias: ${config.days}`,
      `Scheduler: ${config.scheduler}`,
      "",
      ...queue.map((item) => `- ${item.slotLabel} · ${item.title} [${item.stage}]`)
    ].join("\n");

    await copyToClipboard(text, "Plan de programación copiado.");
  });

  $("#start-sprint-button")?.addEventListener("click", () => {
    if (!window.confirm("Esto reiniciará el sprint actual y pondrá todas las tareas en Todo. ¿Continuar?")) return;
    state.tasks = state.tasks.map((task) => ({ ...task, status: "Todo" }));
    state.weeklyFocus.wins = "";
    state.weeklyFocus.blockers = "";
    saveState();
    renderAll();
  });

  $("#next-sprint-button")?.addEventListener("click", () => {
    const currentIndex = state.sprintTemplates.findIndex((template) => template.name === state.weeklyFocus.sprint);
    const nextTemplate = state.sprintTemplates[currentIndex + 1];
    if (!nextTemplate) {
      window.alert("No hay una plantilla siguiente disponible.");
      return;
    }
    applySprintTemplate(nextTemplate);
    saveState();
    renderAll();
    window.alert(`Plantilla aplicada: ${nextTemplate.name}`);
  });

  $("#duplicate-sprint-button")?.addEventListener("click", () => {
    const stamp = Date.now();
    state.weeklyFocus = {
      ...state.weeklyFocus,
      sprint: `${state.weeklyFocus.sprint} Copy`,
      wins: "",
      blockers: ""
    };
    const idMap = new Map();
    state.tasks = state.tasks.map((task, index) => {
      const newId = `task-${stamp}-${index}`;
      idMap.set(task.id, newId);
      return {
        ...task,
        id: newId,
        status: "Todo"
      };
    });
    state.weeklyRoute = state.weeklyRoute.map((step) => ({
      ...step,
      taskIds: (step.taskIds || []).map((taskId) => idMap.get(taskId) || taskId)
    }));
    saveState();
    renderAll();
    window.alert("Sprint duplicado y reiniciado.");
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches("[data-sprint-template-index]")) {
      const template = state.sprintTemplates[Number(target.dataset.sprintTemplateIndex)];
      if (!template) return;
      applySprintTemplate(template);
      saveState();
      renderAll();
      window.alert(`Plantilla aplicada: ${template.name}`);
    }
  });
}

async function loadExternalData() {
  if (!window.location.protocol.startsWith("http")) return false;

  try {
    const response = await fetch(EXTERNAL_DATA_URL, { cache: "no-store" });
    if (!response.ok) return false;
    const external = await response.json();
    state = deepMerge(structuredClone(defaultState), external);
    sourceLabel = EXTERNAL_DATA_URL;
    return true;
  } catch {
    return false;
  }
}

function loadLocalState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  try {
    state = deepMerge(structuredClone(defaultState), JSON.parse(raw));
    sourceLabel = "localStorage";
    return true;
  } catch {
    return false;
  }
}

async function init() {
  const hasExternal = await loadExternalData();
  if (!hasExternal) {
    const hasLocal = loadLocalState();
    if (!hasLocal) {
      state = structuredClone(defaultState);
      sourceLabel = "defaultState";
    }
  }

  renderAll();
  const initialView = resolveViewFromHash(window.location.hash) || "today";
  setActiveView(initialView, { scroll: false });
  bindEditableInputs();
  bindForms();
  bindActions();
}

init();

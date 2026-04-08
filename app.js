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
  tasks: [
    {
      id: "task-1",
      title: "Configurar analytics de embudo",
      owner: "Founder",
      due: "2026-04-11",
      channel: "Infra",
      status: "Todo"
    },
    {
      id: "task-2",
      title: "Crear landing ChatGPT alternative",
      owner: "Founder",
      due: "2026-04-14",
      channel: "SEO",
      status: "Doing"
    },
    {
      id: "task-3",
      title: "Secuencia de emails trial 0-7 días",
      owner: "Founder",
      due: "2026-04-15",
      channel: "Lifecycle",
      status: "Doing"
    },
    {
      id: "task-4",
      title: "Preparar 10 posts base de contenido",
      owner: "Founder",
      due: "2026-04-16",
      channel: "Social",
      status: "Todo"
    },
    {
      id: "task-5",
      title: "Instalar retargeting para pricing visitors",
      owner: "Founder",
      due: "2026-04-18",
      channel: "Paid",
      status: "Done"
    }
  ],
  channels: [
    {
      name: "SEO",
      stage: "Build",
      priority: "Muy alta",
      target: "4 landings + 4 artículos",
      metric: "Trials orgánicos"
    },
    {
      name: "X / LinkedIn",
      stage: "Build",
      priority: "Muy alta",
      target: "5 posts y 2 demos/semana",
      metric: "CTR a landing"
    },
    {
      name: "Short Video",
      stage: "Test",
      priority: "Alta",
      target: "3 shorts/semana",
      metric: "Retención + clicks"
    },
    {
      name: "Paid Retargeting",
      stage: "Scale later",
      priority: "Media",
      target: "Campañas warm audiences",
      metric: "CAC trial"
    }
  ],
  contentCalendar: [
    { day: "Lunes", focus: "Analítica + planning", asset: "Tema central y hooks" },
    { day: "Martes", focus: "LinkedIn + X", asset: "Post fundador + hilo" },
    { day: "Miércoles", focus: "Short demo", asset: "Vídeo de feature o caso de uso" },
    { day: "Jueves", focus: "SEO + email", asset: "Comparativa o caso de uso" },
    { day: "Viernes", focus: "Review semanal", asset: "Aprendizajes y backlog" }
  ],
  automations: [
    {
      name: "Feature -> Content",
      tool: "n8n",
      status: "Planned",
      description: "Convierte features, cambios de ranking y testimonios en borradores multicanal."
    },
    {
      name: "Trial Lifecycle",
      tool: "Loops / Customer.io",
      status: "Planned",
      description: "Secuencia de onboarding, activación, objeciones y upgrade."
    },
    {
      name: "Weekly Growth Report",
      tool: "PostHog + Notion",
      status: "Planned",
      description: "Resumen semanal automático de canales, conversión y decisiones."
    }
  ],
  roadmap: [
    {
      title: "0-30 días",
      focus: "Fijar mensaje, medición y activos base",
      items: [
        "Definir ICP prioritario: AI power users, developers e indie hackers.",
        "Crear 4 landings de alta intención: alternative, developers, AI agents, lifetime AI.",
        "Configurar PostHog o GA4 con eventos de CTA, signup, activation y paid conversion.",
        "Montar secuencia de emails: bienvenida, activación, objeciones, upgrade, winback.",
        "Abrir sistema de contenido multiformato con un calendario fijo."
      ]
    },
    {
      title: "30-60 días",
      focus: "Escalar distribución orgánica y captación",
      items: [
        "Publicar 3-5 piezas semanales reutilizadas entre X, LinkedIn, shorts y newsletter.",
        "Subir comparativas SEO con intención de compra y uso real del producto.",
        "Enviar a directorios AI y páginas de listados útiles.",
        "Activar retargeting a visitantes y trial users no convertidos.",
        "Recoger testimonios reales y mini casos de uso."
      ]
    },
    {
      title: "60-90 días",
      focus: "Lanzamientos y crecimiento repetible",
      items: [
        "Preparar Product Hunt con assets, narrativa, comentarios y embudo ya afinado.",
        "Evaluar AppSumo si el soporte y la economía del lifetime deal siguen siendo sostenibles.",
        "Buscar partnerships con newsletters, YouTubers y comunidades de AI/dev.",
        "Doblar inversión solo en los 2 canales que mejor conviertan a trial y pago."
      ]
    }
  ],
  productHunt: [
    "No lanzar hasta tener onboarding, métricas básicas y prueba social real.",
    "Preparar tagline, gallery, vídeo corto y primer comentario del maker.",
    "Activar lista de contactos para visitas y feedback, no para pedir votos de forma agresiva.",
    "Tener oferta clara para el día del lanzamiento y soporte en tiempo real."
  ],
  appsumo: [
    "Validar primero que el lifetime deal es sostenible en soporte y costes.",
    "Definir muy bien qué incluye cada tier y qué queda fuera.",
    "Tener docs, onboarding y soporte preparados antes de aplicar.",
    "Usarlo como acelerador cuando el mensaje ya convierta, no como parche."
  ],
  nextActions: [
    "Instalar analytics de embudo y definir eventos clave hoy mismo.",
    "Crear 4 landings específicas con un CTA único a trial.",
    "Montar la secuencia de emails del trial antes de invertir en tráfico.",
    "Producir 10 piezas base de contenido reutilizable a partir de la landing y las features.",
    "Preparar retargeting simple para visitantes de pricing y trial no convertidos."
  ],
  notes: `Fuentes recomendadas para conectar en la siguiente fase:
- PostHog o GA4 para sesiones, trial starts y funnels
- Stripe para ingresos y trial to paid
- Buffer/Metricool o export manual de redes para performance por canal
- Airtable/Notion para partnerships, directorios y calendario editorial`
};

let state = structuredClone(defaultState);
let sourceLabel = "defaultState";

const $ = (selector) => document.querySelector(selector);

function deepMerge(base, patch) {
  if (Array.isArray(base)) return Array.isArray(patch) ? patch : base;
  if (typeof base !== "object" || base === null) return patch ?? base;

  const result = { ...base };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (key in base) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
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

function renderSummary() {
  $("#north-star").textContent = state.summary.northStar;
  $("#positioning").textContent = state.summary.positioning;
  $("#focus-sprint").textContent = state.weeklyFocus.sprint;
  $("#focus-objective").textContent = state.weeklyFocus.objective;
  $("#sprint").value = state.weeklyFocus.sprint;
  $("#objective").value = state.weeklyFocus.objective;
  $("#wins").value = state.weeklyFocus.wins;
  $("#blockers").value = state.weeklyFocus.blockers;

  const points = $("#positioning-points");
  points.innerHTML = "";
  state.positioningPoints.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    points.appendChild(li);
  });
}

function renderKpis() {
  const container = $("#metrics");
  container.innerHTML = "";

  state.kpis.forEach((kpi) => {
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
    container.appendChild(card);
  });
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
        (task) => `
          <article class="task-card">
            <div class="task-top">
              <h4>${task.title}</h4>
              <select data-task-id="${task.id}" data-field="status">
                ${statuses
                  .map(
                    (option) =>
                      `<option value="${option}" ${option === task.status ? "selected" : ""}>${option}</option>`
                  )
                  .join("")}
              </select>
            </div>
            <p>${task.channel} · ${task.owner}</p>
            <p class="task-due">Entrega: ${task.due}</p>
          </article>
        `
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
  const ph = $("#product-hunt-list");
  const as = $("#appsumo-list");
  const next = $("#next-actions");

  ph.innerHTML = "";
  as.innerHTML = "";
  next.innerHTML = "";

  state.productHunt.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ph.appendChild(li);
  });

  state.appsumo.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    as.appendChild(li);
  });

  state.nextActions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    next.appendChild(li);
  });
}

function buildWeeklyReport() {
  const sessions = state.kpis.find((item) => item.id === "sessions");
  const trials = state.kpis.find((item) => item.id === "trial_starts");
  const activation = state.kpis.find((item) => item.id === "activation");
  const trialToPaid = state.kpis.find((item) => item.id === "trial_to_paid");

  const done = state.tasks.filter((task) => task.status === "Done").length;
  const doing = state.tasks.filter((task) => task.status === "Doing").length;
  const todo = state.tasks.filter((task) => task.status === "Todo").length;

  const gaps = [sessions, trials, activation, trialToPaid]
    .map((item) => ({
      label: item.label,
      current: item.value,
      target: item.target,
      ratio: parseValue(item.target) ? parseValue(item.value) / parseValue(item.target) : 0
    }))
    .sort((a, b) => a.ratio - b.ratio);

  const lowest = gaps[0];
  const strongest = [...gaps].sort((a, b) => b.ratio - a.ratio)[0];

  return {
    summary: `${state.weeklyFocus.sprint}: ${state.weeklyFocus.objective}`,
    performance: `Mejor señal relativa: ${strongest.label} (${strongest.current} / ${strongest.target}). Mayor gap: ${lowest.label} (${lowest.current} / ${lowest.target}).`,
    execution: `Tareas: ${done} done, ${doing} doing, ${todo} pendientes.`,
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
    <p><strong>Wins:</strong> ${report.wins}</p>
    <p><strong>Blockers:</strong> ${report.blockers}</p>
  `;
}

function renderNotes() {
  $("#notes").value = state.notes;
}

function renderAll() {
  renderSourceStatus();
  renderSummary();
  renderKpis();
  renderTaskBoard();
  renderChannels();
  renderCalendar();
  renderAutomations();
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
      renderTaskBoard();
      renderWeeklyReport();
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
      owner: $("#task-owner").value.trim() || "Founder",
      due: $("#task-due").value || "Sin fecha",
      channel: $("#task-channel").value.trim() || "General",
      status: $("#task-status").value
    });

    saveState();
    renderTaskBoard();
    renderWeeklyReport();
    event.target.reset();
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
    `Wins: ${report.wins}`,
    `Blockers: ${report.blockers}`
  ].join("\n");
}

function bindActions() {
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
}

async function loadExternalData() {
  if (!window.location.protocol.startsWith("http")) {
    return false;
  }

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
  const hasLocal = loadLocalState();
  if (!hasLocal) {
    const hasExternal = await loadExternalData();
    if (!hasExternal) {
      state = structuredClone(defaultState);
      sourceLabel = "defaultState";
    }
  }

  renderAll();
  bindEditableInputs();
  bindForms();
  bindActions();
}

init();

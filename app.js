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
  launchPriorities: [],
  assetPipeline: [],
  setupAssumptions: [],
  firstRunChecklist: [],
  audiences: [],
  offers: [],
  contentPillars: [],
  distribution: [],
  socialSystem: [],
  weeklyAssets: [],
  publishingWorkflow: [],
  campaignTracker: [],
  paidAcquisition: [],
  editorialSprint: [],
  monthPlan: [],
  directorySprint: [],
  outreachQueue: [],
  outreachCRM: [],
  outreachTemplates: [],
  xCopyBank: [],
  linkedinCopyBank: [],
  videoScriptBank: [],
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
  nextActions: [],
  notes: ""
};

let state = structuredClone(defaultState);
let sourceLabel = "defaultState";

const $ = (selector) => document.querySelector(selector);

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

function renderInfoCards(containerId, items, config) {
  const container = $(containerId);
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
}

function renderAll() {
  renderSourceStatus();
  renderSummary();
  renderWeeklyScorecard();
  renderKpis();
  renderPlanSections();
  renderTaskBoard();
  renderPublishBoard();
  renderCampaignBoard();
  renderPaidBoard();
  renderEditorialSprint();
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

    if (target.matches("[data-publish-id]")) {
      const item = state.publishingWorkflow.find((entry) => entry.id === target.dataset.publishId);
      item[target.dataset.field] = target.value;
      saveState();
      renderPublishBoard();
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
  bindEditableInputs();
  bindForms();
  bindActions();
}

init();

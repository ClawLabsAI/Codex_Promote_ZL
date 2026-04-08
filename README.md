# ZeroLimitAI Growth Dashboard

Dashboard estático de growth para ZeroLimitAI, preparado para vivir en GitHub y desplegarse automáticamente en GitHub Pages.

## Qué incluye

- UI moderna y limpia para estrategia, KPIs, tareas y reporting
- Persistencia local en navegador para trabajo rápido
- Carga opcional desde `data/dashboard.json`
- Capa de fuentes centralizadas en `data/sources/`
- Script de sincronización en `scripts/sync-data.mjs`
- Workflow de actualización automática en `.github/workflows/update-dashboard.yml`
- Workflow de despliegue en GitHub Pages en `.github/workflows/deploy-pages.yml`

## Estructura

```text
.
├── .github/workflows/
├── connectors/
├── data/dashboard.json
├── data/sources/
├── scripts/sync-data.mjs
├── index.html
├── styles.css
├── app.js
└── package.json
```

## Uso local

Puedes abrir `index.html` directamente, pero para que el dashboard lea `data/dashboard.json` automáticamente conviene servirlo por HTTP.

Ejemplo:

```bash
python3 -m http.server 4173
```

Luego abre `http://localhost:4173`.

## Subirlo a GitHub

1. Crea un repositorio nuevo en GitHub.
2. Sube este contenido a la rama `main`.
3. En GitHub, activa `Settings > Pages > Build and deployment > GitHub Actions`.
4. Haz push a `main` y el workflow `Deploy Dashboard` publicará la web.

## Cómo actualizar datos automáticamente

El workflow `Update Dashboard Data` puede ejecutarse:

- manualmente
- de lunes a viernes por cron

Lee variables y secretos de GitHub y actualiza `data/dashboard.json`.

## Flujo de datos recomendado

- `data/dashboard.json`: estado consolidado que consume la UI
- `data/sources/posthog.json`: sesiones, trial starts y activation
- `data/sources/stripe.json`: conversion y revenue
- `data/sources/social.json`: señales de contenido y CTR
- `data/sources/ops.json`: foco semanal y notas operativas

El script `scripts/sync-data.mjs` mezcla estas fuentes y luego aplica variables de entorno o un parche remoto opcional.

### Variables recomendadas

- `DASHBOARD_SESSIONS`
- `DASHBOARD_TRIAL_STARTS`
- `DASHBOARD_ACTIVATION`
- `DASHBOARD_TRIAL_TO_PAID`
- `DASHBOARD_SPRINT`
- `DASHBOARD_OBJECTIVE`
- `DASHBOARD_WINS`
- `DASHBOARD_BLOCKERS`

### Secrets opcionales

- `DASHBOARD_REMOTE_JSON_URL`
- `DASHBOARD_REMOTE_JSON_TOKEN`

Si configuras `DASHBOARD_REMOTE_JSON_URL`, el script intentará leer un JSON remoto y mezclarlo con el estado actual.

## Comando útil

```bash
npm run sync:data
```

## Siguiente paso recomendado

Conectar una fuente real de métricas para generar `data/dashboard.json` desde:

- PostHog o GA4
- Stripe
- Buffer, Metricool o exports de redes

Si quieres, el siguiente paso puede ser dejar un script real que consulte PostHog y Stripe directamente y publique el reporte semanal en Markdown dentro del repo.

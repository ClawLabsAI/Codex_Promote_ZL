# Guia paso a paso

Esta guia esta pensada para que pongas el dashboard en marcha sin pelearte con detalles tecnicos.

## Objetivo

Queremos que el dashboard te ayude primero a hacer marketing de verdad:

- construir landings
- publicar contenido
- mover redes sociales
- entrar en directorios
- hacer outreach

Y despues, cuando entre trafico, medir:

- visitas
- trials
- pagos

## Paso 1

No pienses en analytics como la prioridad numero uno.

En esta fase, tu KPI principal es ejecucion:

- cuantas landings has creado
- cuantos posts has publicado
- cuantos videos has publicado
- cuantos directorios has atacado
- cuantos partners has contactado

## Paso 2

En el dashboard, empieza por estas zonas:

- `Launch Priority`
- `Asset Pipeline`
- `Social System`
- `Weekly Assets`
- `Execution`

## Paso 3

Esta semana deberias intentar llegar a:

- 1 landing comparativa principal
- 5 posts en X
- 3 posts en LinkedIn
- 3 demos cortas
- 10 envios a directorios

## Paso 4

En PostHog vamos a asumir por ahora:

- trial event = `trial_started`
- activation event = `first_message_sent`

No hace falta que sean definitivos hoy porque ahora mismo analytics no es el cuello de botella.

## Paso 5

En Stripe vamos a asumir por ahora:

- pagos medidos por `charges`

Es la opcion mas simple para empezar.

## Paso 6

Crea un archivo `.env` en la raiz del proyecto copiando `.env.example`.

Rellena estos campos:

- `POSTHOG_PROJECT_ID`
- `POSTHOG_PERSONAL_API_KEY`
- `STRIPE_SECRET_KEY`

Y deja estos valores por defecto por ahora:

- `POSTHOG_TRIAL_EVENT=trial_started`
- `POSTHOG_ACTIVATION_EVENT=first_message_sent`
- `POSTHOG_PAGEVIEW_EVENT=$pageview`
- `POSTHOG_LOOKBACK_DAYS=7`
- `STRIPE_LOOKBACK_DAYS=7`
- `STRIPE_CURRENCY=usd`

## Paso 7

Ejecuta estos comandos:

```bash
npm run fetch:posthog
npm run fetch:stripe
npm run sync:data
```

Esto hará:

- traer datos a `data/sources/posthog.json`
- traer datos a `data/sources/stripe.json`
- consolidarlo todo en `data/dashboard.json`

## Paso 8

Haz push a GitHub y deja que Vercel redeploye.

El dashboard online leerá el JSON actualizado del repo.

## Paso 9

Cada lunes:

- revisar ejecucion
- actualizar foco semanal
- decidir 1 comparativa larga
- decidir 3 demos cortas
- decidir 5 posts founder-led
- decidir 10 envios a directorios o outreach

## Sistema de redes recomendado

Cada semana:

- X: 5 posts
- LinkedIn: 3 posts
- Shorts/Reels/TikTok: 3 demos
- Email: 1 resumen

## Cuando me pases los nombres reales

Cuando quieras afinarlo, solo necesito:

- nombre real del evento de trial en PostHog
- nombre real del evento de activacion en PostHog
- confirmar si en Stripe seguimos con `charges` o cambiamos a `subscriptions`

Y yo te dejo los scripts ajustados a tu caso exacto.

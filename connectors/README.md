# Connectors

Esta carpeta contiene plantillas para futuras integraciones del dashboard con fuentes reales.

## Flujo recomendado

1. Extraer datos desde PostHog, GA4, Stripe o una API propia
2. Transformarlos al formato esperado por el dashboard
3. Guardarlos en `../data/dashboard.json`
4. Dejar que GitHub Actions publique la nueva versión

## Idea práctica

La versión actual ya incluye un sync básico con variables de entorno y un parche remoto opcional.

Cuando quieras la siguiente iteración, puedo dejarte:

- una integración real con PostHog
- una integración real con Stripe
- y un generador automático de reporte semanal en Markdown

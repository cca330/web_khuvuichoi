# Monitoring

The Compose monitoring stack collects host and Docker-container metrics with
Node Exporter and cAdvisor, stores and evaluates them in Prometheus, and shows
metrics and alert state in Grafana. Loki and Promtail continue to collect logs.

## Start the monitoring stack

From the directory containing `docker-compose.yml`, run:

```sh
docker compose up -d loki promtail prometheus node-exporter cadvisor grafana
docker compose ps
```

Open Grafana at `http://localhost:3007`, then open **Dashboards > Monitoring >
Project monitoring**. The provisioned dashboard shows host CPU/memory,
per-container CPU/memory, and firing Prometheus alerts. It may take up to a
minute for the first metrics to appear.

## Alerts

Prometheus evaluates the rules in `prometheus-alerts.yml` every 15 seconds:

- Host CPU above 80% for 5 minutes.
- Host memory above 85% for 5 minutes.
- Node Exporter or cAdvisor unreachable for 2 minutes.

Active alert states appear in the dashboard's **Firing alerts** panel. These
rules evaluate automatically, but external notifications (email, chat, etc.)
are not configured. Configure a Grafana contact point and notification policy
if alerts should be delivered outside the Grafana UI.

## Data and access

Prometheus retains 15 days of metrics in the `prometheus_data` Docker volume.
Prometheus and the exporters are only exposed on the internal Compose network;
Grafana remains available on the host port configured in `docker-compose.yml`.
Node Exporter and cAdvisor require access to host system and Docker data, so use
this stack only on a trusted machine.

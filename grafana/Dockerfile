FROM grafana/grafana:latest
USER root
COPY --chown=472:472 provisioning/ /etc/grafana/provisioning/
COPY --chown=472:472 dashboards/ /var/lib/grafana/dashboards/
USER grafana
EXPOSE 3000

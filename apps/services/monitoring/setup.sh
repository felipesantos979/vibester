#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Verificar se o token do Prometheus para o Kubernetes está presente
if [[ ! -f "$SCRIPT_DIR/secrets/k8s-token" ]]; then
  echo "[AVISO] Token Kubernetes não encontrado em secrets/k8s-token"
  echo "        Execute os seguintes comandos para gerá-lo:"
  echo ""
  echo "  kubectl apply -f $SCRIPT_DIR/k8s-monitoring.yaml"
  echo "  mkdir -p $SCRIPT_DIR/secrets"
  echo "  kubectl get secret prometheus-token -n monitoring -o jsonpath='{.data.token}' | base64 -d > $SCRIPT_DIR/secrets/k8s-token"
  echo ""
fi
GRAFANA_URL="http://localhost:3000"
GRAFANA_HEALTH_ENDPOINT="${GRAFANA_URL}/api/health"
MAX_WAIT=120
INTERVAL=5

log()  { echo "[$(date '+%H:%M:%S')] $*"; }
ok()   { echo "[$(date '+%H:%M:%S')] ✓ $*"; }
fail() { echo "[$(date '+%H:%M:%S')] ✗ $*" >&2; exit 1; }

cd "$SCRIPT_DIR"

#  1. Criar diretórios de provisionamento 
log "Criando estrutura de diretórios..."
mkdir -p grafana/provisioning/datasources
mkdir -p grafana/provisioning/dashboards
ok "Diretórios criados."

#  2. Verificar dependências 
command -v docker  >/dev/null 2>&1 || fail "Docker não encontrado. Instale o Docker primeiro."
command -v curl    >/dev/null 2>&1 || fail "curl não encontrado. Instale com: apt install curl"

# Suporta tanto 'docker compose' (v2) quanto 'docker-compose' (v1)
if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  fail "docker compose / docker-compose não encontrado."
fi

ok "Docker Compose encontrado: $COMPOSE"

#  3. Subir a stack 
log "Iniciando a stack de monitoramento..."
$COMPOSE up -d --pull always

ok "Containers iniciados."

#  4. Aguardar o Grafana ficar disponível
log "Aguardando Grafana em ${GRAFANA_HEALTH_ENDPOINT} (timeout: ${MAX_WAIT}s)..."

elapsed=0
while true; do
  if curl -sf "${GRAFANA_HEALTH_ENDPOINT}" | grep -q '"database":"ok"'; then
    break
  fi

  if [[ $elapsed -ge $MAX_WAIT ]]; then
    fail "Grafana não ficou disponível em ${MAX_WAIT}s. Verifique com: $COMPOSE logs grafana"
  fi

  sleep $INTERVAL
  elapsed=$(( elapsed + INTERVAL ))
  log "  ... aguardando (${elapsed}s)"
done

ok "Grafana disponível!"

#5. Resultado
ADMIN_USER="${GRAFANA_ADMIN_USER:-admin}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Stack de monitoramento rodando com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Grafana:    ${GRAFANA_URL}"
echo "  Prometheus: http://localhost:9090  (somente 127.0.0.1)"
echo ""
echo "  Usuário Grafana: ${ADMIN_USER}"
echo "  Senha:           \${GRAFANA_ADMIN_PASSWORD:-admin}"
echo ""
echo "  Dashboards recomendados (importar via ID no Grafana):"
echo "    1860  - Node Exporter Full (métricas do host/VPS)"
echo "    15520 - Kubernetes All-in-one Cluster Monitoring (visão geral)"
echo "    6417  - Kubernetes Pods (CPU/memória por pod)"
echo "    13332 - kube-state-metrics v2 (estado dos deployments)"
echo "    15661 - 1 Kubernetes All Namespaces (por namespace)"
echo ""
echo "  Logs:    $COMPOSE logs -f"
echo "  Parar:   $COMPOSE down"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

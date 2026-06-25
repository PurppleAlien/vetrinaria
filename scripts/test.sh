#!/usr/bin/env bash
# Vetrinaria - Functional Test Suite
# Ejecuta pruebas básicas de funcionamiento contra la API
# Uso: ./scripts/test.sh [base_url]
# Ejemplo: ./scripts/test.sh http://localhost:3000

set -euo pipefail

BASE_URL="${1:-http://localhost:3000}"
PASS=0
FAIL=0

green() { echo -e "\033[32m$1\033[0m"; }
red() { echo -e "\033[31m$1\033[0m"; }
bold() { echo -e "\033[1m$1\033[0m"; }

assert_status() {
    local url="$1"
    local expected="$2"
    local name="$3"
    local status
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    if [ "$status" = "$expected" ]; then
        green "  ✓ $name (HTTP $status)"
        PASS=$((PASS + 1))
    else
        red "  ✗ $name (esperado $expected, recibido $status)"
        FAIL=$((FAIL + 1))
    fi
}

assert_body() {
    local url="$1"
    local pattern="$2"
    local name="$3"
    if curl -s "$url" 2>/dev/null | grep -q "$pattern"; then
        green "  ✓ $name"
        PASS=$((PASS + 1))
    else
        red "  ✗ $name (no se encontró '$pattern')"
        FAIL=$((FAIL + 1))
    fi
}

bold "Vetrinaria - Tests de Funcionamiento"
bold "======================================"
echo "Base URL: $BASE_URL"
echo ""

bold "1. Health Check"
assert_status "$BASE_URL/api/health" 200 "Health endpoint OK"
assert_body "$BASE_URL/api/health" "healthy" "Health reporta healthy"

bold "2. Rutas Públicas"
assert_status "$BASE_URL/auth/login" 200 "Login page OK"
assert_status "$BASE_URL/auth/register" 200 "Register page OK"

bold "3. Rutas Protegidas (deben redirigir a login)"
assert_status "$BASE_URL/" 302 "Dashboard redirige sin sesión"
assert_status "$BASE_URL/clients" 302 "Clientes redirige sin sesión"
assert_status "$BASE_URL/patients" 302 "Pacientes redirige sin sesión"
assert_status "$BASE_URL/appointments" 302 "Citas redirige sin sesión"
assert_status "$BASE_URL/invoices" 302 "Facturas redirige sin sesión"
assert_status "$BASE_URL/inventory" 302 "Inventario redirige sin sesión"
assert_status "$BASE_URL/notifications" 302 "Notificaciones redirige sin sesión"
assert_status "$BASE_URL/settings/backups" 302 "Backups redirige sin sesión"
assert_status "$BASE_URL/settings/clinics" 302 "Clínicas redirige sin sesión"

bold "4. API Routes"
assert_body "$BASE_URL/api/clients/list" "\\[" "Lista de clientes responde array"
assert_body "$BASE_URL/api/users/vets" "\\[" "Veterinarios responde array"

bold "5. Páginas de Error"
assert_status "$BASE_URL/this-does-not-exist" 404 "Ruta inexistente da 404"

echo ""
bold "======================================"
bold "Resultados: $PASS pasaron, $FAIL fallaron"
echo ""

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# Supabase — Projeto de produção (PostgreSQL)
# ─────────────────────────────────────────────────────────────────────────────

# Importar projeto existente (evita recriação e perda de dados)
import {
  to = supabase_project.production
  id = var.supabase_project_ref
}

resource "supabase_project" "production" {
  organization_id   = var.supabase_organization_id
  name              = "pills"
  database_password = var.supabase_db_password
  region            = "sa-east-1"

  lifecycle {
    ignore_changes = [database_password]
  }
}

# ─── API Settings ────────────────────────────────────────────────────────────

resource "supabase_settings" "production" {
  project_ref = supabase_project.production.id

  api = jsonencode({
    db_schema            = "public,storage,graphql_public"
    db_extra_search_path = "public,extensions"
    max_rows             = 1000
  })
}

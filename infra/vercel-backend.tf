# ─────────────────────────────────────────────────────────────────────────────
# Vercel — Backend (NestJS)
# ─────────────────────────────────────────────────────────────────────────────

# Importar projeto existente
import {
  to = vercel_project.backend
  id = "prj_Qb4ungP6dAh6kTk1xetDaxto76fU"
}

resource "vercel_project" "backend" {
  name = "pills-backend"

  # git_repository gerenciado manualmente via Vercel Dashboard
  # (requer GitHub Integration instalada no Vercel para funcionar via Terraform)

  root_directory = "apps/backend"

  build_command = "prisma generate && nest build"

  serverless_function_region = "gru1"

  automatically_expose_system_environment_variables = true

  # Fix for provider bug
  enable_affected_projects_deployments = false
}

# ─── Environment Variables ───────────────────────────────────────────────────

resource "vercel_project_environment_variable" "backend_database_url" {
  project_id = vercel_project.backend.id
  key        = "DATABASE_URL"
  value      = var.database_url
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "backend_direct_url" {
  project_id = vercel_project.backend.id
  key        = "DIRECT_URL"
  value      = var.direct_url
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "backend_clerk_secret_key" {
  project_id = vercel_project.backend.id
  key        = "CLERK_SECRET_KEY"
  value      = var.clerk_secret_key
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "backend_vapid_public_key" {
  project_id = vercel_project.backend.id
  key        = "VAPID_PUBLIC_KEY"
  value      = var.vapid_public_key
  target     = ["production"]
}

resource "vercel_project_environment_variable" "backend_vapid_private_key" {
  project_id = vercel_project.backend.id
  key        = "VAPID_PRIVATE_KEY"
  value      = var.vapid_private_key
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "backend_vapid_email" {
  project_id = vercel_project.backend.id
  key        = "VAPID_EMAIL"
  value      = var.vapid_email
  target     = ["production"]
}

resource "vercel_project_environment_variable" "backend_cron_secret" {
  project_id = vercel_project.backend.id
  key        = "CRON_SECRET"
  value      = var.cron_secret
  target     = ["production"]
  sensitive  = true
}

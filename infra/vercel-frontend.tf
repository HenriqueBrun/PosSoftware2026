# ─────────────────────────────────────────────────────────────────────────────
# Vercel — Frontend (Next.js)
# ─────────────────────────────────────────────────────────────────────────────

# Importar projeto existente
import {
  to = vercel_project.frontend
  id = "prj_OKFegtBNFza5duLe3szmMWShirwW"
}

resource "vercel_project" "frontend" {
  name      = "pills-frontend"
  framework = "nextjs"

  # git_repository gerenciado manualmente via Vercel Dashboard
  # (requer GitHub Integration instalada no Vercel para funcionar via Terraform)

  root_directory = "apps/frontend"

  serverless_function_region = "gru1"

  automatically_expose_system_environment_variables = true

  # Fix for provider bug
  enable_affected_projects_deployments = false
}

# ─── Environment Variables ───────────────────────────────────────────────────

resource "vercel_project_environment_variable" "frontend_api_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_API_URL"
  value      = "https://pills-backend.vercel.app"
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "frontend_clerk_publishable_key" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  value      = var.clerk_publishable_key
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "frontend_clerk_sign_in_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
  value      = "/sign-in"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "frontend_clerk_sign_up_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
  value      = "/sign-up"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "frontend_clerk_after_sign_in_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
  value      = "/dashboard"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "frontend_clerk_after_sign_up_url" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
  value      = "/dashboard"
  target     = ["production", "preview", "development"]
}

resource "vercel_project_environment_variable" "frontend_vapid_public_key" {
  project_id = vercel_project.frontend.id
  key        = "NEXT_PUBLIC_VAPID_PUBLIC_KEY"
  value      = var.vapid_public_key
  target     = ["production", "preview", "development"]
}

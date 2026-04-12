# ─────────────────────────────────────────────────────────────────────────────
# Pills — Terraform IaC
# Provisiona infraestrutura de produção: Supabase + Vercel (Frontend + Backend)
# ─────────────────────────────────────────────────────────────────────────────

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

# ─── Provider: Vercel ────────────────────────────────────────────────────────
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id
}

# ─── Provider: Supabase ─────────────────────────────────────────────────────
provider "supabase" {
  access_token = var.supabase_access_token
}

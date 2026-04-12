# ─────────────────────────────────────────────────────────────────────────────
# Variables — Pills Terraform IaC
# ─────────────────────────────────────────────────────────────────────────────

# ─── Vercel ──────────────────────────────────────────────────────────────────

variable "vercel_api_token" {
  description = "Vercel API Token (https://vercel.com/account/settings/tokens)"
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel Team/Org ID"
  type        = string
  default     = "team_kzd4bq0Azario0ZPVLojoJli"
}

# ─── Supabase ────────────────────────────────────────────────────────────────

variable "supabase_access_token" {
  description = "Supabase Personal Access Token (https://supabase.com/dashboard/account/tokens)"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase Organization slug (Organization Settings > Organization slug)"
  type        = string
}

variable "supabase_project_ref" {
  description = "Supabase project reference (existing project ID)"
  type        = string
  default     = "evzusanajrsgqfqakqod"
}

variable "supabase_db_password" {
  description = "Supabase PostgreSQL database password"
  type        = string
  sensitive   = true
}

# ─── Clerk ───────────────────────────────────────────────────────────────────
# Clerk não tem provider Terraform oficial.
# Chaves são gerenciadas manualmente via Dashboard e injetadas aqui como variáveis.

variable "clerk_publishable_key" {
  description = "Clerk Publishable Key (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk Secret Key (CLERK_SECRET_KEY)"
  type        = string
  sensitive   = true
}

# ─── Database ────────────────────────────────────────────────────────────────

variable "database_url" {
  description = "PostgreSQL connection string via PgBouncer (pooler)"
  type        = string
  sensitive   = true
}

variable "direct_url" {
  description = "PostgreSQL direct connection string (for migrations)"
  type        = string
  sensitive   = true
}

# ─── Web Push (VAPID) ────────────────────────────────────────────────────────

variable "vapid_public_key" {
  description = "VAPID public key for Web Push notifications"
  type        = string
}

variable "vapid_private_key" {
  description = "VAPID private key for Web Push notifications"
  type        = string
  sensitive   = true
}

variable "vapid_email" {
  description = "VAPID contact email"
  type        = string
  default     = "mailto:pills@example.com"
}

# ─── Cron ────────────────────────────────────────────────────────────────────

variable "cron_secret" {
  description = "Secret token for Vercel Cron job authentication"
  type        = string
  sensitive   = true
}

# ─── GitHub ──────────────────────────────────────────────────────────────────

variable "github_repo" {
  description = "GitHub repository in org/repo format"
  type        = string
  default     = "HenriqueBrun/PosSoftware2026"
}

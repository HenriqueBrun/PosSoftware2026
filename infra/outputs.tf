# ─────────────────────────────────────────────────────────────────────────────
# Outputs — URLs e IDs úteis
# ─────────────────────────────────────────────────────────────────────────────

# ─── Supabase ────────────────────────────────────────────────────────────────

output "supabase_project_ref" {
  description = "Supabase project reference ID"
  value       = supabase_project.production.id
}

output "supabase_project_url" {
  description = "Supabase project dashboard URL"
  value       = "https://supabase.com/dashboard/project/${supabase_project.production.id}"
}

# ─── Vercel Frontend ─────────────────────────────────────────────────────────

output "vercel_frontend_project_id" {
  description = "Vercel Frontend project ID"
  value       = vercel_project.frontend.id
}

output "frontend_url" {
  description = "Frontend production URL"
  value       = "https://pills-frontend.vercel.app"
}

# ─── Vercel Backend ──────────────────────────────────────────────────────────

output "vercel_backend_project_id" {
  description = "Vercel Backend project ID"
  value       = vercel_project.backend.id
}

output "backend_url" {
  description = "Backend production URL"
  value       = "https://pills-backend.vercel.app"
}

# ─── Summary ─────────────────────────────────────────────────────────────────

output "infrastructure_summary" {
  description = "Quick summary of all provisioned resources"
  value       = <<-EOT

    ╔══════════════════════════════════════════════════════════════╗
    ║               💊 Pills — Infrastructure Summary             ║
    ╠══════════════════════════════════════════════════════════════╣
    ║                                                              ║
    ║  Frontend:  https://pills-frontend.vercel.app                ║
    ║  Backend:   https://pills-backend.vercel.app                 ║
    ║  Supabase:  ${supabase_project.production.id}                ║
    ║                                                              ║
    ║  Clerk:     Managed via dashboard.clerk.com                  ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝

  EOT
}

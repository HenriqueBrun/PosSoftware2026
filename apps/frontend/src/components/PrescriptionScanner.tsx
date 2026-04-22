'use client'

import { useState, useRef, useCallback } from 'react'

interface ExtractedMedication {
  name: string
  dosage: string
  frequency: '4h' | '6h' | '8h' | '12h' | 'daily'
  criticality: 'low' | 'medium' | 'high'
  notes?: string
}

interface AnalysisResult {
  medications: ExtractedMedication[]
  doctorName?: string
  patientName?: string
}

interface PrescriptionScannerProps {
  onMedicationSelect: (medication: ExtractedMedication) => void
  getAuthHeaders: () => Promise<Record<string, string>>
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

const frequencyLabels: Record<string, string> = {
  '4h': 'A cada 4 horas',
  '6h': 'A cada 6 horas',
  '8h': 'A cada 8 horas',
  '12h': 'A cada 12 horas',
  daily: '1x ao dia',
}

const criticalityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

const criticalityColors: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
}

export default function PrescriptionScanner({
  onMedicationSelect,
  getAuthHeaders,
}: PrescriptionScannerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato não suportado. Use JPEG, PNG ou WebP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. O limite é 10MB.')
      return
    }

    setError(null)
    setResult(null)
    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) {
        const input = fileInputRef.current
        if (input) {
          const dt = new DataTransfer()
          dt.items.add(file)
          input.files = dt.files
          handleFileChange({ target: input } as React.ChangeEvent<HTMLInputElement>)
        }
      }
    },
    [handleFileChange],
  )

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    try {
      const headers = await getAuthHeaders()
      const formData = new FormData()
      formData.append('image', selectedFile)

      const res = await fetch(`${API_BASE_URL}/api/v1/prescription-ocr/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || `Erro HTTP ${res.status}`)
      }

      const data: AnalysisResult = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao analisar a receita. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMedication = (med: ExtractedMedication) => {
    onMedicationSelect(med)
    setIsOpen(false)
    resetState()
  }

  const resetState = () => {
    setImagePreview(null)
    setSelectedFile(null)
    setResult(null)
    setError(null)
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '16px 24px',
          borderRadius: '12px',
          border: '2px dashed var(--color-primary, #6366f1)',
          background: 'rgba(99, 102, 241, 0.05)',
          color: 'var(--color-primary, #6366f1)',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '20px',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)'
          e.currentTarget.style.borderColor = 'var(--color-primary, #6366f1)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'
        }}
      >
        <span style={{ fontSize: '22px' }}>📷</span>
        Escanear Receita Médica com IA
      </button>
    )
  }

  return (
    <div
      style={{
        marginBottom: '24px',
        borderRadius: '16px',
        border: '1px solid var(--color-border, #e2e8f0)',
        background: 'var(--color-surface, #fff)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
          borderBottom: '1px solid var(--color-border, #e2e8f0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Análise Inteligente de Receita
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Powered by GPT-4o-mini Vision
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false)
            resetState()
          }}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            padding: '4px 8px',
            borderRadius: '8px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Upload Area */}
        {!result && (
          <>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: imagePreview ? '12px' : '40px',
                borderRadius: '12px',
                border: '2px dashed var(--color-border, #e2e8f0)',
                background: 'rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: imagePreview ? 'auto' : '160px',
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview da receita"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    objectFit: 'contain',
                  }}
                />
              ) : (
                <>
                  <span style={{ fontSize: '48px', opacity: 0.5 }}>📄</span>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Arraste a foto da receita aqui
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                    ou clique para selecionar • JPEG, PNG ou WebP (máx. 10MB)
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {imagePreview && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    resetState()
                    fileInputRef.current?.click()
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Trocar Foto
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: loading
                      ? 'var(--color-text-secondary)'
                      : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '18px',
                          height: '18px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#fff',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      Analisando com IA...
                    </>
                  ) : (
                    <>🔍 Analisar Receita</>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px 18px',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#dc2626',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Summary */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 18px',
                background: 'rgba(34, 197, 94, 0.08)',
                borderRadius: '10px',
              }}
            >
              <span style={{ fontSize: '20px' }}>✅</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '14px' }}>
                  {result.medications.length} medicamento(s) encontrado(s)
                </p>
                {(result.doctorName || result.patientName) && (
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {result.doctorName && `Dr(a). ${result.doctorName}`}
                    {result.doctorName && result.patientName && ' • '}
                    {result.patientName && `Paciente: ${result.patientName}`}
                  </p>
                )}
              </div>
            </div>

            {/* Medication Cards */}
            {result.medications.map((med, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border, #e2e8f0)',
                  background: 'var(--color-background, #fafafa)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                      💊 {med.name}
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginTop: '10px',
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: 'rgba(99,102,241,0.1)',
                          color: '#6366f1',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {med.dosage}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: 'rgba(59,130,246,0.1)',
                          color: '#3b82f6',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {frequencyLabels[med.frequency] || med.frequency}
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: `${criticalityColors[med.criticality]}15`,
                          color: criticalityColors[med.criticality],
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {criticalityLabels[med.criticality]}
                      </span>
                    </div>
                    {med.notes && (
                      <p
                        style={{
                          margin: '10px 0 0',
                          fontSize: '13px',
                          color: 'var(--color-text-secondary)',
                          fontStyle: 'italic',
                        }}
                      >
                        📝 {med.notes}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectMedication(med)}
                  style={{
                    marginTop: '14px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--color-primary, #6366f1)',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  Usar este medicamento →
                </button>
              </div>
            ))}

            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setImagePreview(null)
                setSelectedFile(null)
              }}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              ← Escanear outra receita
            </button>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

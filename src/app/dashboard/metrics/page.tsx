import { ShareMetricsDashboard } from '@/components/ShareMetricsDashboard'

export default function MetricsPage() {
  // Em um cenário real, o ID do advogado viria da sessão/autenticação
  const lawyerId = 'lawyer-123' // Placeholder
  
  return (
    <div className="container mx-auto py-6">
      <ShareMetricsDashboard 
        profileId={lawyerId}
        profileType="lawyer"
      />
    </div>
  )
}
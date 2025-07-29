'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AlertTriangle, CheckCircle, Info, FileText, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ContractAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  summary: string
  keyTerms: string[]
  redFlags: string[]
  favorableTerms: string[]
  recommendations: string[]
}

export default function ContractResults() {
  const params = useParams()
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContractData()
  }, [params.id])

  const loadContractData = async () => {
    try {
      // Fetch contract details
      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', params.id)
        .single()

      if (contractError) throw contractError
      setContract(contractData)

      // Fetch analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from('contract_analyses')
        .select('*')
        .eq('contract_id', params.id)
        .single()

      if (analysisError) throw analysisError

      setAnalysis({
        riskLevel: analysisData.risk_level,
        riskScore: contractData.risk_score,
        summary: analysisData.summary,
        keyTerms: analysisData.key_terms,
        redFlags: analysisData.red_flags,
        favorableTerms: analysisData.favorable_terms,
        recommendations: analysisData.recommendations
      })
    } catch (error) {
      console.error('Error loading contract:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your contract...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return <div>Contract not found</div>
  }

  // Color coding for risk levels
  const riskColors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red'
  }

  const riskColor = riskColors[analysis.riskLevel]

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Contract Analysis Results</h1>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
        </div>
        <p className="text-gray-600">{contract?.file_name}</p>
      </div>

      {/* Risk Score Card */}
      <div className={`bg-${riskColor}-50 border-2 border-${riskColor}-200 rounded-lg p-6 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Risk Level: <span className={`text-${riskColor}-700 uppercase`}>{analysis.riskLevel}</span>
            </h2>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold text-${riskColor}-700`}>
              {analysis.riskScore}
            </div>
            <p className="text-sm text-gray-600 mt-1">Risk Score</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Red Flags */}
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-xl font-semibold">Red Flags</h3>
          </div>
          {analysis.redFlags.length > 0 ? (
            <ul className="space-y-3">
              {analysis.redFlags.map((flag, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span className="text-gray-700">{flag}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No significant red flags found</p>
          )}
        </div>

        {/* Favorable Terms */}
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold">Favorable Terms</h3>
          </div>
          {analysis.favorableTerms.length > 0 ? (
            <ul className="space-y-3">
              {analysis.favorableTerms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span className="text-gray-700">{term}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No notably favorable terms identified</p>
          )}
        </div>
      </div>

      {/* Key Terms */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-semibold">Key Terms Summary</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.keyTerms.map((term, index) => (
            <div key={index} className="bg-white rounded p-3">
              <p className="text-gray-700">{term}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 bg-purple-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Info className="h-6 w-6 text-purple-600 mr-2" />
          <h3 className="text-xl font-semibold">Recommendations</h3>
        </div>
        <ol className="space-y-3">
          {analysis.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="font-medium text-purple-700 mr-2">{index + 1}.</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">Need Legal Advice?</h3>
        <p className="text-gray-600 mb-6">
          While our AI analysis helps identify potential issues, complex contracts may require professional legal review.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Find a Contract Lawyer
        </button>
      </div>
    </div>
  )
}

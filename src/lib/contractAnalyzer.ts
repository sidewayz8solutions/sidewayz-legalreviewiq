// src/lib/contractAnalyzer.ts
import OpenAI from 'openai';

interface ContractAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  keyTerms: string[];
  redFlags: string[];
  favorableTerms: string[];
  recommendations: string[];
  confidence: number;
}

class ContractAnalyzer {
  private openai: OpenAI | null = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize OpenAI client
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        console.warn('⚠️ OpenAI API key not found. Using fallback analysis.');
        this.initialized = true;
        return;
      }

      this.openai = new OpenAI({
        apiKey: apiKey,
      });

      console.log('✅ OpenAI contract analyzer initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      this.initialized = true;
    }
  }

  async analyzeContract(contractText: string): Promise<ContractAnalysis> {
    try {
      await this.initialize();

      // Validate input
      if (!contractText || contractText.trim().length < 100) {
        throw new Error('Contract text is too short or empty');
      }

      // If OpenAI is available, use it
      if (this.openai) {
        return await this.analyzeWithOpenAI(contractText);
      }

      // Otherwise fall back to rule-based analysis
      console.log('Using rule-based analysis fallback...');
      return this.ruleBasedAnalysis(contractText);

    } catch (error) {
      console.error('Contract analysis error:', error);
      return this.ruleBasedAnalysis(contractText);
    }
  }

  private async analyzeWithOpenAI(contractText: string): Promise<ContractAnalysis> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }

    try {
      console.log('🤖 Analyzing contract with OpenAI GPT-4...');

      // Truncate contract if too long (to manage token limits)
      const maxLength = 15000;
      const truncatedText = contractText.length > maxLength 
        ? contractText.substring(0, maxLength) + '...[truncated]'
        : contractText;

      const systemPrompt = `You are an expert legal contract analyst. Analyze the provided contract and return a detailed JSON response with the following structure:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "summary": "A 2-3 sentence executive summary of the contract",
  "keyTerms": ["Array of 5-8 key terms or important clauses"],
  "redFlags": ["Array of 3-5 concerning issues or unfavorable terms"],
  "favorableTerms": ["Array of 3-5 positive or protective terms"],
  "recommendations": ["Array of 4-6 actionable recommendations"],
  "confidence": 0.0 to 1.0 (your confidence in this analysis)
}

Focus on:
- Payment terms and financial obligations
- Liability and indemnification clauses
- Termination conditions
- Intellectual property rights
- Confidentiality requirements
- Dispute resolution mechanisms
- Any unusual or one-sided terms`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this contract:\n\n${truncatedText}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(responseText) as ContractAnalysis;

      // Validate and clean the response
      return {
        riskLevel: this.validateRiskLevel(analysis.riskLevel),
        summary: analysis.summary || 'Contract analysis completed.',
        keyTerms: Array.isArray(analysis.keyTerms) ? analysis.keyTerms.slice(0, 10) : [],
        redFlags: Array.isArray(analysis.redFlags) ? analysis.redFlags.slice(0, 8) : [],
        favorableTerms: Array.isArray(analysis.favorableTerms) ? analysis.favorableTerms.slice(0, 8) : [],
        recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations.slice(0, 8) : [],
        confidence: typeof analysis.confidence === 'number' ? analysis.confidence : 0.85
      };

    } catch (error: any) {
      console.error('OpenAI analysis failed:', error);
      
      // Check for specific error types
      if (error?.response?.status === 429) {
        console.error('⚠️ OpenAI rate limit exceeded');
      } else if (error?.response?.status === 401) {
        console.error('⚠️ OpenAI API key invalid');
      }

      // Fall back to rule-based analysis
      return this.ruleBasedAnalysis(contractText);
    }
  }

  private validateRiskLevel(level: any): 'low' | 'medium' | 'high' | 'critical' {
    const validLevels = ['low', 'medium', 'high', 'critical'];
    return validLevels.includes(level) ? level : 'medium';
  }

  private ruleBasedAnalysis(contractText: string): ContractAnalysis {
    console.log('📋 Performing rule-based contract analysis...');

    const lowerText = contractText.toLowerCase();
    
    // Enhanced risk indicators
    const criticalRiskIndicators = [
      'unlimited liability',
      'personal guarantee',
      'waive all rights',
      'irrevocable',
      'sole discretion',
      'no recourse'
    ];

    const highRiskIndicators = [
      'liquidated damages',
      'automatic renewal',
      'exclusive',
      'non-compete',
      'penalty',
      'indemnify',
      'hold harmless'
    ];

    const mediumRiskIndicators = [
      'termination for convenience',
      'unilateral',
      'discretion',
      'may modify',
      'binding arbitration'
    ];

    const favorableIndicators = [
      'limited liability',
      'mutual',
      'reasonable notice',
      'good faith',
      'force majeure',
      'cure period',
      'cap on liability',
      'warranty',
      'insurance'
    ];

    // Count indicators
    const criticalCount = criticalRiskIndicators.filter(term => lowerText.includes(term)).length;
    const highCount = highRiskIndicators.filter(term => lowerText.includes(term)).length;
    const mediumCount = mediumRiskIndicators.filter(term => lowerText.includes(term)).length;
    const favorableCount = favorableIndicators.filter(term => lowerText.includes(term)).length;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (criticalCount > 0) {
      riskLevel = 'critical';
    } else if (highCount >= 3) {
      riskLevel = 'high';
    } else if (highCount >= 1 || mediumCount >= 2) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    // Extract key terms
    const keyTerms = this.extractKeyTerms(contractText);

    // Generate red flags
    const redFlags: string[] = [];
    criticalRiskIndicators.forEach(indicator => {
      if (lowerText.includes(indicator)) {
        redFlags.push(`⚠️ Critical: Contains "${indicator}" clause`);
      }
    });
    highRiskIndicators.forEach(indicator => {
      if (lowerText.includes(indicator) && redFlags.length < 5) {
        redFlags.push(`Contains "${indicator}" provision`);
      }
    });

    if (redFlags.length === 0) {
      redFlags.push('No major red flags identified in rule-based scan');
    }

    // Generate favorable terms
    const favorableTerms: string[] = [];
    favorableIndicators.forEach(indicator => {
      if (lowerText.includes(indicator) && favorableTerms.length < 5) {
        favorableTerms.push(`Includes "${indicator}" protection`);
      }
    });

    if (favorableTerms.length === 0) {
      favorableTerms.push('Standard contract structure maintained');
    }

    // Generate summary
    const wordCount = contractText.split(/\s+/).length;
    const summary = `This ${riskLevel}-risk contract contains ${wordCount} words and has been analyzed using rule-based pattern matching. ${redFlags.length} potential issues and ${favorableTerms.length} favorable terms were identified. Professional legal review is recommended for comprehensive analysis.`;

    // Generate recommendations
    const recommendations = this.generateRecommendations(riskLevel, redFlags.length, favorableTerms.length);

    return {
      riskLevel,
      summary,
      keyTerms,
      redFlags,
      favorableTerms,
      recommendations,
      confidence: 0.65 // Lower confidence for rule-based
    };
  }

  private extractKeyTerms(contractText: string): string[] {
    const keyTerms: string[] = [];
    const text = contractText.toLowerCase();

    // Common contract sections to look for
    const sections = [
      { pattern: /payment|compensation|fee|price/, term: 'Payment Terms' },
      { pattern: /term|duration|period|effective/, term: 'Contract Duration' },
      { pattern: /termination|terminate|end|cancel/, term: 'Termination Clause' },
      { pattern: /confidential|proprietary|nda/, term: 'Confidentiality' },
      { pattern: /intellectual property|copyright|patent/, term: 'IP Rights' },
      { pattern: /liability|damages|indemnif/, term: 'Liability Terms' },
      { pattern: /warranty|guarantee|represent/, term: 'Warranties' },
      { pattern: /dispute|arbitration|litigation/, term: 'Dispute Resolution' }
    ];

    sections.forEach(({ pattern, term }) => {
      if (pattern.test(text)) {
        keyTerms.push(term);
      }
    });

    return keyTerms.length > 0 ? keyTerms : ['General Contract Terms'];
  }

  private generateRecommendations(
    riskLevel: string, 
    redFlagCount: number, 
    favorableCount: number
  ): string[] {
    const recommendations: string[] = [];

    // Risk-based recommendations
    switch (riskLevel) {
      case 'critical':
        recommendations.push('🚨 Immediate legal counsel review required');
        recommendations.push('❌ Do not sign without significant modifications');
        recommendations.push('📋 Document all concerns before negotiation');
        break;
      case 'high':
        recommendations.push('⚖️ Professional legal review strongly recommended');
        recommendations.push('🔄 Negotiate high-risk clauses before signing');
        recommendations.push('📊 Assess financial impact of liability terms');
        break;
      case 'medium':
        recommendations.push('📖 Careful review of flagged sections advised');
        recommendations.push('✏️ Consider negotiating specific terms');
        recommendations.push('📝 Document any modifications needed');
        break;
      case 'low':
        recommendations.push('✅ Standard review process sufficient');
        recommendations.push('👀 Verify terms align with expectations');
        break;
    }

    // Add context-specific recommendations
    if (redFlagCount > favorableCount) {
      recommendations.push('⚠️ Contract appears to favor other party - negotiate for balance');
    }

    if (favorableCount > 2) {
      recommendations.push('💪 Leverage favorable terms in your position');
    }

    recommendations.push('💾 Keep signed copies and all correspondence');

    return recommendations;
  }
}

export const contractAnalyzer = new ContractAnalyzer();
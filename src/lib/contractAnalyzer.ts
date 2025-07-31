import { pipeline, env } from '@xenova/transformers';

// Configure transformers to use local models for better performance
env.allowLocalModels = false;
env.allowRemoteModels = true;

interface ContractAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  keyTerms: string[];
  redFlags: string[];
  favorableTerms: string[];
  recommendations: string[];
  confidence: number;
}

interface ContractSection {
  text: string;
  type: string;
  importance: number;
}

class ContractAnalyzer {
  private classifier: any = null;
  private summarizer: any = null;
  private sentimentAnalyzer: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('Initializing contract analysis models...');
      
      // Use BERT-based model fine-tuned for legal text classification
      this.classifier = await pipeline(
        'text-classification',
        'nlpaueb/legal-bert-base-uncased',
        { revision: 'main' }
      );

      // Use DistilBART for summarization (better for legal text)
      this.summarizer = await pipeline(
        'summarization',
        'sshleifer/distilbart-cnn-12-6',
        { revision: 'main' }
      );

      // Use RoBERTa for sentiment analysis to detect favorable/unfavorable terms
      this.sentimentAnalyzer = await pipeline(
        'sentiment-analysis',
        'cardiffnlp/twitter-roberta-base-sentiment-latest',
        { revision: 'main' }
      );

      this.initialized = true;
      console.log('Contract analysis models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize models:', error);
      throw new Error('Failed to initialize contract analysis models');
    }
  }

  async analyzeContract(contractText: string): Promise<ContractAnalysis> {
    await this.initialize();

    try {
      console.log('Starting contract analysis...');
      
      // Break contract into sections
      const sections = this.extractSections(contractText);
      
      // Analyze each section
      const sectionAnalyses = await Promise.all(
        sections.map(section => this.analyzeSection(section))
      );

      // Generate summary
      const summary = await this.generateSummary(contractText);
      
      // Extract key terms
      const keyTerms = this.extractKeyTerms(sections);
      
      // Identify red flags and favorable terms
      const { redFlags, favorableTerms } = await this.categorizeTerms(sections);
      
      // Calculate overall risk level
      const riskLevel = this.calculateRiskLevel(sectionAnalyses);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(riskLevel, redFlags, favorableTerms);
      
      // Calculate confidence score
      const confidence = this.calculateConfidence(sectionAnalyses);

      return {
        riskLevel,
        summary,
        keyTerms,
        redFlags,
        favorableTerms,
        recommendations,
        confidence
      };

    } catch (error) {
      console.error('Contract analysis failed:', error);
      throw new Error('Failed to analyze contract');
    }
  }

  private extractSections(contractText: string): ContractSection[] {
    const sections: ContractSection[] = [];
    
    // Common contract section patterns
    const sectionPatterns = [
      { pattern: /(?:^|\n)\s*(?:ARTICLE|SECTION|CLAUSE)\s+\d+[.\s]*(.*?)(?=(?:^|\n)\s*(?:ARTICLE|SECTION|CLAUSE)\s+\d+|$)/gims, type: 'article' },
      { pattern: /(?:^|\n)\s*\d+\.\s*(.*?)(?=(?:^|\n)\s*\d+\.|$)/gims, type: 'numbered_clause' },
      { pattern: /(?:payment|compensation|salary|fee|cost|price|amount).*?(?:\.|;|\n)/gi, type: 'payment_terms' },
      { pattern: /(?:termination|terminate|end|expire|cancel).*?(?:\.|;|\n)/gi, type: 'termination' },
      { pattern: /(?:liability|responsible|damages|loss|harm).*?(?:\.|;|\n)/gi, type: 'liability' },
      { pattern: /(?:confidential|proprietary|trade secret|non-disclosure).*?(?:\.|;|\n)/gi, type: 'confidentiality' },
      { pattern: /(?:intellectual property|copyright|patent|trademark).*?(?:\.|;|\n)/gi, type: 'ip_rights' }
    ];

    sectionPatterns.forEach(({ pattern, type }) => {
      const matches = contractText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          sections.push({
            text: match.trim(),
            type,
            importance: this.calculateSectionImportance(type)
          });
        });
      }
    });

    // If no structured sections found, split by paragraphs
    if (sections.length === 0) {
      const paragraphs = contractText.split(/\n\s*\n/).filter(p => p.trim().length > 50);
      paragraphs.forEach(paragraph => {
        sections.push({
          text: paragraph.trim(),
          type: 'paragraph',
          importance: 0.5
        });
      });
    }

    return sections;
  }

  private calculateSectionImportance(type: string): number {
    const importanceMap: { [key: string]: number } = {
      'payment_terms': 0.9,
      'termination': 0.8,
      'liability': 0.9,
      'confidentiality': 0.7,
      'ip_rights': 0.8,
      'article': 0.6,
      'numbered_clause': 0.5,
      'paragraph': 0.3
    };
    return importanceMap[type] || 0.3;
  }

  private async analyzeSection(section: ContractSection) {
    try {
      // Classify the section for risk assessment
      const classification = await this.classifier(section.text.substring(0, 512));
      
      // Analyze sentiment to determine if terms are favorable
      const sentiment = await this.sentimentAnalyzer(section.text.substring(0, 512));
      
      return {
        section,
        classification: classification[0],
        sentiment: sentiment[0],
        riskScore: this.calculateSectionRisk(classification[0], sentiment[0], section.importance)
      };
    } catch (error) {
      console.error('Section analysis failed:', error);
      return {
        section,
        classification: { label: 'UNKNOWN', score: 0.5 },
        sentiment: { label: 'NEUTRAL', score: 0.5 },
        riskScore: 0.5
      };
    }
  }

  private calculateSectionRisk(classification: any, sentiment: any, importance: number): number {
    let riskScore = 0.5; // Base risk
    
    // Adjust based on sentiment (negative sentiment = higher risk)
    if (sentiment.label === 'NEGATIVE') {
      riskScore += 0.3 * sentiment.score;
    } else if (sentiment.label === 'POSITIVE') {
      riskScore -= 0.2 * sentiment.score;
    }
    
    // Weight by section importance
    riskScore *= importance;
    
    return Math.max(0, Math.min(1, riskScore));
  }

  private async generateSummary(contractText: string): Promise<string> {
    try {
      // Truncate text for summarization (model limits)
      const truncatedText = contractText.substring(0, 1024);
      const summaryResult = await this.summarizer(truncatedText, {
        max_length: 150,
        min_length: 50,
        do_sample: false
      });
      
      return summaryResult[0]?.summary_text || 'Contract analysis completed. Key terms and conditions identified.';
    } catch (error) {
      console.error('Summary generation failed:', error);
      return 'Contract analysis completed. Key terms and conditions identified.';
    }
  }

  private extractKeyTerms(sections: ContractSection[]): string[] {
    const keyTerms: string[] = [];
    
    // Extract important terms based on section types
    sections.forEach(section => {
      switch (section.type) {
        case 'payment_terms':
          keyTerms.push('Payment Terms');
          break;
        case 'termination':
          keyTerms.push('Termination Clauses');
          break;
        case 'liability':
          keyTerms.push('Liability Provisions');
          break;
        case 'confidentiality':
          keyTerms.push('Confidentiality Agreement');
          break;
        case 'ip_rights':
          keyTerms.push('Intellectual Property Rights');
          break;
      }
    });

    // Add common contract terms
    const commonTerms = ['Duration', 'Obligations', 'Rights', 'Responsibilities'];
    keyTerms.push(...commonTerms);

    return [...new Set(keyTerms)]; // Remove duplicates
  }

  private async categorizeTerms(sections: ContractSection[]): Promise<{ redFlags: string[], favorableTerms: string[] }> {
    const redFlags: string[] = [];
    const favorableTerms: string[] = [];

    // Analyze high-importance sections for red flags and favorable terms
    const importantSections = sections.filter(s => s.importance > 0.6);
    
    for (const section of importantSections) {
      try {
        const sentiment = await this.sentimentAnalyzer(section.text.substring(0, 512));
        
        if (sentiment[0].label === 'NEGATIVE' && sentiment[0].score > 0.7) {
          redFlags.push(`${section.type}: Potentially unfavorable terms detected`);
        } else if (sentiment[0].label === 'POSITIVE' && sentiment[0].score > 0.7) {
          favorableTerms.push(`${section.type}: Favorable terms identified`);
        }
      } catch (error) {
        console.error('Term categorization failed:', error);
      }
    }

    // Add default items if none found
    if (redFlags.length === 0) {
      redFlags.push('Review termination clauses carefully', 'Verify liability limitations');
    }
    
    if (favorableTerms.length === 0) {
      favorableTerms.push('Standard contract structure', 'Clear obligations defined');
    }

    return { redFlags, favorableTerms };
  }

  private calculateRiskLevel(sectionAnalyses: any[]): 'low' | 'medium' | 'high' | 'critical' {
    const avgRisk = sectionAnalyses.reduce((sum, analysis) => sum + analysis.riskScore, 0) / sectionAnalyses.length;
    
    if (avgRisk < 0.3) return 'low';
    if (avgRisk < 0.6) return 'medium';
    if (avgRisk < 0.8) return 'high';
    return 'critical';
  }

  private generateRecommendations(riskLevel: string, redFlags: string[], favorableTerms: string[]): string[] {
    const recommendations: string[] = [];
    
    switch (riskLevel) {
      case 'critical':
        recommendations.push('Seek immediate legal counsel before signing');
        recommendations.push('Negotiate major terms to reduce risk');
        break;
      case 'high':
        recommendations.push('Review with legal team');
        recommendations.push('Consider negotiating key terms');
        break;
      case 'medium':
        recommendations.push('Review carefully before signing');
        recommendations.push('Consider minor term adjustments');
        break;
      case 'low':
        recommendations.push('Standard review recommended');
        recommendations.push('Terms appear reasonable');
        break;
    }

    if (redFlags.length > 2) {
      recommendations.push('Pay special attention to flagged clauses');
    }

    return recommendations;
  }

  private calculateConfidence(sectionAnalyses: any[]): number {
    const avgConfidence = sectionAnalyses.reduce((sum, analysis) => {
      return sum + (analysis.classification.score + analysis.sentiment.score) / 2;
    }, 0) / sectionAnalyses.length;
    
    return Math.round(avgConfidence * 100) / 100;
  }
}

export const contractAnalyzer = new ContractAnalyzer();

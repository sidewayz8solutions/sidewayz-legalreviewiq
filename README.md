# Sidewayz Legal Review IQ

An AI-powered app that simplifies legal contracts for consumers. Analyzes contracts in 30 seconds or less using GPT-4 to identify risks, key terms, and provide actionable recommendations.

## 🚀 Features

- **AI Contract Analysis**: Powered by OpenAI GPT-4 for comprehensive contract review
- **Risk Assessment**: Automated risk scoring and level classification
- **Key Terms Extraction**: Identifies important clauses and provisions
- **Red Flag Detection**: Highlights concerning terms that may favor the other party
- **Recommendations**: Provides specific actions to take before signing
- **File Support**: Handles PDF and DOCX contract uploads
- **Secure Processing**: Files are processed securely and deleted after analysis

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sidewayz8solutions/sidewayz-legalreviewiq.git
cd sidewayz-legalreviewiq
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (see above)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### OpenAI API Key Setup

1. Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file as `OPENAI_API_KEY`

**Note**: The current API key in the codebase is invalid and needs to be replaced.

### Supabase Database Setup

The application requires the following database tables:
- `organizations` - Store organization data
- `users` - User management (linked to Supabase Auth)
- `contracts` - Contract metadata and status
- `contract_analyses` - AI analysis results
- `usage_events` - Usage tracking for billing

### Testing the Contract Analyzer

To test if everything is working:

1. Navigate to `/dashboard/contracts/upload`
2. Upload a PDF or DOCX contract
3. Wait for analysis to complete
4. View results at `/dashboard/contracts/[id]`

## 🐛 Troubleshooting

### Common Issues

1. **"OpenAI API key is invalid"**
   - Check that your API key is correct and has sufficient credits
   - Ensure the key has access to GPT-4 models

2. **Database foreign key errors**
   - Ensure test organization exists in database
   - Run the setup endpoint: `POST /api/setup-test-data`

3. **PDF parsing errors**
   - Ensure uploaded file is a valid PDF or DOCX
   - Check file size is under 10MB

### Testing Endpoints

- `GET /api/test-env` - Check environment configuration
- `POST /api/setup-test-data` - Create test data
- `POST /api/test-analyze-mock` - Test with mock AI analysis

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-contract/     # Main contract analysis endpoint
│   │   ├── test-analyze/         # Test endpoint with real OpenAI
│   │   └── test-analyze-mock/    # Test endpoint with mock analysis
│   ├── dashboard/
│   │   └── contracts/
│   │       ├── upload/           # Contract upload interface
│   │       └── [id]/            # Analysis results display
│   └── globals.css
├── components/                   # Reusable UI components
├── contexts/                     # React contexts
└── lib/
    └── supabase.ts              # Supabase client configuration
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

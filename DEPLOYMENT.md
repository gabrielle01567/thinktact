# ThinkTact Deployment Guide

This guide provides instructions for deploying the ThinkTact application to various platforms and integrating with services like Stripe.

## Deployment Options

ThinkTact can be deployed to several platforms:

1. **Vercel** (Recommended for Next.js apps)
2. **AWS** (S3 + CloudFront + Lambda)
3. **Custom server**

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Git

## Deployment Scripts

We've added several deployment scripts to the `package.json` file:

```json
"scripts": {
  "deploy": "bash deploy.sh",
  "deploy:aws": "npm run build && aws s3 sync .next/static/ s3://YOUR_BUCKET_NAME/_next/static/ && aws s3 sync out/ s3://YOUR_BUCKET_NAME/",
  "deploy:vercel": "vercel --prod",
  "deploy:staging": "vercel"
}
```

## Deploying to Vercel

Vercel is the easiest platform for deploying Next.js applications.

### Manual Deployment

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   npm run deploy:vercel
   ```

### Automatic Deployment with GitHub

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy when you push to the main branch

## Deploying to AWS

### Setup

1. Install the AWS CLI:
   ```bash
   pip install awscli
   ```

2. Configure your AWS credentials:
   ```bash
   aws configure
   ```
   You'll be prompted for:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region
   - Default output format

3. Update the deployment script with your AWS details:
   - Edit `deploy.sh` and `package.json` to replace placeholder values with your actual AWS resource names

### Manual Deployment

Run the deployment script:
```bash
npm run deploy:aws
```

### Automatic Deployment with GitHub Actions

We've included a GitHub Actions workflow file (`.github/workflows/deploy.yml`) that can automatically deploy to AWS or Vercel when you push to the main branch.

To use it:

1. Add the following secrets to your GitHub repository:
   - For AWS:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION`
     - `AWS_S3_BUCKET`
     - `AWS_CLOUDFRONT_ID` (if using CloudFront)
   
   - For Vercel:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

2. Uncomment the relevant sections in the workflow file

## Stripe Integration

### Setting Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add the keys to your environment variables:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Testing Webhooks Locally

1. Install the Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Log in to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks
   ```

## Environment Variables

Create a `.env.local` file with the following variables:

```
# API Keys
MISTRAL_API_KEY=your_mistral_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# AWS (if using)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region

# Vercel (if using)
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## Troubleshooting

### Common Issues

1. **Build failures**: Make sure all dependencies are installed and environment variables are set correctly
2. **AWS access denied**: Check your IAM permissions and credentials
3. **Stripe webhook errors**: Ensure your webhook secret is correct and the endpoint is properly configured

### Getting Help

If you encounter issues, check:
- AWS CloudWatch Logs
- Vercel deployment logs
- Stripe webhook logs in the Stripe Dashboard

## Security Best Practices

1. Never commit sensitive credentials to your repository
2. Use environment variables for all secrets
3. Set up proper IAM roles with least privilege access
4. Regularly rotate your API keys 
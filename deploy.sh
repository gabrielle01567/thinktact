#!/bin/bash
# ThinkTact Deployment Script
# This script builds and deploys the ThinkTact application to AWS

# Exit immediately if a command exits with a non-zero status
set -e

# Print commands before executing them
set -x

echo "🚀 Starting ThinkTact deployment process..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Step 2: Run tests (if you have tests)
echo "🧪 Running tests..."
# Uncomment the line below if you have tests
# npm test

# Step 3: Build the application
echo "🏗️ Building the application..."
npm run build

# Step 4: Export the application (for static hosting)
# Uncomment if you're using Next.js static export
# echo "📤 Exporting static files..."
# npm run export

# Step 5: Deploy to AWS S3
echo "☁️ Deploying to AWS S3..."
# Replace YOUR_BUCKET_NAME with your actual S3 bucket name
# aws s3 sync out/ s3://YOUR_BUCKET_NAME/ --delete

# Step 6: Invalidate CloudFront cache (if using CloudFront)
echo "🔄 Invalidating CloudFront cache..."
# Replace YOUR_DISTRIBUTION_ID with your actual CloudFront distribution ID
# aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# Step 7: Update any AWS Lambda functions (if applicable)
echo "λ Updating Lambda functions..."
# aws lambda update-function-code --function-name YOUR_FUNCTION_NAME --zip-file fileb://function.zip

# Step 8: Deploy to Vercel (alternative to AWS)
echo "🔼 Deploying to Vercel..."
# Uncomment if you want to deploy to Vercel instead of or in addition to AWS
# npx vercel --prod

echo "✅ Deployment completed successfully!"

# =====================================================================
# IMPORTANT: Before using this script, you need to:
# 
# 1. Install the AWS CLI:
#    npm install -g aws-cli
#
# 2. Configure your AWS credentials:
#    aws configure
#    (You'll be prompted for your AWS Access Key ID, Secret Access Key, 
#     default region, and output format)
#
# 3. Replace the placeholder values:
#    - YOUR_BUCKET_NAME: Your S3 bucket name
#    - YOUR_DISTRIBUTION_ID: Your CloudFront distribution ID
#    - YOUR_FUNCTION_NAME: Your Lambda function name (if applicable)
#
# 4. Make this script executable:
#    chmod +x deploy.sh
#
# 5. Run the script:
#    ./deploy.sh
# ===================================================================== 
// This file provides a mock response for development and testing

export const mockAnalysisResponse = {
  overallStrength: 65,
  fallacies: [
    {
      name: "Appeal to Authority",
      description: "Relying on the opinion of an authority figure rather than addressing the actual argument.",
      occurrence: "Dr. Smith, a renowned expert, says this treatment is effective.",
    },
    {
      name: "Hasty Generalization",
      description: "Drawing a conclusion based on insufficient or unrepresentative evidence.",
      occurrence: "I know three people who tried this diet and lost weight, so it must work for everyone.",
    },
  ],
  strengths: [
    "Clear presentation of the main claim",
    "Logical structure with premises leading to conclusion",
    "Use of some relevant evidence to support claims",
  ],
  weaknesses: [
    "Over-reliance on authority figures rather than empirical evidence",
    "Some claims lack sufficient supporting evidence",
    "Fails to address potential counterarguments",
  ],
  suggestions: [
    "Include more empirical evidence rather than relying on expert opinions",
    "Address potential counterarguments to strengthen your position",
    "Provide more specific examples to support your generalizations",
    "Clarify the causal relationship between your premises and conclusion",
  ],
  structure: {
    premises: [
      "Dr. Smith endorses this treatment",
      "Three people have had success with this approach",
      "The treatment has been used for many years",
    ],
    conclusion: "Therefore, this treatment is effective and should be widely adopted",
    isValid: false,
  },
}


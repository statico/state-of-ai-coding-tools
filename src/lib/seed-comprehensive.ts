import { QuestionService } from './services/question'
import { QuestionType } from '@prisma/client'

// Demographics Questions (from State of JS)
const demographicsQuestions = [
  {
    title: 'What is your age?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Under 18',
      '18-24',
      '25-34',
      '35-44',
      '45-54',
      '55-64',
      '65 or older',
      'Prefer not to say',
    ],
  },
  {
    title: 'What is your gender?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Man',
      'Woman',
      'Non-binary',
      'Prefer to self-describe',
      'Prefer not to say',
    ],
  },
  {
    title: 'What is your country or region?',
    type: QuestionType.TEXT,
    category: 'demographics',
  },
  {
    title: 'What is your primary language?',
    type: QuestionType.TEXT,
    category: 'demographics',
  },
  {
    title: 'How many years of professional experience do you have?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Less than 1 year',
      '1-2 years',
      '3-5 years',
      '6-10 years',
      '11-15 years',
      '16-20 years',
      'More than 20 years',
      'Not a professional developer',
    ],
  },
  {
    title: 'What is your company size?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Just me (freelance/contractor)',
      '2-5 people',
      '6-10 people',
      '11-20 people',
      '21-50 people',
      '51-100 people',
      '101-500 people',
      '501-1000 people',
      'More than 1000 people',
      'Not applicable',
    ],
  },
  {
    title: 'What is your annual salary in USD?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Less than $10,000',
      '$10,000 - $30,000',
      '$30,000 - $50,000',
      '$50,000 - $75,000',
      '$75,000 - $100,000',
      '$100,000 - $150,000',
      '$150,000 - $200,000',
      'More than $200,000',
      'Not applicable',
      'Prefer not to say',
    ],
  },
  {
    title: 'What is your highest level of education?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'No formal education',
      'High school diploma',
      'Some college/university',
      "Bachelor's degree",
      "Master's degree",
      'Doctoral degree',
      'Other professional degree',
      'Prefer not to say',
    ],
  },
  {
    title: 'Do you have any disabilities?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: 'demographics',
    options: [
      'Visual impairment',
      'Hearing impairment',
      'Mobility impairment',
      'Cognitive impairment',
      'Other disability',
      'No disabilities',
      'Prefer not to say',
    ],
  },
]

// IDEs and Editors
const ideTools = [
  { name: 'Cursor', description: 'AI-first code editor' },
  { name: 'Windsurf', description: 'AI-powered IDE by Codeium' },
  { name: 'VS Code', description: 'Visual Studio Code' },
  { name: 'IntelliJ IDEA', description: 'JetBrains IDE' },
  { name: 'WebStorm', description: 'JavaScript IDE by JetBrains' },
  { name: 'PyCharm', description: 'Python IDE by JetBrains' },
  { name: 'Vim/Neovim', description: 'Terminal-based text editor' },
  { name: 'Emacs', description: 'Extensible text editor' },
  { name: 'Sublime Text', description: 'Sophisticated text editor' },
  { name: 'Atom', description: 'Hackable text editor' },
  { name: 'Visual Studio', description: 'Microsoft IDE' },
  { name: 'Xcode', description: 'Apple development IDE' },
  { name: 'Android Studio', description: 'Android development IDE' },
  { name: 'Eclipse', description: 'Open-source IDE' },
  { name: 'Zed', description: 'Collaborative code editor' },
  { name: 'Helix', description: 'Post-modern text editor' },
]

// Code Completion Tools
const completionTools = [
  { name: 'GitHub Copilot', description: 'AI pair programming assistant' },
  { name: 'Gemini Code Assist', description: 'Google AI coding assistant' },
  { name: 'Codeium', description: 'Free AI code completion' },
  { name: 'Tabnine', description: 'AI code completions' },
  { name: 'Amazon CodeWhisperer', description: 'AWS AI coding companion' },
  { name: 'Sourcegraph Cody', description: 'AI coding assistant with context' },
  {
    name: 'JetBrains AI Assistant',
    description: 'Built-in AI for JetBrains IDEs',
  },
  { name: 'Replit Ghostwriter', description: 'Replit AI coding assistant' },
  { name: 'TabbyML', description: 'Open-source code completion' },
  { name: 'Continue', description: 'Open-source AI code assistant' },
  { name: 'Refact.ai', description: 'AI code completion and chat' },
  { name: 'Cody (Sourcegraph)', description: 'Code AI with codebase context' },
  { name: 'Kilo Code', description: 'Open-source VS Code assistant' },
]

// Code Review Tools
const codeReviewTools = [
  { name: 'CodeRabbit', description: 'AI code review for pull requests' },
  {
    name: 'Amazon Q Developer',
    description: 'Code review and security scanning',
  },
  { name: 'DeepSource', description: 'Automated code review platform' },
  { name: 'Codacy', description: 'Automated code review and quality' },
  { name: 'SonarQube', description: 'Code quality and security' },
  { name: 'CodeClimate', description: 'Engineering intelligence platform' },
  { name: 'Snyk', description: 'Security-focused code review' },
  {
    name: 'GitHub Advanced Security',
    description: 'Native GitHub security features',
  },
  { name: 'GitLab Code Review', description: 'Built-in GitLab review tools' },
  { name: 'Reviewable', description: 'GitHub PR review tool' },
  { name: 'Gito', description: 'AI-powered GitHub reviewer' },
  { name: 'Glide', description: 'Structured PR analysis' },
]

// Code Refactoring Tools
const refactoringTools = [
  { name: 'Codiga', description: 'Code analysis and refactoring' },
  { name: 'JetBrains Qodana', description: 'Automated code quality platform' },
  { name: 'Refact.ai', description: 'AI-powered code transformation' },
  { name: 'DeepCode', description: 'Bug detection and refactoring' },
  {
    name: 'Amazon Q Code Transformation',
    description: 'Automated code modernization',
  },
  { name: 'Sourcery', description: 'Python code refactoring' },
  { name: 'ReSharper', description: 'Visual Studio extension for refactoring' },
  { name: 'CodeRush', description: 'Visual Studio productivity tool' },
  { name: 'Rector', description: 'PHP instant upgrades and refactoring' },
  { name: 'OpenRewrite', description: 'Automated code remediation' },
]

// AI Models (from Aider leaderboard)
const aiModels = [
  { name: 'Claude 3.5 Sonnet', description: 'Anthropic flagship model' },
  { name: 'Claude 3 Opus', description: 'Anthropic powerful reasoning model' },
  { name: 'Claude 3.5 Haiku', description: 'Anthropic fast model' },
  { name: 'GPT-4o', description: 'OpenAI multimodal model' },
  { name: 'o1-preview', description: 'OpenAI reasoning model' },
  { name: 'o1-mini', description: 'OpenAI smaller reasoning model' },
  { name: 'GPT-4 Turbo', description: 'OpenAI enhanced GPT-4' },
  { name: 'Gemini 1.5 Pro', description: 'Google large context model' },
  { name: 'Gemini 1.5 Flash', description: 'Google fast model' },
  { name: 'Gemini Experimental', description: 'Google experimental model' },
  { name: 'DeepSeek V3', description: 'DeepSeek latest model' },
  { name: 'Qwen 2.5 Coder', description: 'Alibaba coding model' },
  { name: 'Llama 3.1 405B', description: 'Meta large open model' },
  { name: 'Llama 3.1 70B', description: 'Meta medium open model' },
  { name: 'Mistral Large', description: 'Mistral AI flagship model' },
  { name: 'Codestral', description: 'Mistral AI code model' },
]

// Additional questions
const additionalQuestions = [
  {
    title: 'What percentage of your code is AI-assisted?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'usage',
    options: [
      'None',
      'Less than 10%',
      '10-25%',
      '25-50%',
      '50-75%',
      'More than 75%',
    ],
  },
  {
    title: 'What are your primary use cases for AI coding tools?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: 'usage',
    options: [
      'Code completion',
      'Bug fixing',
      'Code refactoring',
      'Code review',
      'Documentation generation',
      'Test generation',
      'Learning new languages/frameworks',
      'Boilerplate generation',
      'Architecture design',
      'Performance optimization',
    ],
  },
  {
    title: 'What are your biggest concerns about AI coding tools?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: 'concerns',
    options: [
      'Code quality and correctness',
      'Security vulnerabilities',
      'Over-reliance on AI',
      'Privacy and data concerns',
      'Cost',
      'Learning curve',
      'Integration complexity',
      'Performance impact',
      'Licensing and IP concerns',
      'Job security',
    ],
  },
  {
    title: 'How has AI impacted your productivity?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'impact',
    options: [
      'Significantly decreased',
      'Slightly decreased',
      'No change',
      'Slightly increased',
      'Significantly increased',
      'Too early to tell',
    ],
  },
  {
    title: 'What features would you like to see in AI coding tools?',
    type: QuestionType.TEXT,
    category: 'feedback',
  },
]

export async function seedComprehensiveQuestions() {
  console.log('🌱 Starting comprehensive survey seeding...')

  // Clear existing questions
  console.log('🧹 Clearing existing questions...')
  await QuestionService.clearAll()

  let globalOrderIndex = 1

  // Seed demographics questions
  console.log('👥 Seeding demographics questions...')
  for (const q of demographicsQuestions) {
    const question = await QuestionService.create({
      title: q.title,
      type: q.type,
      category: q.category,
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })

    if (q.options) {
      for (let i = 0; i < q.options.length; i++) {
        await QuestionService.createOption({
          questionId: question.id,
          value: q.options[i].toLowerCase().replace(/\s+/g, '_'),
          label: q.options[i],
          orderIndex: i + 1,
          isActive: true,
        })
      }
    }
  }

  // Seed IDE questions
  console.log('💻 Seeding IDE questions...')
  for (const tool of ideTools) {
    await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'ides',
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })
  }

  // Seed completion tools
  console.log('🤖 Seeding completion tools questions...')
  for (const tool of completionTools) {
    await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'completion_tools',
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })
  }

  // Seed code review tools
  console.log('🔍 Seeding code review tools questions...')
  for (const tool of codeReviewTools) {
    await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'code_review',
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })
  }

  // Seed refactoring tools
  console.log('🔧 Seeding refactoring tools questions...')
  for (const tool of refactoringTools) {
    await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'refactoring',
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })
  }

  // Seed AI models
  console.log('🧠 Seeding AI models questions...')
  for (const model of aiModels) {
    await QuestionService.create({
      title: model.name,
      description: model.description,
      type: QuestionType.EXPERIENCE,
      category: 'models',
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })
  }

  // Seed additional questions
  console.log('➕ Seeding additional questions...')
  for (const q of additionalQuestions) {
    const question = await QuestionService.create({
      title: q.title,
      type: q.type,
      category: q.category,
      orderIndex: globalOrderIndex++,
      isRequired: false,
      isActive: true,
    })

    if (q.options) {
      for (let i = 0; i < q.options.length; i++) {
        await QuestionService.createOption({
          questionId: question.id,
          value: q.options[i].toLowerCase().replace(/\s+/g, '_'),
          label: q.options[i],
          orderIndex: i + 1,
          isActive: true,
        })
      }
    }
  }

  console.log(`✅ Successfully seeded ${globalOrderIndex - 1} questions!`)
  console.log('📊 Categories seeded:')
  console.log('   - Demographics:', demographicsQuestions.length)
  console.log('   - IDEs:', ideTools.length)
  console.log('   - Completion Tools:', completionTools.length)
  console.log('   - Code Review Tools:', codeReviewTools.length)
  console.log('   - Refactoring Tools:', refactoringTools.length)
  console.log('   - AI Models:', aiModels.length)
  console.log('   - Additional Questions:', additionalQuestions.length)
}

if (require.main === module) {
  seedComprehensiveQuestions()
    .then(() => {
      console.log('🎉 Comprehensive seeding finished!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

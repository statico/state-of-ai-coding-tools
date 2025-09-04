import { QuestionService } from './services/question'
import { QuestionType } from '@prisma/client'

const aiCodingTools = [
  { name: 'GitHub Copilot', description: 'AI pair programming assistant' },
  { name: 'ChatGPT', description: 'OpenAI conversational AI for coding help' },
  { name: 'Claude', description: 'Anthropic AI assistant for coding' },
  { name: 'Cursor', description: 'AI-powered code editor' },
  { name: 'Windsurf', description: 'AI coding IDE' },
  { name: 'Codeium', description: 'Free AI code completion tool' },
  { name: 'Amazon CodeWhisperer', description: 'AWS AI coding companion' },
  {
    name: 'Sourcegraph Cody',
    description: 'AI coding assistant with codebase context',
  },
  {
    name: 'JetBrains AI Assistant',
    description: 'Built-in AI for JetBrains IDEs',
  },
  { name: 'Tabnine', description: 'AI code completion' },
  { name: 'Replit Ghostwriter', description: 'Replit AI coding assistant' },
  { name: 'Perplexity AI', description: 'AI search for development' },
  { name: 'Phind', description: 'AI search engine for developers' },
  { name: 'Google Gemini', description: 'Google AI for coding assistance' },
  { name: 'Microsoft Copilot', description: 'Microsoft AI assistant' },
]

const developmentTools = [
  { name: 'VS Code', description: 'Visual Studio Code editor' },
  { name: 'IntelliJ IDEA', description: 'JetBrains IDE' },
  { name: 'Vim/Neovim', description: 'Terminal-based editor' },
  { name: 'Sublime Text', description: 'Text editor' },
  { name: 'Docker', description: 'Containerization platform' },
  { name: 'Kubernetes', description: 'Container orchestration' },
  { name: 'Terraform', description: 'Infrastructure as code' },
  { name: 'GitHub Actions', description: 'CI/CD platform' },
  { name: 'GitLab CI', description: 'CI/CD platform' },
  { name: 'Jenkins', description: 'Automation server' },
]

const frameworks = [
  { name: 'React', description: 'Frontend framework' },
  { name: 'Vue.js', description: 'Progressive framework' },
  { name: 'Angular', description: 'Platform for web apps' },
  { name: 'Next.js', description: 'React framework' },
  { name: 'Express.js', description: 'Node.js framework' },
  { name: 'Django', description: 'Python web framework' },
  { name: 'FastAPI', description: 'Modern Python API framework' },
  { name: 'Spring Boot', description: 'Java framework' },
  { name: 'Rails', description: 'Ruby framework' },
  { name: 'Laravel', description: 'PHP framework' },
]

export async function seedAIToolQuestions() {
  console.log('Seeding AI tool experience questions...')

  // Create experience questions for AI coding tools
  let orderIndex = 1
  for (const tool of aiCodingTools) {
    const question = await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'ai_tools',
      orderIndex: orderIndex++,
      isRequired: false,
      isActive: true,
    })

    // Create the 4 standard options for experience questions
    const experienceOptions = [
      { value: 'never_heard', label: 'Never heard of it' },
      {
        value: 'heard_not_interested',
        label: "Heard of it, but I'm not interested",
      },
      {
        value: 'used_wont_use_again',
        label: "Used it, but wouldn't use it again",
      },
      {
        value: 'used_would_use_again',
        label: 'Used it and would use it again',
      },
    ]

    for (let i = 0; i < experienceOptions.length; i++) {
      await QuestionService.createOption({
        questionId: question.id,
        value: experienceOptions[i].value,
        label: experienceOptions[i].label,
        orderIndex: i + 1,
        isActive: true,
      })
    }
  }

  // Create experience questions for development tools
  orderIndex = 1
  for (const tool of developmentTools) {
    const question = await QuestionService.create({
      title: tool.name,
      description: tool.description,
      type: QuestionType.EXPERIENCE,
      category: 'tools',
      orderIndex: orderIndex++,
      isRequired: false,
      isActive: true,
    })

    const experienceOptions = [
      { value: 'never_heard', label: 'Never heard of it' },
      {
        value: 'heard_not_interested',
        label: "Heard of it, but I'm not interested",
      },
      {
        value: 'used_wont_use_again',
        label: "Used it, but wouldn't use it again",
      },
      {
        value: 'used_would_use_again',
        label: 'Used it and would use it again',
      },
    ]

    for (let i = 0; i < experienceOptions.length; i++) {
      await QuestionService.createOption({
        questionId: question.id,
        value: experienceOptions[i].value,
        label: experienceOptions[i].label,
        orderIndex: i + 1,
        isActive: true,
      })
    }
  }

  // Add questions from AI workshop survey
  const workshopQuestions = [
    {
      title: 'What is your primary use case for AI coding tools?',
      type: QuestionType.SINGLE_CHOICE,
      category: 'preferences',
      options: [
        'Code completion and suggestions',
        'Bug fixing and debugging',
        'Code refactoring',
        'Documentation generation',
        'Learning new languages/frameworks',
        'Test generation',
        'Code review',
        'Other',
      ],
    },
    {
      title: 'What are your biggest concerns about AI coding tools?',
      type: QuestionType.MULTIPLE_CHOICE,
      category: 'challenges',
      options: [
        'Code quality and correctness',
        'Security vulnerabilities',
        'Over-reliance on AI',
        'Privacy and data concerns',
        'Cost',
        'Learning curve',
        'Integration with existing tools',
        'Performance impact',
        'Licensing and IP concerns',
      ],
    },
    {
      title: 'How comfortable are you with AI-generated code?',
      type: QuestionType.SINGLE_CHOICE,
      category: 'preferences',
      options: [
        'Very uncomfortable - I avoid it',
        'Somewhat uncomfortable - I use it cautiously',
        'Neutral - I use it when helpful',
        'Comfortable - I use it regularly',
        'Very comfortable - Essential to my workflow',
      ],
    },
    {
      title: 'What percentage of your code is AI-assisted?',
      type: QuestionType.SINGLE_CHOICE,
      category: 'workflow',
      options: ['Less than 10%', '10-25%', '25-50%', '50-75%', 'More than 75%'],
    },
  ]

  for (const q of workshopQuestions) {
    const question = await QuestionService.create({
      title: q.title,
      type: q.type,
      category: q.category,
      orderIndex: orderIndex++,
      isRequired: false,
      isActive: true,
    })

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

  console.log('AI tool questions seeded successfully!')
}

if (require.main === module) {
  seedAIToolQuestions()
    .then(() => {
      console.log('Seeding finished!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Seeding failed:', error)
      process.exit(1)
    })
}

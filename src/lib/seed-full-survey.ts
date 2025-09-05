import { PrismaClient, QuestionType } from '@prisma/client'

const prisma = new PrismaClient()

// Demographics Questions
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
    title: 'What is your role?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Frontend Engineering',
      'Backend Engineering',
      'Full-Stack Engineering',
      'Mobile Engineering',
      'DevOps/SRE',
      'Data Science/ML',
      'Product Management',
      'Design/UX',
      'QA/Testing',
      'Technical Writing',
      'Developer Relations',
      'Engineering Management',
      'Executive (CTO, VP Eng, etc.)',
      'Support/Solutions',
      'Student',
      'Hobbyist',
      'Other',
    ],
  },
  {
    title: 'What is your country or region?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Antigua and Barbuda',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Bosnia and Herzegovina',
      'Botswana',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Cape Verde',
      'Central African Republic',
      'Chad',
      'Chile',
      'China',
      'Colombia',
      'Comoros',
      'Congo',
      'Costa Rica',
      'Croatia',
      'Cuba',
      'Cyprus',
      'Czech Republic',
      'Denmark',
      'Djibouti',
      'Dominica',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
      'Fiji',
      'Finland',
      'France',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Grenada',
      'Guatemala',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Honduras',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland',
      'Israel',
      'Italy',
      'Ivory Coast',
      'Jamaica',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kiribati',
      'Kosovo',
      'Kuwait',
      'Kyrgyzstan',
      'Laos',
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Marshall Islands',
      'Mauritania',
      'Mauritius',
      'Mexico',
      'Micronesia',
      'Moldova',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Morocco',
      'Mozambique',
      'Myanmar',
      'Namibia',
      'Nauru',
      'Nepal',
      'Netherlands',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'North Korea',
      'North Macedonia',
      'Norway',
      'Oman',
      'Pakistan',
      'Palau',
      'Palestine',
      'Panama',
      'Papua New Guinea',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Qatar',
      'Romania',
      'Russia',
      'Rwanda',
      'Saint Kitts and Nevis',
      'Saint Lucia',
      'Saint Vincent and the Grenadines',
      'Samoa',
      'San Marino',
      'Sao Tome and Principe',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Slovakia',
      'Slovenia',
      'Solomon Islands',
      'Somalia',
      'South Africa',
      'South Korea',
      'South Sudan',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Suriname',
      'Sweden',
      'Switzerland',
      'Syria',
      'Taiwan',
      'Tajikistan',
      'Tanzania',
      'Thailand',
      'Timor-Leste',
      'Togo',
      'Tonga',
      'Trinidad and Tobago',
      'Tunisia',
      'Turkey',
      'Turkmenistan',
      'Tuvalu',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United Kingdom',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Vatican City',
      'Venezuela',
      'Vietnam',
      'Yemen',
      'Zambia',
      'Zimbabwe',
    ],
  },
  {
    title: 'What is your primary programming language?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'demographics',
    options: [
      'ABAP',
      'Ada',
      'Assembly',
      'Bash/Shell',
      'C',
      'C#',
      'C++',
      'COBOL',
      'Clojure',
      'Crystal',
      'D',
      'Dart',
      'Delphi/Object Pascal',
      'Elixir',
      'Elm',
      'Erlang',
      'F#',
      'Fortran',
      'Go',
      'Groovy',
      'Haskell',
      'Java',
      'JavaScript',
      'Julia',
      'Kotlin',
      'Lisp',
      'Lua',
      'MATLAB',
      'Nim',
      'Objective-C',
      'OCaml',
      'PHP',
      'Perl',
      'PowerShell',
      'Prolog',
      'Python',
      'R',
      'Ruby',
      'Rust',
      'SAS',
      'Scala',
      'Scheme',
      'Scratch',
      'Solidity',
      'SQL',
      'Swift',
      'TypeScript',
      'VBA',
      'VHDL',
      'Verilog',
      'Visual Basic',
      'Zig',
      'Other',
    ],
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
]

// AI Coding Tools
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

// Development Tools
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

// Frameworks
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

// Additional questions
const additionalQuestions = [
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
  {
    title: 'How comfortable is your team with AI-assisted coding?',
    type: QuestionType.SINGLE_CHOICE,
    category: 'preferences',
    options: [
      'Very uncomfortable - Team avoids it',
      'Somewhat uncomfortable - Limited adoption',
      "Mixed opinions - Some use it, some don't",
      'Comfortable - Most team members use it',
      'Very comfortable - Fully integrated into workflow',
      'I work alone / Not applicable',
    ],
  },
]

async function main() {
  console.log('🌱 Seeding database with full survey and questions...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.response.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()

  // Create an active survey for the current week
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - ((now.getDay() + 6) % 7)) // Start of week (Monday)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6) // End of week (Sunday)
  endDate.setHours(23, 59, 59, 999)

  console.log('✅ Starting to seed questions...')

  let globalOrderIndex = 1

  // Seed demographics questions
  console.log('👥 Seeding demographics questions...')
  for (const q of demographicsQuestions) {
    const question = await prisma.question.create({
      data: {
        title: q.title,
        type: q.type,
        category: q.category,
        orderIndex: globalOrderIndex++,
        isRequired: false,
        isActive: true,
      },
    })

    if (q.options) {
      // Sort options alphabetically if there are more than 10, keeping "Other" at the end
      let sortedOptions = [...q.options]
      if (q.options.length > 10) {
        const hasOther = sortedOptions.includes('Other')
        if (hasOther) {
          sortedOptions = sortedOptions.filter(opt => opt !== 'Other')
        }
        sortedOptions.sort((a, b) => a.localeCompare(b))
        if (hasOther) {
          sortedOptions.push('Other')
        }
      }

      for (let i = 0; i < sortedOptions.length; i++) {
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            value: sortedOptions[i].toLowerCase().replace(/\s+/g, '_'),
            label: sortedOptions[i],
            orderIndex: i + 1,
            isActive: true,
          },
        })
      }
    }
  }

  // Seed AI tool questions
  console.log('🤖 Seeding AI tool experience questions...')
  for (const tool of aiCodingTools) {
    await prisma.question.create({
      data: {
        title: tool.name,
        description: tool.description,
        type: QuestionType.EXPERIENCE,
        category: 'ai_tools',
        orderIndex: globalOrderIndex++,
        isRequired: false,
        isActive: true,
      },
    })
  }

  // Seed development tool questions
  console.log('🛠️ Seeding development tool questions...')
  for (const tool of developmentTools) {
    await prisma.question.create({
      data: {
        title: tool.name,
        description: tool.description,
        type: QuestionType.EXPERIENCE,
        category: 'tools',
        orderIndex: globalOrderIndex++,
        isRequired: false,
        isActive: true,
      },
    })
  }

  // Seed framework questions
  console.log('📦 Seeding framework questions...')
  for (const framework of frameworks) {
    await prisma.question.create({
      data: {
        title: framework.name,
        description: framework.description,
        type: QuestionType.EXPERIENCE,
        category: 'frameworks',
        orderIndex: globalOrderIndex++,
        isRequired: false,
        isActive: true,
      },
    })
  }

  // Seed additional questions
  console.log('❓ Seeding additional questions...')
  for (const q of additionalQuestions) {
    const question = await prisma.question.create({
      data: {
        title: q.title,
        type: q.type,
        category: q.category,
        orderIndex: globalOrderIndex++,
        isRequired: false,
        isActive: true,
      },
    })

    if (q.options) {
      // Sort options alphabetically if there are more than 10, keeping "Other" at the end
      let sortedOptions = [...q.options]
      if (q.options.length > 10) {
        const hasOther = sortedOptions.includes('Other')
        if (hasOther) {
          sortedOptions = sortedOptions.filter(opt => opt !== 'Other')
        }
        sortedOptions.sort((a, b) => a.localeCompare(b))
        if (hasOther) {
          sortedOptions.push('Other')
        }
      }

      for (let i = 0; i < sortedOptions.length; i++) {
        await prisma.questionOption.create({
          data: {
            questionId: question.id,
            value: sortedOptions[i].toLowerCase().replace(/\s+/g, '_'),
            label: sortedOptions[i],
            orderIndex: i + 1,
            isActive: true,
          },
        })
      }
    }
  }

  console.log('✨ Database seeded successfully!')
  console.log(`📊 Total questions created: ${globalOrderIndex - 1}`)
}

main()
  .catch(e => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

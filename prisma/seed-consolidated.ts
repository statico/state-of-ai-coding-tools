import { PrismaClient, QuestionType, Experience } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

interface SeedOptions {
  clearData?: boolean
  createQuestions?: boolean
  createFakeResponses?: boolean
  numberOfResponses?: number
}

async function clearExistingData() {
  console.log('🧹 Clearing existing data...')
  await prisma.response.deleteMany()
  await prisma.userSession.deleteMany()
  await prisma.questionOption.deleteMany()
  await prisma.question.deleteMany()
  await prisma.experienceMetric.deleteMany()
  await prisma.experienceTrend.deleteMany()
  console.log('✅ Cleared existing data')
}

async function createDemographicQuestions() {
  console.log('👥 Creating demographic questions...')

  const demographics = await Promise.all([
    prisma.question.create({
      data: {
        title: 'Years of Professional Experience',
        description:
          'How many years have you been working professionally in software development?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 1,
        isRequired: false,
        options: {
          create: [
            { value: 'less_than_1', label: 'Less than 1 year', orderIndex: 1 },
            { value: '1_2', label: '1-2 years', orderIndex: 2 },
            { value: '3_5', label: '3-5 years', orderIndex: 3 },
            { value: '6_10', label: '6-10 years', orderIndex: 4 },
            { value: '11_20', label: '11-20 years', orderIndex: 5 },
            { value: 'over_20', label: 'Over 20 years', orderIndex: 6 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Company Size',
        description: 'How many people work at your company?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 2,
        isRequired: false,
        options: {
          create: [
            {
              value: 'solo',
              label: 'Just me (freelancer/consultant)',
              orderIndex: 1,
            },
            { value: '2_10', label: '2-10 employees', orderIndex: 2 },
            { value: '11_50', label: '11-50 employees', orderIndex: 3 },
            { value: '51_100', label: '51-100 employees', orderIndex: 4 },
            { value: '101_500', label: '101-500 employees', orderIndex: 5 },
            { value: '501_1000', label: '501-1000 employees', orderIndex: 6 },
            { value: 'over_1000', label: 'Over 1000 employees', orderIndex: 7 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Primary Development Area',
        description: 'What type of development do you primarily focus on?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'demographics',
        orderIndex: 3,
        isRequired: false,
        options: {
          create: [
            { value: 'frontend', label: 'Frontend Development', orderIndex: 1 },
            { value: 'backend', label: 'Backend Development', orderIndex: 2 },
            {
              value: 'fullstack',
              label: 'Full-Stack Development',
              orderIndex: 3,
            },
            { value: 'mobile', label: 'Mobile Development', orderIndex: 4 },
            { value: 'devops', label: 'DevOps/Infrastructure', orderIndex: 5 },
            { value: 'data', label: 'Data Engineering/Science', orderIndex: 6 },
            { value: 'ml', label: 'Machine Learning/AI', orderIndex: 7 },
            { value: 'embedded', label: 'Embedded Systems', orderIndex: 8 },
            { value: 'games', label: 'Game Development', orderIndex: 9 },
            { value: 'other', label: 'Other', orderIndex: 10 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'What is your role?',
        description: 'Select your current role',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 4,
        isRequired: false,
        options: {
          create: [
            {
              value: 'frontend_engineering',
              label: 'Frontend Engineering',
              orderIndex: 1,
            },
            {
              value: 'backend_engineering',
              label: 'Backend Engineering',
              orderIndex: 2,
            },
            {
              value: 'fullstack_engineering',
              label: 'Full-Stack Engineering',
              orderIndex: 3,
            },
            {
              value: 'mobile_engineering',
              label: 'Mobile Engineering',
              orderIndex: 4,
            },
            { value: 'devops_sre', label: 'DevOps/SRE', orderIndex: 5 },
            {
              value: 'data_science_ml',
              label: 'Data Science/ML',
              orderIndex: 6,
            },
            {
              value: 'product_management',
              label: 'Product Management',
              orderIndex: 7,
            },
            { value: 'design_ux', label: 'Design/UX', orderIndex: 8 },
            { value: 'qa_testing', label: 'QA/Testing', orderIndex: 9 },
            {
              value: 'technical_writing',
              label: 'Technical Writing',
              orderIndex: 10,
            },
            {
              value: 'developer_relations',
              label: 'Developer Relations',
              orderIndex: 11,
            },
            {
              value: 'engineering_management',
              label: 'Engineering Management',
              orderIndex: 12,
            },
            {
              value: 'executive',
              label: 'Executive (CTO, VP Eng, etc.)',
              orderIndex: 13,
            },
            {
              value: 'support_solutions',
              label: 'Support/Solutions',
              orderIndex: 14,
            },
            { value: 'student', label: 'Student', orderIndex: 15 },
            { value: 'hobbyist', label: 'Hobbyist', orderIndex: 16 },
            { value: 'other', label: 'Other', orderIndex: 17 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'What is your country or region?',
        description: 'Select your country or region',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 5,
        isRequired: false,
        options: {
          create: [
            { value: 'afghanistan', label: 'Afghanistan', orderIndex: 1 },
            { value: 'albania', label: 'Albania', orderIndex: 2 },
            { value: 'algeria', label: 'Algeria', orderIndex: 3 },
            { value: 'andorra', label: 'Andorra', orderIndex: 4 },
            { value: 'angola', label: 'Angola', orderIndex: 5 },
            {
              value: 'antigua_and_barbuda',
              label: 'Antigua and Barbuda',
              orderIndex: 6,
            },
            { value: 'argentina', label: 'Argentina', orderIndex: 7 },
            { value: 'armenia', label: 'Armenia', orderIndex: 8 },
            { value: 'australia', label: 'Australia', orderIndex: 9 },
            { value: 'austria', label: 'Austria', orderIndex: 10 },
            { value: 'azerbaijan', label: 'Azerbaijan', orderIndex: 11 },
            { value: 'bahamas', label: 'Bahamas', orderIndex: 12 },
            { value: 'bahrain', label: 'Bahrain', orderIndex: 13 },
            { value: 'bangladesh', label: 'Bangladesh', orderIndex: 14 },
            { value: 'barbados', label: 'Barbados', orderIndex: 15 },
            { value: 'belarus', label: 'Belarus', orderIndex: 16 },
            { value: 'belgium', label: 'Belgium', orderIndex: 17 },
            { value: 'belize', label: 'Belize', orderIndex: 18 },
            { value: 'benin', label: 'Benin', orderIndex: 19 },
            { value: 'bhutan', label: 'Bhutan', orderIndex: 20 },
            { value: 'bolivia', label: 'Bolivia', orderIndex: 21 },
            {
              value: 'bosnia_and_herzegovina',
              label: 'Bosnia and Herzegovina',
              orderIndex: 22,
            },
            { value: 'botswana', label: 'Botswana', orderIndex: 23 },
            { value: 'brazil', label: 'Brazil', orderIndex: 24 },
            { value: 'brunei', label: 'Brunei', orderIndex: 25 },
            { value: 'bulgaria', label: 'Bulgaria', orderIndex: 26 },
            { value: 'burkina_faso', label: 'Burkina Faso', orderIndex: 27 },
            { value: 'burundi', label: 'Burundi', orderIndex: 28 },
            { value: 'cambodia', label: 'Cambodia', orderIndex: 29 },
            { value: 'cameroon', label: 'Cameroon', orderIndex: 30 },
            { value: 'canada', label: 'Canada', orderIndex: 31 },
            { value: 'cape_verde', label: 'Cape Verde', orderIndex: 32 },
            {
              value: 'central_african_republic',
              label: 'Central African Republic',
              orderIndex: 33,
            },
            { value: 'chad', label: 'Chad', orderIndex: 34 },
            { value: 'chile', label: 'Chile', orderIndex: 35 },
            { value: 'china', label: 'China', orderIndex: 36 },
            { value: 'colombia', label: 'Colombia', orderIndex: 37 },
            { value: 'comoros', label: 'Comoros', orderIndex: 38 },
            { value: 'congo', label: 'Congo', orderIndex: 39 },
            { value: 'costa_rica', label: 'Costa Rica', orderIndex: 40 },
            { value: 'croatia', label: 'Croatia', orderIndex: 41 },
            { value: 'cuba', label: 'Cuba', orderIndex: 42 },
            { value: 'cyprus', label: 'Cyprus', orderIndex: 43 },
            {
              value: 'czech_republic',
              label: 'Czech Republic',
              orderIndex: 44,
            },
            { value: 'denmark', label: 'Denmark', orderIndex: 45 },
            { value: 'djibouti', label: 'Djibouti', orderIndex: 46 },
            { value: 'dominica', label: 'Dominica', orderIndex: 47 },
            {
              value: 'dominican_republic',
              label: 'Dominican Republic',
              orderIndex: 48,
            },
            { value: 'ecuador', label: 'Ecuador', orderIndex: 49 },
            { value: 'egypt', label: 'Egypt', orderIndex: 50 },
            { value: 'el_salvador', label: 'El Salvador', orderIndex: 51 },
            {
              value: 'equatorial_guinea',
              label: 'Equatorial Guinea',
              orderIndex: 52,
            },
            { value: 'eritrea', label: 'Eritrea', orderIndex: 53 },
            { value: 'estonia', label: 'Estonia', orderIndex: 54 },
            { value: 'eswatini', label: 'Eswatini', orderIndex: 55 },
            { value: 'ethiopia', label: 'Ethiopia', orderIndex: 56 },
            { value: 'fiji', label: 'Fiji', orderIndex: 57 },
            { value: 'finland', label: 'Finland', orderIndex: 58 },
            { value: 'france', label: 'France', orderIndex: 59 },
            { value: 'gabon', label: 'Gabon', orderIndex: 60 },
            { value: 'gambia', label: 'Gambia', orderIndex: 61 },
            { value: 'georgia', label: 'Georgia', orderIndex: 62 },
            { value: 'germany', label: 'Germany', orderIndex: 63 },
            { value: 'ghana', label: 'Ghana', orderIndex: 64 },
            { value: 'greece', label: 'Greece', orderIndex: 65 },
            { value: 'grenada', label: 'Grenada', orderIndex: 66 },
            { value: 'guatemala', label: 'Guatemala', orderIndex: 67 },
            { value: 'guinea', label: 'Guinea', orderIndex: 68 },
            { value: 'guinea_bissau', label: 'Guinea-Bissau', orderIndex: 69 },
            { value: 'guyana', label: 'Guyana', orderIndex: 70 },
            { value: 'haiti', label: 'Haiti', orderIndex: 71 },
            { value: 'honduras', label: 'Honduras', orderIndex: 72 },
            { value: 'hungary', label: 'Hungary', orderIndex: 73 },
            { value: 'iceland', label: 'Iceland', orderIndex: 74 },
            { value: 'india', label: 'India', orderIndex: 75 },
            { value: 'indonesia', label: 'Indonesia', orderIndex: 76 },
            { value: 'iran', label: 'Iran', orderIndex: 77 },
            { value: 'iraq', label: 'Iraq', orderIndex: 78 },
            { value: 'ireland', label: 'Ireland', orderIndex: 79 },
            { value: 'israel', label: 'Israel', orderIndex: 80 },
            { value: 'italy', label: 'Italy', orderIndex: 81 },
            { value: 'ivory_coast', label: 'Ivory Coast', orderIndex: 82 },
            { value: 'jamaica', label: 'Jamaica', orderIndex: 83 },
            { value: 'japan', label: 'Japan', orderIndex: 84 },
            { value: 'jordan', label: 'Jordan', orderIndex: 85 },
            { value: 'kazakhstan', label: 'Kazakhstan', orderIndex: 86 },
            { value: 'kenya', label: 'Kenya', orderIndex: 87 },
            { value: 'kiribati', label: 'Kiribati', orderIndex: 88 },
            { value: 'kosovo', label: 'Kosovo', orderIndex: 89 },
            { value: 'kuwait', label: 'Kuwait', orderIndex: 90 },
            { value: 'kyrgyzstan', label: 'Kyrgyzstan', orderIndex: 91 },
            { value: 'laos', label: 'Laos', orderIndex: 92 },
            { value: 'latvia', label: 'Latvia', orderIndex: 93 },
            { value: 'lebanon', label: 'Lebanon', orderIndex: 94 },
            { value: 'lesotho', label: 'Lesotho', orderIndex: 95 },
            { value: 'liberia', label: 'Liberia', orderIndex: 96 },
            { value: 'libya', label: 'Libya', orderIndex: 97 },
            { value: 'liechtenstein', label: 'Liechtenstein', orderIndex: 98 },
            { value: 'lithuania', label: 'Lithuania', orderIndex: 99 },
            { value: 'luxembourg', label: 'Luxembourg', orderIndex: 100 },
            { value: 'madagascar', label: 'Madagascar', orderIndex: 101 },
            { value: 'malawi', label: 'Malawi', orderIndex: 102 },
            { value: 'malaysia', label: 'Malaysia', orderIndex: 103 },
            { value: 'maldives', label: 'Maldives', orderIndex: 104 },
            { value: 'mali', label: 'Mali', orderIndex: 105 },
            { value: 'malta', label: 'Malta', orderIndex: 106 },
            {
              value: 'marshall_islands',
              label: 'Marshall Islands',
              orderIndex: 107,
            },
            { value: 'mauritania', label: 'Mauritania', orderIndex: 108 },
            { value: 'mauritius', label: 'Mauritius', orderIndex: 109 },
            { value: 'mexico', label: 'Mexico', orderIndex: 110 },
            { value: 'micronesia', label: 'Micronesia', orderIndex: 111 },
            { value: 'moldova', label: 'Moldova', orderIndex: 112 },
            { value: 'monaco', label: 'Monaco', orderIndex: 113 },
            { value: 'mongolia', label: 'Mongolia', orderIndex: 114 },
            { value: 'montenegro', label: 'Montenegro', orderIndex: 115 },
            { value: 'morocco', label: 'Morocco', orderIndex: 116 },
            { value: 'mozambique', label: 'Mozambique', orderIndex: 117 },
            { value: 'myanmar', label: 'Myanmar', orderIndex: 118 },
            { value: 'namibia', label: 'Namibia', orderIndex: 119 },
            { value: 'nauru', label: 'Nauru', orderIndex: 120 },
            { value: 'nepal', label: 'Nepal', orderIndex: 121 },
            { value: 'netherlands', label: 'Netherlands', orderIndex: 122 },
            { value: 'new_zealand', label: 'New Zealand', orderIndex: 123 },
            { value: 'nicaragua', label: 'Nicaragua', orderIndex: 124 },
            { value: 'niger', label: 'Niger', orderIndex: 125 },
            { value: 'nigeria', label: 'Nigeria', orderIndex: 126 },
            { value: 'north_korea', label: 'North Korea', orderIndex: 127 },
            {
              value: 'north_macedonia',
              label: 'North Macedonia',
              orderIndex: 128,
            },
            { value: 'norway', label: 'Norway', orderIndex: 129 },
            { value: 'oman', label: 'Oman', orderIndex: 130 },
            { value: 'pakistan', label: 'Pakistan', orderIndex: 131 },
            { value: 'palau', label: 'Palau', orderIndex: 132 },
            { value: 'palestine', label: 'Palestine', orderIndex: 133 },
            { value: 'panama', label: 'Panama', orderIndex: 134 },
            {
              value: 'papua_new_guinea',
              label: 'Papua New Guinea',
              orderIndex: 135,
            },
            { value: 'paraguay', label: 'Paraguay', orderIndex: 136 },
            { value: 'peru', label: 'Peru', orderIndex: 137 },
            { value: 'philippines', label: 'Philippines', orderIndex: 138 },
            { value: 'poland', label: 'Poland', orderIndex: 139 },
            { value: 'portugal', label: 'Portugal', orderIndex: 140 },
            { value: 'qatar', label: 'Qatar', orderIndex: 141 },
            { value: 'romania', label: 'Romania', orderIndex: 142 },
            { value: 'russia', label: 'Russia', orderIndex: 143 },
            { value: 'rwanda', label: 'Rwanda', orderIndex: 144 },
            {
              value: 'saint_kitts_and_nevis',
              label: 'Saint Kitts and Nevis',
              orderIndex: 145,
            },
            { value: 'saint_lucia', label: 'Saint Lucia', orderIndex: 146 },
            {
              value: 'saint_vincent_and_the_grenadines',
              label: 'Saint Vincent and the Grenadines',
              orderIndex: 147,
            },
            { value: 'samoa', label: 'Samoa', orderIndex: 148 },
            { value: 'san_marino', label: 'San Marino', orderIndex: 149 },
            {
              value: 'sao_tome_and_principe',
              label: 'Sao Tome and Principe',
              orderIndex: 150,
            },
            { value: 'saudi_arabia', label: 'Saudi Arabia', orderIndex: 151 },
            { value: 'senegal', label: 'Senegal', orderIndex: 152 },
            { value: 'serbia', label: 'Serbia', orderIndex: 153 },
            { value: 'seychelles', label: 'Seychelles', orderIndex: 154 },
            { value: 'sierra_leone', label: 'Sierra Leone', orderIndex: 155 },
            { value: 'singapore', label: 'Singapore', orderIndex: 156 },
            { value: 'slovakia', label: 'Slovakia', orderIndex: 157 },
            { value: 'slovenia', label: 'Slovenia', orderIndex: 158 },
            {
              value: 'solomon_islands',
              label: 'Solomon Islands',
              orderIndex: 159,
            },
            { value: 'somalia', label: 'Somalia', orderIndex: 160 },
            { value: 'south_africa', label: 'South Africa', orderIndex: 161 },
            { value: 'south_korea', label: 'South Korea', orderIndex: 162 },
            { value: 'south_sudan', label: 'South Sudan', orderIndex: 163 },
            { value: 'spain', label: 'Spain', orderIndex: 164 },
            { value: 'sri_lanka', label: 'Sri Lanka', orderIndex: 165 },
            { value: 'sudan', label: 'Sudan', orderIndex: 166 },
            { value: 'suriname', label: 'Suriname', orderIndex: 167 },
            { value: 'sweden', label: 'Sweden', orderIndex: 168 },
            { value: 'switzerland', label: 'Switzerland', orderIndex: 169 },
            { value: 'syria', label: 'Syria', orderIndex: 170 },
            { value: 'taiwan', label: 'Taiwan', orderIndex: 171 },
            { value: 'tajikistan', label: 'Tajikistan', orderIndex: 172 },
            { value: 'tanzania', label: 'Tanzania', orderIndex: 173 },
            { value: 'thailand', label: 'Thailand', orderIndex: 174 },
            { value: 'timor_leste', label: 'Timor-Leste', orderIndex: 175 },
            { value: 'togo', label: 'Togo', orderIndex: 176 },
            { value: 'tonga', label: 'Tonga', orderIndex: 177 },
            {
              value: 'trinidad_and_tobago',
              label: 'Trinidad and Tobago',
              orderIndex: 178,
            },
            { value: 'tunisia', label: 'Tunisia', orderIndex: 179 },
            { value: 'turkey', label: 'Turkey', orderIndex: 180 },
            { value: 'turkmenistan', label: 'Turkmenistan', orderIndex: 181 },
            { value: 'tuvalu', label: 'Tuvalu', orderIndex: 182 },
            { value: 'uganda', label: 'Uganda', orderIndex: 183 },
            { value: 'ukraine', label: 'Ukraine', orderIndex: 184 },
            {
              value: 'united_arab_emirates',
              label: 'United Arab Emirates',
              orderIndex: 185,
            },
            {
              value: 'united_kingdom',
              label: 'United Kingdom',
              orderIndex: 186,
            },
            { value: 'united_states', label: 'United States', orderIndex: 187 },
            { value: 'uruguay', label: 'Uruguay', orderIndex: 188 },
            { value: 'uzbekistan', label: 'Uzbekistan', orderIndex: 189 },
            { value: 'vanuatu', label: 'Vanuatu', orderIndex: 190 },
            { value: 'vatican_city', label: 'Vatican City', orderIndex: 191 },
            { value: 'venezuela', label: 'Venezuela', orderIndex: 192 },
            { value: 'vietnam', label: 'Vietnam', orderIndex: 193 },
            { value: 'yemen', label: 'Yemen', orderIndex: 194 },
            { value: 'zambia', label: 'Zambia', orderIndex: 195 },
            { value: 'zimbabwe', label: 'Zimbabwe', orderIndex: 196 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'What is your primary programming language?',
        description: 'Select your primary programming language',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 6,
        isRequired: false,
        options: {
          create: [
            { value: 'abap', label: 'ABAP', orderIndex: 1 },
            { value: 'ada', label: 'Ada', orderIndex: 2 },
            { value: 'assembly', label: 'Assembly', orderIndex: 3 },
            { value: 'bash_shell', label: 'Bash/Shell', orderIndex: 4 },
            { value: 'c', label: 'C', orderIndex: 5 },
            { value: 'c_sharp', label: 'C#', orderIndex: 6 },
            { value: 'c_plus_plus', label: 'C++', orderIndex: 7 },
            { value: 'cobol', label: 'COBOL', orderIndex: 8 },
            { value: 'clojure', label: 'Clojure', orderIndex: 9 },
            { value: 'crystal', label: 'Crystal', orderIndex: 10 },
            { value: 'd', label: 'D', orderIndex: 11 },
            { value: 'dart', label: 'Dart', orderIndex: 12 },
            {
              value: 'delphi_object_pascal',
              label: 'Delphi/Object Pascal',
              orderIndex: 13,
            },
            { value: 'elixir', label: 'Elixir', orderIndex: 14 },
            { value: 'elm', label: 'Elm', orderIndex: 15 },
            { value: 'erlang', label: 'Erlang', orderIndex: 16 },
            { value: 'f_sharp', label: 'F#', orderIndex: 17 },
            { value: 'fortran', label: 'Fortran', orderIndex: 18 },
            { value: 'go', label: 'Go', orderIndex: 19 },
            { value: 'groovy', label: 'Groovy', orderIndex: 20 },
            { value: 'haskell', label: 'Haskell', orderIndex: 21 },
            { value: 'java', label: 'Java', orderIndex: 22 },
            { value: 'javascript', label: 'JavaScript', orderIndex: 23 },
            { value: 'julia', label: 'Julia', orderIndex: 24 },
            { value: 'kotlin', label: 'Kotlin', orderIndex: 25 },
            { value: 'lisp', label: 'Lisp', orderIndex: 26 },
            { value: 'lua', label: 'Lua', orderIndex: 27 },
            { value: 'matlab', label: 'MATLAB', orderIndex: 28 },
            { value: 'nim', label: 'Nim', orderIndex: 29 },
            { value: 'objective_c', label: 'Objective-C', orderIndex: 30 },
            { value: 'ocaml', label: 'OCaml', orderIndex: 31 },
            { value: 'php', label: 'PHP', orderIndex: 32 },
            { value: 'perl', label: 'Perl', orderIndex: 33 },
            { value: 'powershell', label: 'PowerShell', orderIndex: 34 },
            { value: 'prolog', label: 'Prolog', orderIndex: 35 },
            { value: 'python', label: 'Python', orderIndex: 36 },
            { value: 'r', label: 'R', orderIndex: 37 },
            { value: 'ruby', label: 'Ruby', orderIndex: 38 },
            { value: 'rust', label: 'Rust', orderIndex: 39 },
            { value: 'sas', label: 'SAS', orderIndex: 40 },
            { value: 'scala', label: 'Scala', orderIndex: 41 },
            { value: 'scheme', label: 'Scheme', orderIndex: 42 },
            { value: 'scratch', label: 'Scratch', orderIndex: 43 },
            { value: 'solidity', label: 'Solidity', orderIndex: 44 },
            { value: 'sql', label: 'SQL', orderIndex: 45 },
            { value: 'swift', label: 'Swift', orderIndex: 46 },
            { value: 'typescript', label: 'TypeScript', orderIndex: 47 },
            { value: 'vba', label: 'VBA', orderIndex: 48 },
            { value: 'visual_basic', label: 'Visual Basic', orderIndex: 49 },
            { value: 'zig', label: 'Zig', orderIndex: 50 },
            { value: 'other', label: 'Other', orderIndex: 51 },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created demographic questions')
  return demographics
}

async function createAIToolQuestions() {
  console.log('🤖 Creating AI tool questions...')

  const aiTools = [
    'GitHub Copilot',
    'Cursor',
    'Claude (Anthropic)',
    'ChatGPT',
    'Amazon CodeWhisperer',
    'Codeium',
    'Tabnine',
    'Replit AI',
    'Sourcegraph Cody',
    'CodeGeeX',
    'Continue',
    'Aider',
    'Windsurf',
    'v0 by Vercel',
    'bolt.new',
    'Lovable',
    'Replit Agent',
    'Devin',
  ]

  const aiToolQuestions = await Promise.all(
    aiTools.map((tool, index) =>
      prisma.question.create({
        data: {
          title: tool,
          description: `What's your experience with ${tool}?`,
          type: QuestionType.EXPERIENCE,
          category: 'ai_tools',
          orderIndex: 100 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${aiTools.length} AI tool questions`)
  return aiToolQuestions
}

async function createEditorQuestions() {
  console.log('📝 Creating editor questions...')

  const editors = [
    'VS Code',
    'IntelliJ IDEA',
    'Visual Studio',
    'Vim/Neovim',
    'Sublime Text',
    'WebStorm',
    'Xcode',
    'Android Studio',
    'Emacs',
    'Zed',
  ]

  const editorQuestions = await Promise.all(
    editors.map((tool, index) =>
      prisma.question.create({
        data: {
          title: tool,
          description: `What's your experience with ${tool}?`,
          type: QuestionType.EXPERIENCE,
          category: 'editors',
          orderIndex: 200 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${editors.length} editor questions`)
  return editorQuestions
}

async function createFrameworkQuestions() {
  console.log('🛠️ Creating framework questions...')

  const frameworks = [
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt',
    'Express',
    'NestJS',
    'Django',
    'Flask',
    'FastAPI',
    'Ruby on Rails',
    'Spring Boot',
    'ASP.NET',
    'Laravel',
  ]

  const frameworkQuestions = await Promise.all(
    frameworks.map((framework, index) =>
      prisma.question.create({
        data: {
          title: framework,
          description: `What's your experience with ${framework}?`,
          type: QuestionType.EXPERIENCE,
          category: 'frameworks',
          orderIndex: 300 + index,
          isRequired: false,
        },
      })
    )
  )

  console.log(`✅ Created ${frameworks.length} framework questions`)
  return frameworkQuestions
}

async function createOpinionQuestions() {
  console.log('💭 Creating opinion questions...')

  const opinionQuestions = await Promise.all([
    prisma.question.create({
      data: {
        title: 'AI Impact on Productivity',
        description:
          'How much have AI coding tools improved your productivity?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 400,
        isRequired: false,
        options: {
          create: [
            {
              value: 'significant_increase',
              label: 'Significantly increased (>50%)',
              orderIndex: 1,
            },
            {
              value: 'moderate_increase',
              label: 'Moderately increased (20-50%)',
              orderIndex: 2,
            },
            {
              value: 'slight_increase',
              label: 'Slightly increased (<20%)',
              orderIndex: 3,
            },
            { value: 'no_change', label: 'No change', orderIndex: 4 },
            { value: 'decreased', label: 'Actually decreased', orderIndex: 5 },
            { value: 'not_using', label: 'Not using AI tools', orderIndex: 6 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Most Important AI Feature',
        description:
          'Which AI coding assistant feature is most valuable to you?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 401,
        isRequired: false,
        options: {
          create: [
            {
              value: 'autocomplete',
              label: 'Code autocompletion',
              orderIndex: 1,
            },
            {
              value: 'generation',
              label: 'Code generation from comments',
              orderIndex: 2,
            },
            {
              value: 'chat',
              label: 'Chat/conversation interface',
              orderIndex: 3,
            },
            {
              value: 'refactoring',
              label: 'Code refactoring suggestions',
              orderIndex: 4,
            },
            {
              value: 'debugging',
              label: 'Bug detection and fixes',
              orderIndex: 5,
            },
            {
              value: 'documentation',
              label: 'Documentation generation',
              orderIndex: 6,
            },
            { value: 'testing', label: 'Test generation', orderIndex: 7 },
            { value: 'review', label: 'Code review', orderIndex: 8 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Biggest AI Tool Concern',
        description: 'What concerns you most about AI coding tools?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 402,
        isRequired: false,
        options: {
          create: [
            {
              value: 'security',
              label: 'Security/privacy of code',
              orderIndex: 1,
            },
            { value: 'quality', label: 'Code quality concerns', orderIndex: 2 },
            {
              value: 'dependency',
              label: 'Over-reliance on AI',
              orderIndex: 3,
            },
            { value: 'job', label: 'Job security', orderIndex: 4 },
            { value: 'cost', label: 'Cost/pricing', orderIndex: 5 },
            {
              value: 'accuracy',
              label: 'Accuracy of suggestions',
              orderIndex: 6,
            },
            {
              value: 'learning',
              label: 'Impact on learning/skill development',
              orderIndex: 7,
            },
            { value: 'none', label: 'No major concerns', orderIndex: 8 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'AI Adoption Timeline',
        description:
          'When do you think AI will write the majority of production code?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'opinions',
        orderIndex: 403,
        isRequired: false,
        options: {
          create: [
            { value: 'already', label: 'It already does', orderIndex: 1 },
            { value: '1_year', label: 'Within 1 year', orderIndex: 2 },
            { value: '2_3_years', label: 'Within 2-3 years', orderIndex: 3 },
            { value: '5_years', label: 'Within 5 years', orderIndex: 4 },
            { value: '10_years', label: 'Within 10 years', orderIndex: 5 },
            { value: 'more_10', label: 'More than 10 years', orderIndex: 6 },
            { value: 'never', label: 'Never', orderIndex: 7 },
          ],
        },
      },
    }),
    prisma.question.create({
      data: {
        title: 'Additional Comments',
        description:
          "Any other thoughts on AI coding tools you'd like to share?",
        type: QuestionType.TEXT,
        category: 'opinions',
        orderIndex: 404,
        isRequired: false,
      },
    }),
  ])

  console.log('✅ Created opinion questions')
  return opinionQuestions
}

async function createFakeResponses(numberOfSessions: number = 50) {
  console.log(`🎭 Creating ${numberOfSessions} fake survey responses...`)

  const questions = await prisma.question.findMany({
    include: { options: true },
    orderBy: { orderIndex: 'asc' },
  })

  if (questions.length === 0) {
    console.log('❌ No questions found. Please create questions first.')
    return
  }

  for (let i = 0; i < numberOfSessions; i++) {
    const sessionId = faker.string.uuid()
    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        demographicData: {
          source: 'seed',
          userAgent: faker.internet.userAgent(),
        },
        completedAt: faker.date.recent({ days: 30 }),
      },
    })

    console.log(
      `  Creating responses for session ${i + 1}/${numberOfSessions}...`
    )

    for (const question of questions) {
      let responseData: any = {
        sessionId: session.id,
        questionId: question.id,
      }

      switch (question.type) {
        case QuestionType.SINGLE_CHOICE:
        case QuestionType.DEMOGRAPHIC:
          if (question.options.length > 0) {
            const randomOption = faker.helpers.arrayElement(question.options)
            responseData.optionId = randomOption.id
          }
          break

        case QuestionType.MULTIPLE_CHOICE:
          if (question.options.length > 0) {
            const numOptions = faker.number.int({
              min: 1,
              max: Math.min(3, question.options.length),
            })
            const selectedOptions = faker.helpers.arrayElements(
              question.options,
              numOptions
            )

            for (const option of selectedOptions) {
              await prisma.response.create({
                data: {
                  sessionId: session.id,
                  questionId: question.id,
                  optionId: option.id,
                },
              })
            }
            continue
          }
          break

        case QuestionType.RATING:
          const ratingOptions = [
            { value: 1, weight: 5 },
            { value: 2, weight: 10 },
            { value: 3, weight: 20 },
            { value: 4, weight: 30 },
            { value: 5, weight: 35 },
          ]
          const rating = faker.helpers.weightedArrayElement(ratingOptions)
          responseData.ratingValue = rating
          break

        case QuestionType.TEXT:
          const feedbackOptions = [
            'Great tool, very helpful for my daily work!',
            'Could use more features, but overall satisfied.',
            'The UI needs improvement, but functionality is good.',
            'Excellent experience, would recommend to others.',
            'Some bugs need fixing, but shows promise.',
            'Very intuitive and easy to use.',
            'Performance could be better.',
            'Love the AI integration features!',
            'Needs better documentation.',
            'Game changer for productivity!',
          ]
          responseData.textValue = faker.helpers.arrayElement(feedbackOptions)
          break

        case QuestionType.EXPERIENCE:
          let experienceWeights = [
            { value: Experience.NEVER_HEARD, weight: 10 },
            { value: Experience.WANT_TO_TRY, weight: 20 },
            { value: Experience.NOT_INTERESTED, weight: 15 },
            { value: Experience.WOULD_USE_AGAIN, weight: 40 },
            { value: Experience.WOULD_NOT_USE, weight: 15 },
          ]

          // Adjust weights based on tool popularity
          if (
            question.title.includes('GitHub Copilot') ||
            question.title.includes('ChatGPT')
          ) {
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 5 },
              { value: Experience.WANT_TO_TRY, weight: 15 },
              { value: Experience.NOT_INTERESTED, weight: 10 },
              { value: Experience.WOULD_USE_AGAIN, weight: 50 },
              { value: Experience.WOULD_NOT_USE, weight: 20 },
            ]
          } else if (
            question.title.includes('VS Code') ||
            question.title.includes('React')
          ) {
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 2 },
              { value: Experience.WANT_TO_TRY, weight: 10 },
              { value: Experience.NOT_INTERESTED, weight: 8 },
              { value: Experience.WOULD_USE_AGAIN, weight: 60 },
              { value: Experience.WOULD_NOT_USE, weight: 20 },
            ]
          } else if (
            question.title.includes('Cursor') ||
            question.title.includes('Claude')
          ) {
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 15 },
              { value: Experience.WANT_TO_TRY, weight: 30 },
              { value: Experience.NOT_INTERESTED, weight: 15 },
              { value: Experience.WOULD_USE_AGAIN, weight: 30 },
              { value: Experience.WOULD_NOT_USE, weight: 10 },
            ]
          } else if (
            question.title.includes('Devin') ||
            question.title.includes('CodeGeeX')
          ) {
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 40 },
              { value: Experience.WANT_TO_TRY, weight: 30 },
              { value: Experience.NOT_INTERESTED, weight: 20 },
              { value: Experience.WOULD_USE_AGAIN, weight: 8 },
              { value: Experience.WOULD_NOT_USE, weight: 2 },
            ]
          }

          responseData.experience =
            faker.helpers.weightedArrayElement(experienceWeights)
          break

        case QuestionType.WRITE_IN:
          if (faker.datatype.boolean({ probability: 0.3 })) {
            responseData.writeInValue = faker.lorem.sentence()
          }
          break
      }

      if (question.type !== QuestionType.MULTIPLE_CHOICE) {
        await prisma.response.create({ data: responseData })
      }
    }
  }

  console.log('✅ Created fake responses')
}

async function updateExperienceMetrics() {
  console.log('📊 Updating experience metrics...')

  const experienceQuestions = await prisma.question.findMany({
    where: { type: QuestionType.EXPERIENCE },
  })

  for (const question of experienceQuestions) {
    const responses = await prisma.response.findMany({
      where: { questionId: question.id },
    })

    const counts = {
      neverHeardCount: 0,
      wantToTryCount: 0,
      notInterestedCount: 0,
      wouldUseAgainCount: 0,
      wouldNotUseCount: 0,
    }

    responses.forEach(response => {
      switch (response.experience) {
        case Experience.NEVER_HEARD:
          counts.neverHeardCount++
          break
        case Experience.WANT_TO_TRY:
          counts.wantToTryCount++
          break
        case Experience.NOT_INTERESTED:
          counts.notInterestedCount++
          break
        case Experience.WOULD_USE_AGAIN:
          counts.wouldUseAgainCount++
          break
        case Experience.WOULD_NOT_USE:
          counts.wouldNotUseCount++
          break
      }
    })

    const total = responses.length
    const heardCount = total - counts.neverHeardCount
    const usedCount = counts.wouldUseAgainCount + counts.wouldNotUseCount

    await prisma.experienceMetric.upsert({
      where: { toolName: question.title },
      create: {
        toolName: question.title,
        category: question.category,
        ...counts,
        awarenessRate: total > 0 ? heardCount / total : 0,
        adoptionRate: total > 0 ? usedCount / total : 0,
        satisfactionRate:
          usedCount > 0 ? counts.wouldUseAgainCount / usedCount : 0,
        totalResponses: total,
      },
      update: {
        ...counts,
        awarenessRate: total > 0 ? heardCount / total : 0,
        adoptionRate: total > 0 ? usedCount / total : 0,
        satisfactionRate:
          usedCount > 0 ? counts.wouldUseAgainCount / usedCount : 0,
        totalResponses: total,
      },
    })
  }

  console.log(
    `✅ Updated experience metrics for ${experienceQuestions.length} tools`
  )
}

async function createTrendData() {
  console.log('📈 Creating trend data...')

  const metrics = await prisma.experienceMetric.findMany()
  const now = new Date()
  const months = [
    new Date(now.getFullYear(), now.getMonth() - 2, 1),
    new Date(now.getFullYear(), now.getMonth() - 1, 1),
    new Date(now.getFullYear(), now.getMonth(), 1),
  ]

  const trendData = []
  for (const metric of metrics) {
    for (let i = 0; i < months.length; i++) {
      const baseAwareness = metric.awarenessRate || 0.5
      const baseAdoption = metric.adoptionRate || 0.3
      const baseSatisfaction = metric.satisfactionRate || 0.7

      trendData.push(
        prisma.experienceTrend.create({
          data: {
            toolName: metric.toolName,
            category: metric.category,
            month: months[i],
            awarenessRate: baseAwareness - 0.05 * (2 - i),
            adoptionRate: baseAdoption - 0.03 * (2 - i),
            satisfactionRate: baseSatisfaction + 0.02 * i,
            changeFromPrev: i === 0 ? null : 0.02,
            distribution: {
              neverHeard: metric.neverHeardCount,
              wantToTry: metric.wantToTryCount,
              notInterested: metric.notInterestedCount,
              wouldUseAgain: metric.wouldUseAgainCount,
              wouldNotUse: metric.wouldNotUseCount,
            },
          },
        })
      )
    }
  }

  await Promise.all(trendData)
  console.log('✅ Created trend data')
}

export async function seed(options: SeedOptions = {}) {
  const {
    clearData = true,
    createQuestions = true,
    createFakeResponses: shouldCreateResponses = true,
    numberOfResponses = 50,
  } = options

  console.log('🌱 Starting consolidated database seed...')
  console.log('   Options:', {
    clearData,
    createQuestions,
    createFakeResponses: shouldCreateResponses,
    numberOfResponses,
  })

  try {
    if (clearData) {
      await clearExistingData()
    }

    if (createQuestions) {
      await createDemographicQuestions()
      await createAIToolQuestions()
      await createEditorQuestions()
      await createFrameworkQuestions()
      await createOpinionQuestions()
    }

    if (shouldCreateResponses) {
      await createFakeResponses(numberOfResponses)
      await updateExperienceMetrics()
      await createTrendData()
    }

    const totalQuestions = await prisma.question.count()
    const totalSessions = await prisma.userSession.count()
    const totalResponses = await prisma.response.count()
    const totalMetrics = await prisma.experienceMetric.count()

    console.log('\n🎉 Seed completed successfully!')
    console.log(`   📋 Questions: ${totalQuestions}`)
    console.log(`   👤 Sessions: ${totalSessions}`)
    console.log(`   📝 Responses: ${totalResponses}`)
    console.log(`   📊 Metrics: ${totalMetrics}`)

    return {
      questions: totalQuestions,
      sessions: totalSessions,
      responses: totalResponses,
      metrics: totalMetrics,
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const options: SeedOptions = {}

  // Parse command line arguments
  if (args.includes('--no-clear')) {
    options.clearData = false
  }
  if (args.includes('--no-questions')) {
    options.createQuestions = false
  }
  if (args.includes('--no-responses')) {
    options.createFakeResponses = false
  }
  const responsesIndex = args.indexOf('--responses')
  if (responsesIndex !== -1 && args[responsesIndex + 1]) {
    options.numberOfResponses = parseInt(args[responsesIndex + 1], 10)
  }

  await seed(options)
}

// Only run main if this file is executed directly
if (require.main === module) {
  main()
    .catch(e => {
      console.error('Error in seed script:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

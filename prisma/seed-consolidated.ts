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

async function createSection1Demographics() {
  console.log('📊 Creating Section 1: Demographics & Background...')

  const questions = await Promise.all([
    // 1.1 Age
    prisma.question.create({
      data: {
        title: 'Age',
        description: 'What is your age?',
        type: QuestionType.DEMOGRAPHIC,
        category: 'demographics',
        orderIndex: 101,
        isRequired: false,
        options: {
          create: [
            { value: 'under_25', label: 'Under 25', orderIndex: 1 },
            { value: '25_34', label: '25-34', orderIndex: 2 },
            { value: '35_44', label: '35-44', orderIndex: 3 },
            { value: '45_54', label: '45-54', orderIndex: 4 },
            { value: '55_64', label: '55-64', orderIndex: 5 },
            { value: '65_plus', label: '65+', orderIndex: 6 },
            {
              value: 'prefer_not_say',
              label: 'Prefer not to say',
              orderIndex: 7,
            },
          ],
        },
      },
    }),

    // 1.2 Gender Identity
    prisma.question.create({
      data: {
        title: 'Gender Identity',
        description: 'How do you identify?',
        type: QuestionType.DEMOGRAPHIC,
        category: 'demographics',
        orderIndex: 102,
        isRequired: false,
        options: {
          create: [
            { value: 'woman', label: 'Woman', orderIndex: 1 },
            { value: 'man', label: 'Man', orderIndex: 2 },
            { value: 'non_binary', label: 'Non-binary', orderIndex: 3 },
            { value: 'other', label: 'Other', orderIndex: 4 },
            {
              value: 'prefer_not_say',
              label: 'Prefer not to say',
              orderIndex: 5,
            },
          ],
        },
      },
    }),

    // 1.3 Years of Professional Experience
    prisma.question.create({
      data: {
        title: 'Years of Professional Experience',
        description:
          'How many years have you been working professionally in software development?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 103,
        isRequired: false,
        options: {
          create: [
            { value: 'less_than_1', label: 'Less than 1 year', orderIndex: 1 },
            { value: '1_3', label: '1-3 years', orderIndex: 2 },
            { value: '4_7', label: '4-7 years', orderIndex: 3 },
            { value: '8_12', label: '8-12 years', orderIndex: 4 },
            { value: '13_20', label: '13-20 years', orderIndex: 5 },
            { value: '20_plus', label: '20+ years', orderIndex: 6 },
          ],
        },
      },
    }),

    // 1.4 Role
    prisma.question.create({
      data: {
        title: 'What is your role?',
        description: 'Select your current role',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 104,
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

    // 1.5 Team Size
    prisma.question.create({
      data: {
        title: 'Team Size',
        description: 'How many people are on your immediate team?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 105,
        isRequired: false,
        options: {
          create: [
            { value: 'solo', label: 'Solo developer', orderIndex: 1 },
            { value: '2_5', label: '2-5 people', orderIndex: 2 },
            { value: '6_10', label: '6-10 people', orderIndex: 3 },
            { value: '11_25', label: '11-25 people', orderIndex: 4 },
            { value: '26_50', label: '26-50 people', orderIndex: 5 },
            { value: '51_100', label: '51-100 people', orderIndex: 6 },
            { value: '100_plus', label: '100+ people', orderIndex: 7 },
          ],
        },
      },
    }),

    // 1.6 Company Size
    prisma.question.create({
      data: {
        title: 'Company Size',
        description: 'How many people work at your company?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 106,
        isRequired: false,
        options: {
          create: [
            { value: '1_10', label: '1-10 employees', orderIndex: 1 },
            { value: '11_50', label: '11-50 employees', orderIndex: 2 },
            { value: '51_200', label: '51-200 employees', orderIndex: 3 },
            { value: '201_1000', label: '201-1,000 employees', orderIndex: 4 },
            {
              value: '1001_5000',
              label: '1,001-5,000 employees',
              orderIndex: 5,
            },
            { value: '5000_plus', label: '5,000+ employees', orderIndex: 6 },
          ],
        },
      },
    }),

    // 1.7 Industry
    prisma.question.create({
      data: {
        title: 'Industry',
        description: 'What industry does your company primarily operate in?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 107,
        isRequired: false,
        options: {
          create: [
            {
              value: 'software_technology',
              label: 'Software/Technology',
              orderIndex: 1,
            },
            {
              value: 'finance_banking_insurance',
              label: 'Finance/Banking/Insurance',
              orderIndex: 2,
            },
            {
              value: 'healthcare_biotech',
              label: 'Healthcare/Biotech',
              orderIndex: 3,
            },
            {
              value: 'ecommerce_retail',
              label: 'E-commerce/Retail',
              orderIndex: 4,
            },
            { value: 'education', label: 'Education', orderIndex: 5 },
            {
              value: 'government_public',
              label: 'Government/Public Sector',
              orderIndex: 6,
            },
            {
              value: 'gaming_entertainment',
              label: 'Gaming/Entertainment',
              orderIndex: 7,
            },
            {
              value: 'transportation_logistics',
              label: 'Transportation/Logistics',
              orderIndex: 8,
            },
            { value: 'other', label: 'Other', orderIndex: 9 },
          ],
        },
      },
    }),

    // 1.8 Country/Region
    prisma.question.create({
      data: {
        title: 'What is your country or region?',
        description: 'Select your country or region',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 108,
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

    // 1.9 Preferred Programming Language
    prisma.question.create({
      data: {
        title: 'What is your preferred programming language?',
        description: 'Select your preferred programming language',
        type: QuestionType.SINGLE_CHOICE,
        category: 'demographics',
        orderIndex: 109,
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

  console.log('✅ Created Section 1: Demographics & Background')
  return questions
}

async function createSection2Organizational() {
  console.log('🏢 Creating Section 2: Organizational Context & Policies...')

  const questions = await Promise.all([
    // 2.1 Company AI Tool Policy
    prisma.question.create({
      data: {
        title: 'Company AI Tool Policy',
        description: "What is your company's policy on AI coding tools?",
        type: QuestionType.SINGLE_CHOICE,
        category: 'organizational',
        orderIndex: 201,
        isRequired: false,
        options: {
          create: [
            {
              value: 'provides_mandates',
              label: 'Company provides and mandates specific AI tools',
              orderIndex: 1,
            },
            {
              value: 'provides_optional',
              label: 'Company provides approved AI tools (optional use)',
              orderIndex: 2,
            },
            {
              value: 'expense_approved',
              label: 'Employees can expense approved AI tools',
              orderIndex: 3,
            },
            {
              value: 'employee_discretion',
              label: 'Employees can use any tools at their discretion',
              orderIndex: 4,
            },
            {
              value: 'prohibited',
              label: 'AI coding tools are explicitly prohibited',
              orderIndex: 5,
            },
            { value: 'no_policy', label: 'No formal policy', orderIndex: 6 },
            { value: 'dont_know', label: "Don't know", orderIndex: 7 },
          ],
        },
      },
    }),

    // 2.2 Security/Compliance Requirements
    prisma.question.create({
      data: {
        title: 'Security/Compliance Requirements',
        description:
          'What security or compliance requirements apply to your AI tool usage? (Select all that apply)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'organizational',
        orderIndex: 202,
        isRequired: false,
        options: {
          create: [
            {
              value: 'code_stays_internal',
              label: 'Code cannot leave company infrastructure',
              orderIndex: 1,
            },
            {
              value: 'on_premises_only',
              label: 'Must use on-premises/self-hosted solutions only',
              orderIndex: 2,
            },
            {
              value: 'soc2_certified',
              label: 'Must use SOC 2 certified tools',
              orderIndex: 3,
            },
            {
              value: 'gdpr_privacy',
              label: 'Must comply with GDPR/privacy regulations',
              orderIndex: 4,
            },
            {
              value: 'hipaa_healthcare',
              label: 'Must comply with HIPAA/healthcare regulations',
              orderIndex: 5,
            },
            {
              value: 'financial_regulations',
              label: 'Must comply with financial services regulations',
              orderIndex: 6,
            },
            {
              value: 'no_requirements',
              label: 'No specific requirements',
              orderIndex: 7,
            },
            { value: 'dont_know', label: "Don't know", orderIndex: 8 },
          ],
        },
      },
    }),

    // 2.3 Budget for AI Tools
    prisma.question.create({
      data: {
        title: 'Budget for AI Tools (Per Developer/Year)',
        description:
          "What is your company's budget for AI coding tools per developer per year?",
        type: QuestionType.SINGLE_CHOICE,
        category: 'organizational',
        orderIndex: 203,
        isRequired: false,
        options: {
          create: [
            { value: 'zero', label: '$0 (no budget)', orderIndex: 1 },
            { value: '1_100', label: '$1-$100', orderIndex: 2 },
            { value: '101_300', label: '$101-$300', orderIndex: 3 },
            { value: '301_600', label: '$301-$600', orderIndex: 4 },
            { value: '601_1200', label: '$601-$1,200', orderIndex: 5 },
            { value: '1200_plus', label: '$1,200+', orderIndex: 6 },
            { value: 'dont_know', label: "Don't know", orderIndex: 7 },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created Section 2: Organizational Context & Policies')
  return questions
}

async function createSection3UsagePatterns() {
  console.log('💻 Creating Section 3: Usage Patterns & Preferences...')

  const questions = await Promise.all([
    // 3.1 Current AI Tool Usage Frequency
    prisma.question.create({
      data: {
        title: 'Current AI Tool Usage Frequency',
        description: 'How often do you use AI coding tools?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'usage',
        orderIndex: 301,
        isRequired: false,
        options: {
          create: [
            {
              value: 'multiple_daily',
              label: 'Multiple times per day',
              orderIndex: 1,
            },
            { value: 'daily', label: 'Daily', orderIndex: 2 },
            {
              value: 'several_weekly',
              label: 'Several times per week',
              orderIndex: 3,
            },
            { value: 'weekly', label: 'Weekly', orderIndex: 4 },
            {
              value: 'occasionally',
              label: 'Occasionally (less than weekly)',
              orderIndex: 5,
            },
            {
              value: 'never',
              label: 'Never used AI coding tools',
              orderIndex: 6,
            },
          ],
        },
      },
    }),

    // 3.2 Model Preference
    prisma.question.create({
      data: {
        title: 'Model Preference',
        description: 'What type of AI models do you prefer to use?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'usage',
        orderIndex: 302,
        isRequired: false,
        options: {
          create: [
            {
              value: 'exclusively_cloud',
              label: 'Exclusively cloud/API models (OpenAI, Anthropic, etc.)',
              orderIndex: 1,
            },
            {
              value: 'primarily_cloud',
              label: 'Primarily cloud models with some local',
              orderIndex: 2,
            },
            {
              value: 'mix_equal',
              label: 'Mix of cloud and local models equally',
              orderIndex: 3,
            },
            {
              value: 'primarily_local',
              label: 'Primarily local models with some cloud',
              orderIndex: 4,
            },
            {
              value: 'exclusively_local',
              label: 'Exclusively local/self-hosted models',
              orderIndex: 5,
            },
            {
              value: 'not_sure',
              label: "Not sure what models I'm using",
              orderIndex: 6,
            },
          ],
        },
      },
    }),

    // 3.3 Primary Use Cases
    prisma.question.create({
      data: {
        title: 'Primary Use Cases',
        description:
          'What do you primarily use AI coding tools for? (Select all that apply)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'usage',
        orderIndex: 303,
        isRequired: false,
        options: {
          create: [
            {
              value: 'code_generation',
              label: 'Code generation/completion',
              orderIndex: 1,
            },
            {
              value: 'bug_fixing',
              label: 'Bug fixing/debugging',
              orderIndex: 2,
            },
            { value: 'code_review', label: 'Code review', orderIndex: 3 },
            { value: 'refactoring', label: 'Refactoring', orderIndex: 4 },
            { value: 'writing_tests', label: 'Writing tests', orderIndex: 5 },
            {
              value: 'documentation',
              label: 'Documentation generation',
              orderIndex: 6,
            },
            {
              value: 'learning',
              label: 'Learning new languages/frameworks',
              orderIndex: 7,
            },
            {
              value: 'architecture',
              label: 'Architecture/design discussions',
              orderIndex: 8,
            },
            {
              value: 'database_optimization',
              label: 'Database/query optimization',
              orderIndex: 9,
            },
            {
              value: 'devops_infrastructure',
              label: 'DevOps/infrastructure code',
              orderIndex: 10,
            },
            {
              value: 'security_analysis',
              label: 'Security analysis',
              orderIndex: 11,
            },
          ],
        },
      },
    }),

    // 3.4 Development Environment
    prisma.question.create({
      data: {
        title: 'Development Environment',
        description:
          'What development environments do you use? (Select all that apply)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'usage',
        orderIndex: 304,
        isRequired: false,
        options: {
          create: [
            { value: 'vscode', label: 'VS Code', orderIndex: 1 },
            {
              value: 'jetbrains',
              label: 'JetBrains IDEs (IntelliJ, PyCharm, etc.)',
              orderIndex: 2,
            },
            { value: 'visual_studio', label: 'Visual Studio', orderIndex: 3 },
            { value: 'neovim_vim', label: 'Neovim/Vim', orderIndex: 4 },
            { value: 'emacs', label: 'Emacs', orderIndex: 5 },
            { value: 'xcode', label: 'Xcode', orderIndex: 6 },
            { value: 'android_studio', label: 'Android Studio', orderIndex: 7 },
            { value: 'web_based', label: 'Web-based IDEs', orderIndex: 8 },
            {
              value: 'terminal_cli',
              label: 'Terminal/CLI only',
              orderIndex: 9,
            },
            { value: 'other', label: 'Other', orderIndex: 10 },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created Section 3: Usage Patterns & Preferences')
  return questions
}

async function createSection4SentimentImpact() {
  console.log('📈 Creating Section 4: Sentiment & Impact...')

  const questions = await Promise.all([
    // 4.1 Personal Sentiment
    prisma.question.create({
      data: {
        title: 'Personal Sentiment Toward AI Coding Tools',
        description: 'How do you personally feel about AI coding tools?',
        type: QuestionType.RATING,
        category: 'sentiment',
        orderIndex: 401,
        isRequired: false,
      },
    }),

    // 4.2 Team Sentiment
    prisma.question.create({
      data: {
        title: 'Team Sentiment',
        description: 'How does your team feel about AI coding tools?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'sentiment',
        orderIndex: 402,
        isRequired: false,
        options: {
          create: [
            {
              value: 'very_enthusiastic',
              label: 'Very enthusiastic',
              orderIndex: 1,
            },
            {
              value: 'mostly_positive',
              label: 'Mostly positive',
              orderIndex: 2,
            },
            { value: 'mixed', label: 'Mixed reactions', orderIndex: 3 },
            {
              value: 'mostly_skeptical',
              label: 'Mostly skeptical',
              orderIndex: 4,
            },
            { value: 'very_resistant', label: 'Very resistant', orderIndex: 5 },
            {
              value: 'not_applicable',
              label: 'Not applicable/work alone',
              orderIndex: 6,
            },
          ],
        },
      },
    }),

    // 4.3 Productivity Impact
    prisma.question.create({
      data: {
        title: 'Productivity Impact',
        description: 'How have AI coding tools impacted your productivity?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'sentiment',
        orderIndex: 403,
        isRequired: false,
        options: {
          create: [
            {
              value: 'significant_increase',
              label: 'Significant increase (>50%)',
              orderIndex: 1,
            },
            {
              value: 'moderate_increase',
              label: 'Moderate increase (20-50%)',
              orderIndex: 2,
            },
            {
              value: 'slight_increase',
              label: 'Slight increase (5-20%)',
              orderIndex: 3,
            },
            {
              value: 'no_change',
              label: 'No noticeable change',
              orderIndex: 4,
            },
            {
              value: 'slight_decrease',
              label: 'Slight decrease',
              orderIndex: 5,
            },
            {
              value: 'moderate_decrease',
              label: 'Moderate decrease',
              orderIndex: 6,
            },
            {
              value: 'significant_decrease',
              label: 'Significant decrease',
              orderIndex: 7,
            },
          ],
        },
      },
    }),

    // 4.4 Code Quality Impact
    prisma.question.create({
      data: {
        title: 'Code Quality Impact',
        description: 'How have AI coding tools impacted your code quality?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'sentiment',
        orderIndex: 404,
        isRequired: false,
        options: {
          create: [
            {
              value: 'significantly_improved',
              label: 'Significantly improved',
              orderIndex: 1,
            },
            {
              value: 'somewhat_improved',
              label: 'Somewhat improved',
              orderIndex: 2,
            },
            { value: 'no_change', label: 'No change', orderIndex: 3 },
            {
              value: 'somewhat_degraded',
              label: 'Somewhat degraded',
              orderIndex: 4,
            },
            {
              value: 'significantly_degraded',
              label: 'Significantly degraded',
              orderIndex: 5,
            },
            { value: 'too_early', label: 'Too early to tell', orderIndex: 6 },
          ],
        },
      },
    }),

    // 4.5 Biggest Benefits
    prisma.question.create({
      data: {
        title: 'Biggest Benefits',
        description:
          'What are the biggest benefits of AI coding tools? (Select up to 3)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'sentiment',
        orderIndex: 405,
        isRequired: false,
        options: {
          create: [
            {
              value: 'faster_development',
              label: 'Faster development speed',
              orderIndex: 1,
            },
            {
              value: 'reduced_boilerplate',
              label: 'Reduced boilerplate/repetitive coding',
              orderIndex: 2,
            },
            {
              value: 'learning_patterns',
              label: 'Learning new patterns/approaches',
              orderIndex: 3,
            },
            {
              value: 'better_documentation',
              label: 'Better documentation',
              orderIndex: 4,
            },
            {
              value: 'consistent_style',
              label: 'More consistent code style',
              orderIndex: 5,
            },
            {
              value: 'catching_bugs',
              label: 'Catching bugs earlier',
              orderIndex: 6,
            },
            {
              value: 'reduced_cognitive_load',
              label: 'Reduced cognitive load',
              orderIndex: 7,
            },
            {
              value: 'more_creative_time',
              label: 'More time for creative/complex tasks',
              orderIndex: 8,
            },
            {
              value: 'better_test_coverage',
              label: 'Better test coverage',
              orderIndex: 9,
            },
            { value: 'no_benefits', label: 'None/no benefits', orderIndex: 10 },
          ],
        },
      },
    }),

    // 4.6 Biggest Challenges
    prisma.question.create({
      data: {
        title: 'Biggest Challenges',
        description:
          'What are the biggest challenges with AI coding tools? (Select up to 3)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'sentiment',
        orderIndex: 406,
        isRequired: false,
        options: {
          create: [
            {
              value: 'cost_budget',
              label: 'Cost/budget constraints',
              orderIndex: 1,
            },
            {
              value: 'security_privacy',
              label: 'Security/privacy concerns',
              orderIndex: 2,
            },
            {
              value: 'code_quality',
              label: 'Code quality concerns',
              orderIndex: 3,
            },
            {
              value: 'over_reliance',
              label: 'Over-reliance on AI suggestions',
              orderIndex: 4,
            },
            {
              value: 'incorrect_code',
              label: 'Incorrect/hallucinated code',
              orderIndex: 5,
            },
            {
              value: 'context_limitations',
              label: 'Context limitations',
              orderIndex: 6,
            },
            {
              value: 'latency_performance',
              label: 'Latency/performance issues',
              orderIndex: 7,
            },
            {
              value: 'integration_difficulties',
              label: 'Integration difficulties',
              orderIndex: 8,
            },
            {
              value: 'company_restrictions',
              label: 'Company policy restrictions',
              orderIndex: 9,
            },
            {
              value: 'learning_curve',
              label: 'Learning curve',
              orderIndex: 10,
            },
            {
              value: 'language_support',
              label: 'Lack of language/framework support',
              orderIndex: 11,
            },
            {
              value: 'team_resistance',
              label: 'Team resistance/adoption',
              orderIndex: 12,
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created Section 4: Sentiment & Impact')
  return questions
}

async function createSection5AIIDEsAssistants() {
  console.log('🤖 Creating Section 5: AI Coding IDEs & Assistants...')

  const tools = [
    // IDE-Based Assistants
    { name: 'Cursor', category: 'ide_assistants', order: 501 },
    { name: 'Windsurf (Codeium)', category: 'ide_assistants', order: 502 },
    {
      name: 'Claude Code (Anthropic CLI)',
      category: 'ide_assistants',
      order: 503,
    },
    {
      name: 'Qodo Gen (formerly Codium)',
      category: 'ide_assistants',
      order: 504,
    },
    { name: 'Bolt.new', category: 'ide_assistants', order: 505 },
    { name: 'v0 (Vercel)', category: 'ide_assistants', order: 506 },
    { name: 'Replit AI', category: 'ide_assistants', order: 507 },
    { name: 'JetBrains AI Assistant', category: 'ide_assistants', order: 508 },
    {
      name: 'Visual Studio IntelliCode',
      category: 'ide_assistants',
      order: 509,
    },

    // Code Completion/Generation
    { name: 'GitHub Copilot', category: 'code_completion', order: 510 },
    { name: 'Amazon Q Developer', category: 'code_completion', order: 511 },
    { name: 'Tabnine', category: 'code_completion', order: 512 },
    { name: 'Codeium (Free tier)', category: 'code_completion', order: 513 },
    { name: 'Sourcegraph Cody', category: 'code_completion', order: 514 },
    { name: 'Continue.dev', category: 'code_completion', order: 515 },
    { name: 'Aider', category: 'code_completion', order: 516 },
    { name: 'Pieces for Developers', category: 'code_completion', order: 517 },
    { name: 'Augment Code', category: 'code_completion', order: 518 },

    // Enterprise/Team Solutions
    { name: 'Gemini Code Assist (Google)', category: 'enterprise', order: 519 },
    { name: 'CodeWhisperer (AWS)', category: 'enterprise', order: 520 },
    { name: 'Azure AI Assistant', category: 'enterprise', order: 521 },
  ]

  const questions = await Promise.all(
    tools.map(tool =>
      prisma.question.create({
        data: {
          title: tool.name,
          description: `What's your experience with ${tool.name}?`,
          type: QuestionType.EXPERIENCE,
          category: tool.category,
          orderIndex: tool.order,
          isRequired: false,
        },
      })
    )
  )

  console.log('✅ Created Section 5: AI Coding IDEs & Assistants')
  return questions
}

async function createSection6CodeReviewTesting() {
  console.log('🔍 Creating Section 6: AI Code Review & Testing Tools...')

  const tools = [
    // Code Review
    { name: 'CodeRabbit', category: 'code_review', order: 601 },
    { name: 'Qodo Merge (PR-Agent)', category: 'code_review', order: 602 },
    { name: 'Bito AI Code Review', category: 'code_review', order: 603 },
    { name: 'CodeScene', category: 'code_review', order: 604 },
    { name: 'DeepSource', category: 'code_review', order: 605 },
    { name: 'Codacy', category: 'code_review', order: 606 },
    { name: 'PullRequest.com', category: 'code_review', order: 607 },
    { name: 'What The Diff', category: 'code_review', order: 608 },
    { name: 'CodeAnt AI', category: 'code_review', order: 609 },

    // Testing & Quality
    { name: 'Diffblue Cover (Java)', category: 'testing_quality', order: 610 },
    { name: 'Mabl (E2E testing)', category: 'testing_quality', order: 611 },
    {
      name: 'Applitools (Visual testing)',
      category: 'testing_quality',
      order: 612,
    },
    { name: 'Testim.io', category: 'testing_quality', order: 613 },
  ]

  const questions = await Promise.all(
    tools.map(tool =>
      prisma.question.create({
        data: {
          title: tool.name,
          description: `What's your experience with ${tool.name}?`,
          type: QuestionType.EXPERIENCE,
          category: tool.category,
          orderIndex: tool.order,
          isRequired: false,
        },
      })
    )
  )

  console.log('✅ Created Section 6: AI Code Review & Testing Tools')
  return questions
}

async function createSection7AIModels() {
  console.log('🧠 Creating Section 7: AI Models...')

  const models = [
    // OpenAI Models
    { name: 'GPT-4o', category: 'ai_models_openai', order: 701 },
    { name: 'GPT-4o-mini', category: 'ai_models_openai', order: 702 },
    { name: 'o1', category: 'ai_models_openai', order: 703 },
    { name: 'o1-mini', category: 'ai_models_openai', order: 704 },
    { name: 'o3-mini', category: 'ai_models_openai', order: 705 },

    // Anthropic Models
    { name: 'Claude 3.5 Sonnet', category: 'ai_models_anthropic', order: 706 },
    { name: 'Claude 3.5 Haiku', category: 'ai_models_anthropic', order: 707 },
    { name: 'Claude 3 Opus', category: 'ai_models_anthropic', order: 708 },
    { name: 'Claude Opus 4', category: 'ai_models_anthropic', order: 709 },
    { name: 'Claude Opus 4.1', category: 'ai_models_anthropic', order: 710 },

    // Google Models
    { name: 'Gemini 2.5 Pro', category: 'ai_models_google', order: 711 },
    { name: 'Gemini 2.0 Flash', category: 'ai_models_google', order: 712 },
    { name: 'Gemini 1.5 Pro', category: 'ai_models_google', order: 713 },
    { name: 'Gemini 1.5 Flash', category: 'ai_models_google', order: 714 },

    // Open/Local Models
    {
      name: 'DeepSeek-R1 (& distilled)',
      category: 'ai_models_open',
      order: 715,
    },
    { name: 'DeepSeek-V3', category: 'ai_models_open', order: 716 },
    { name: 'DeepSeek Coder', category: 'ai_models_open', order: 717 },
    {
      name: 'Qwen 3 (235B/30B/smaller)',
      category: 'ai_models_open',
      order: 718,
    },
    { name: 'Qwen 2.5 Coder', category: 'ai_models_open', order: 719 },
    { name: 'Llama 3.3 (70B)', category: 'ai_models_open', order: 720 },
    { name: 'Llama 3.1 (405B/70B/8B)', category: 'ai_models_open', order: 721 },
    { name: 'Mistral Large', category: 'ai_models_open', order: 722 },
    { name: 'Codestral (Mistral)', category: 'ai_models_open', order: 723 },
    { name: 'Yi Coder', category: 'ai_models_open', order: 724 },
    { name: 'StarCoder2', category: 'ai_models_open', order: 725 },
    { name: 'Code Llama', category: 'ai_models_open', order: 726 },
    { name: 'WizardCoder', category: 'ai_models_open', order: 727 },
  ]

  const questions = await Promise.all(
    models.map(model =>
      prisma.question.create({
        data: {
          title: model.name,
          description: `Have you used ${model.name} for coding assistance?`,
          type: QuestionType.EXPERIENCE,
          category: model.category,
          orderIndex: model.order,
          isRequired: false,
        },
      })
    )
  )

  console.log('✅ Created Section 7: AI Models')
  return questions
}

async function createSection8FutureOpinions() {
  console.log('🔮 Creating Section 8: Future & Opinions...')

  const questions = await Promise.all([
    // 8.1 AI Impact on Job Security
    prisma.question.create({
      data: {
        title: 'AI Impact on Job Security',
        description:
          "How concerned are you about AI's impact on your job security?",
        type: QuestionType.SINGLE_CHOICE,
        category: 'future',
        orderIndex: 801,
        isRequired: false,
        options: {
          create: [
            { value: 'very_concerned', label: 'Very concerned', orderIndex: 1 },
            {
              value: 'somewhat_concerned',
              label: 'Somewhat concerned',
              orderIndex: 2,
            },
            { value: 'neutral', label: 'Neutral', orderIndex: 3 },
            {
              value: 'somewhat_optimistic',
              label: 'Somewhat optimistic',
              orderIndex: 4,
            },
            {
              value: 'very_optimistic',
              label: 'Very optimistic',
              orderIndex: 5,
            },
          ],
        },
      },
    }),

    // 8.2 Expected AI Tool Usage in 2 Years
    prisma.question.create({
      data: {
        title: 'Expected AI Tool Usage in 2 Years',
        description:
          'How do you expect AI tool usage to change in the next 2 years?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'future',
        orderIndex: 802,
        isRequired: false,
        options: {
          create: [
            {
              value: 'mandatory',
              label: 'Will be mandatory for most developers',
              orderIndex: 1,
            },
            {
              value: 'standard_optional',
              label: 'Will be standard practice but optional',
              orderIndex: 2,
            },
            {
              value: 'commonly_used',
              label: 'Will be commonly used by some',
              orderIndex: 3,
            },
            {
              value: 'remain_niche',
              label: 'Will remain niche/experimental',
              orderIndex: 4,
            },
            {
              value: 'decline',
              label: 'Will decline due to limitations',
              orderIndex: 5,
            },
          ],
        },
      },
    }),

    // 8.3 Most Important Features for Future Tools
    prisma.question.create({
      data: {
        title: 'Most Important Features for Future Tools',
        description:
          'What features are most important for future AI coding tools? (Select up to 3)',
        type: QuestionType.MULTIPLE_CHOICE,
        category: 'future',
        orderIndex: 803,
        isRequired: false,
        options: {
          create: [
            {
              value: 'better_context',
              label: 'Better context understanding (larger context windows)',
              orderIndex: 1,
            },
            {
              value: 'faster_response',
              label: 'Faster response times',
              orderIndex: 2,
            },
            { value: 'lower_cost', label: 'Lower cost', orderIndex: 3 },
            {
              value: 'better_security',
              label: 'Better security/privacy',
              orderIndex: 4,
            },
            {
              value: 'local_deployment',
              label: 'Local/on-premise deployment',
              orderIndex: 5,
            },
            {
              value: 'ide_integration',
              label: 'Better IDE integration',
              orderIndex: 6,
            },
            {
              value: 'multi_file_understanding',
              label: 'Multi-file/project understanding',
              orderIndex: 7,
            },
            {
              value: 'debugging_capabilities',
              label: 'Better debugging capabilities',
              orderIndex: 8,
            },
            {
              value: 'multimodal',
              label: 'Voice/multimodal interaction',
              orderIndex: 9,
            },
            {
              value: 'test_generation',
              label: 'Automated testing generation',
              orderIndex: 10,
            },
            {
              value: 'architecture_assistance',
              label: 'Architecture/design assistance',
              orderIndex: 11,
            },
          ],
        },
      },
    }),

    // 8.4 NPS Score
    prisma.question.create({
      data: {
        title: 'Would You Recommend AI Coding Tools?',
        description:
          'How likely are you to recommend AI coding tools to other developers?',
        type: QuestionType.RATING,
        category: 'future',
        orderIndex: 804,
        isRequired: false,
      },
    }),

    // 8.5 Additional Comments
    prisma.question.create({
      data: {
        title: 'Additional Comments',
        description:
          "Any other thoughts on AI coding tools you'd like to share? (max 1000 characters)",
        type: QuestionType.TEXT,
        category: 'future',
        orderIndex: 805,
        isRequired: false,
      },
    }),
  ])

  console.log('✅ Created Section 8: Future & Opinions')
  return questions
}

async function createSection9FollowUp() {
  console.log('📧 Creating Section 9: Follow-up...')

  const questions = await Promise.all([
    // 9.1 Interest in Results
    prisma.question.create({
      data: {
        title: 'Interest in Results',
        description:
          'Would you like to receive the survey results when available?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'followup',
        orderIndex: 901,
        isRequired: false,
        options: {
          create: [
            {
              value: 'yes_email',
              label: 'Yes, please email me',
              orderIndex: 1,
            },
            { value: 'no_thanks', label: 'No thanks', orderIndex: 2 },
          ],
        },
      },
    }),

    // 9.2 Follow-up Interview
    prisma.question.create({
      data: {
        title: 'Participation in Follow-up',
        description:
          'Would you be interested in participating in a follow-up interview (30 min, compensated)?',
        type: QuestionType.SINGLE_CHOICE,
        category: 'followup',
        orderIndex: 902,
        isRequired: false,
        options: {
          create: [
            { value: 'yes_contact', label: 'Yes', orderIndex: 1 },
            { value: 'maybe_later', label: 'Maybe later', orderIndex: 2 },
            { value: 'no_thanks', label: 'No thanks', orderIndex: 3 },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created Section 9: Follow-up')
  return questions
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
    // Generate a date within the last 90 days, distributed across weeks
    const responseDate = faker.date.recent({ days: 90 })
    const session = await prisma.userSession.create({
      data: {
        id: sessionId,
        demographicData: {
          source: 'seed',
          userAgent: faker.internet.userAgent(),
        },
        completedAt: responseDate,
        createdAt: responseDate,
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
                  createdAt: responseDate,
                },
              })
            }
            continue
          }
          break

        case QuestionType.RATING:
          const isNPS = question.title.includes('recommend')
          if (isNPS) {
            const npsOptions = [
              { value: 0, weight: 5 },
              { value: 1, weight: 5 },
              { value: 2, weight: 5 },
              { value: 3, weight: 5 },
              { value: 4, weight: 5 },
              { value: 5, weight: 10 },
              { value: 6, weight: 10 },
              { value: 7, weight: 15 },
              { value: 8, weight: 20 },
              { value: 9, weight: 15 },
              { value: 10, weight: 5 },
            ]
            const rating = faker.helpers.weightedArrayElement(npsOptions)
            responseData.ratingValue = rating
          } else {
            const ratingOptions = [
              { value: 1, weight: 5 },
              { value: 2, weight: 10 },
              { value: 3, weight: 20 },
              { value: 4, weight: 30 },
              { value: 5, weight: 35 },
            ]
            const rating = faker.helpers.weightedArrayElement(ratingOptions)
            responseData.ratingValue = rating
          }
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
            'Security concerns need to be addressed.',
            'The learning curve is steep but worth it.',
            'Integration with existing tools could be improved.',
            'Really impressed with the code generation capabilities.',
            'Would like to see more language support.',
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
            question.title.includes('ChatGPT') ||
            question.title.includes('GPT-4')
          ) {
            experienceWeights = [
              { value: Experience.NEVER_HEARD, weight: 5 },
              { value: Experience.WANT_TO_TRY, weight: 15 },
              { value: Experience.NOT_INTERESTED, weight: 10 },
              { value: Experience.WOULD_USE_AGAIN, weight: 50 },
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
            question.title.includes('DeepSeek') ||
            question.title.includes('Qwen') ||
            question.title.includes('o3-mini')
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
        responseData.createdAt = responseDate
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
      await createSection1Demographics()
      await createSection2Organizational()
      await createSection3UsagePatterns()
      await createSection4SentimentImpact()
      await createSection5AIIDEsAssistants()
      await createSection6CodeReviewTesting()
      await createSection7AIModels()
      await createSection8FutureOpinions()
      await createSection9FollowUp()
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

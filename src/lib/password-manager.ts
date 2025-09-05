const SURVEY_PASSWORD = process.env.SURVEY_PASSWORD || 'secret'

export async function validatePassword(
  inputPassword: string
): Promise<boolean> {
  return inputPassword === SURVEY_PASSWORD
}

export function getPassword(): string {
  return SURVEY_PASSWORD
}

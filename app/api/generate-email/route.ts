import { NextResponse } from 'next/server'

interface Recipient {
  name: string
  email: string
  company?: string
  role?: string
  context?: string
}

interface RequestBody {
  recipients: Recipient[]
  emailPurpose: string
  yourName: string
  yourCompany?: string
}

function generatePersonalizedEmail(
  recipient: Recipient,
  emailPurpose: string,
  yourName: string,
  yourCompany?: string
) {
  const greetings = [
    `Hi ${recipient.name.split(' ')[0]}`,
    `Hello ${recipient.name.split(' ')[0]}`,
    `Hey ${recipient.name.split(' ')[0]}`,
  ]

  const greeting = greetings[Math.floor(Math.random() * greetings.length)]

  // Personalization elements
  const companyMention = recipient.company
    ? `I noticed your work at ${recipient.company}`
    : `I came across your profile`

  const roleMention = recipient.role
    ? ` as ${recipient.role}`
    : ''

  const contextMention = recipient.context
    ? `\n\n${recipient.context}`
    : ''

  // Opening hooks with variations
  const openingHooks = [
    `${companyMention}${roleMention} and was impressed by your approach to innovation.`,
    `${companyMention}${roleMention} and thought you might be interested in what we're building.`,
    `${companyMention}${roleMention} and I believe there could be a valuable connection here.`,
  ]

  const opening = openingHooks[Math.floor(Math.random() * openingHooks.length)]

  // Value propositions
  const valueProps = [
    'I wanted to reach out because I think there\'s a strong alignment between what you\'re working on and what we\'re building.',
    'I\'m reaching out because I believe we could help solve some challenges you might be facing.',
    'I thought this might be relevant to your current initiatives.',
  ]

  const valueProp = valueProps[Math.floor(Math.random() * valueProps.length)]

  // Call to actions
  const ctas = [
    'Would you be open to a quick 15-minute call next week to explore this further?',
    'I\'d love to share more details. Are you available for a brief conversation?',
    'Would you be interested in learning more? I can share some specific examples of how this could help.',
    'Let me know if you\'d like to chat - even just 10 minutes would be great.',
  ]

  const cta = ctas[Math.floor(Math.random() * ctas.length)]

  // Closings
  const closings = [
    'Looking forward to hearing from you',
    'Hope to connect soon',
    'Excited to potentially work together',
    'Thanks for considering',
  ]

  const closing = closings[Math.floor(Math.random() * closings.length)]

  // Build email body
  const body = `${greeting},

${opening}${contextMention}

${valueProp} ${emailPurpose}

${cta}

${closing},
${yourName}${yourCompany ? `\n${yourCompany}` : ''}`

  // Generate subject line
  const subjectTemplates = [
    `Quick question about ${recipient.company || 'your work'}`,
    `${recipient.name.split(' ')[0]} - thought this might interest you`,
    `Collaboration opportunity for ${recipient.company || recipient.name.split(' ')[0]}`,
    `Following up on ${recipient.company || 'your recent work'}`,
    `${recipient.name.split(' ')[0]}, let's connect`,
    `Idea for ${recipient.company || 'you'}`,
    `${yourCompany || yourName} x ${recipient.company || recipient.name.split(' ')[0]}`,
  ]

  const subject = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)]

  return {
    subject,
    body,
    recipient
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { recipients, emailPurpose, yourName, yourCompany } = body

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'No recipients provided' },
        { status: 400 }
      )
    }

    if (!emailPurpose || !yourName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const emails = recipients.map(recipient =>
      generatePersonalizedEmail(recipient, emailPurpose, yourName, yourCompany)
    )

    return NextResponse.json({ emails })
  } catch (error) {
    console.error('Error generating emails:', error)
    return NextResponse.json(
      { error: 'Failed to generate emails' },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import { Mail, Sparkles, Copy, Check, Users, Send } from 'lucide-react'

interface Recipient {
  name: string
  email: string
  company?: string
  role?: string
  context?: string
}

interface GeneratedEmail {
  subject: string
  body: string
  recipient: Recipient
}

export default function Home() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [currentRecipient, setCurrentRecipient] = useState<Recipient>({
    name: '',
    email: '',
    company: '',
    role: '',
    context: ''
  })
  const [emailPurpose, setEmailPurpose] = useState('')
  const [yourName, setYourName] = useState('')
  const [yourCompany, setYourCompany] = useState('')
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const addRecipient = () => {
    if (currentRecipient.name && currentRecipient.email) {
      setRecipients([...recipients, currentRecipient])
      setCurrentRecipient({
        name: '',
        email: '',
        company: '',
        role: '',
        context: ''
      })
    }
  }

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index))
  }

  const generateEmails = async () => {
    if (recipients.length === 0 || !emailPurpose || !yourName) {
      alert('Please add recipients and fill in required fields')
      return
    }

    setIsGenerating(true)
    setGeneratedEmails([])

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          emailPurpose,
          yourName,
          yourCompany
        }),
      })

      const data = await response.json()
      setGeneratedEmails(data.emails)
    } catch (error) {
      console.error('Error generating emails:', error)
      alert('Error generating emails. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail className="w-12 h-12 text-blue-600" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Cold Email Agent
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Generate personalized, attractive cold emails powered by AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left Column: Setup */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              Your Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={yourName}
                  onChange={(e) => setYourName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Company
                </label>
                <input
                  type="text"
                  value={yourCompany}
                  onChange={(e) => setYourCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Purpose *
                </label>
                <textarea
                  value={emailPurpose}
                  onChange={(e) => setEmailPurpose(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="e.g., Introduce our SaaS product that helps companies automate customer support..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-green-500" />
              Add Recipients
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={currentRecipient.name}
                onChange={(e) => setCurrentRecipient({...currentRecipient, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Recipient Name *"
              />
              <input
                type="email"
                value={currentRecipient.email}
                onChange={(e) => setCurrentRecipient({...currentRecipient, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com *"
              />
              <input
                type="text"
                value={currentRecipient.company}
                onChange={(e) => setCurrentRecipient({...currentRecipient, company: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company (optional)"
              />
              <input
                type="text"
                value={currentRecipient.role}
                onChange={(e) => setCurrentRecipient({...currentRecipient, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Role/Title (optional)"
              />
              <textarea
                value={currentRecipient.context}
                onChange={(e) => setCurrentRecipient({...currentRecipient, context: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Additional context (optional, e.g., 'Met at conference', 'Posted about AI on LinkedIn')"
              />
              <button
                onClick={addRecipient}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Add Recipient
              </button>
            </div>

            {recipients.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold text-gray-700">Recipients ({recipients.length})</h3>
                {recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-sm text-gray-600">{recipient.email}</p>
                      {recipient.company && (
                        <p className="text-xs text-gray-500">{recipient.company} {recipient.role && `- ${recipient.role}`}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeRecipient(index)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={generateEmails}
            disabled={isGenerating || recipients.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Emails...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate {recipients.length} Email{recipients.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Emails */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-500" />
              Generated Emails
            </h2>

            {generatedEmails.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Your generated emails will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {generatedEmails.map((email, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-800">{email.recipient.name}</p>
                        <p className="text-sm text-gray-600">{email.recipient.email}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`, index)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-blue-50 rounded p-3 mb-3">
                      <p className="text-xs font-semibold text-blue-700 mb-1">SUBJECT:</p>
                      <p className="text-sm font-medium text-gray-800">{email.subject}</p>
                    </div>

                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">EMAIL BODY:</p>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{email.body}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

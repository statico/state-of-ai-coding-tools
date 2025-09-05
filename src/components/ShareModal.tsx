'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Share2, Copy, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface ShareModalProps {
  iconOnly?: boolean
}

export function ShareModal({ iconOnly = false }: ShareModalProps) {
  const { currentPassword } = useAuth()
  const [copied, setCopied] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const surveyUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const copyToClipboard = async (text: string, type: 'url' | 'password') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'url') {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        setCopiedPassword(true)
        setTimeout(() => setCopiedPassword(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyBoth = async () => {
    const shareText = `Join the AI Coding Tools Weekly Survey!\n\nURL: ${surveyUrl}\nPassword: ${currentPassword}`
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setCopiedPassword(true)
      setTimeout(() => {
        setCopied(false)
        setCopiedPassword(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button variant="outline" size="icon" title="Share Survey">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share Survey</span>
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Survey
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share the Weekly Survey</DialogTitle>
          <DialogDescription>
            Share the survey link and password with your colleagues
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">Survey URL</Label>
            <div className="flex gap-2">
              <Input id="url" value={surveyUrl} readOnly className="flex-1" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(surveyUrl, 'url')}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input
                id="password"
                value={currentPassword || 'Loading...'}
                readOnly
                className="flex-1 font-mono"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  copyToClipboard(currentPassword || '', 'password')
                }
                disabled={!currentPassword}
              >
                {copiedPassword ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full"
              onClick={copyBoth}
              disabled={!currentPassword}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Both to Clipboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

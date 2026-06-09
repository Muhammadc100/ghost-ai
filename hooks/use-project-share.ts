"use client"

import { useCallback, useEffect, useState } from "react"

export interface ProjectSharePerson {
  email: string | null
  displayName: string
  avatarUrl: string | null
  role: "owner" | "collaborator"
}

interface ProjectShareDetails {
  projectId: string
  projectName: string
  canManage: boolean
  owner: ProjectSharePerson
  collaborators: ProjectSharePerson[]
}

interface UseProjectShareResult {
  data: ProjectShareDetails | null
  inviteEmail: string
  loading: boolean
  submitting: boolean
  removingEmail: string | null
  error: string | null
  copied: boolean
  setInviteEmail: (email: string) => void
  invite: () => Promise<void>
  remove: (email: string) => Promise<void>
  copyLink: () => void
}

export function useProjectShare(
  projectId: string,
  open: boolean
): UseProjectShareResult {
  const [data, setData] = useState<ProjectShareDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState("")
  const [copied, setCopied] = useState(false)

  // Fetch share details when dialog opens
  useEffect(() => {
    if (!open) {
      setData(null)
      setInviteEmail("")
      setError(null)
      setCopied(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/api/projects/${projectId}/collaborators`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load collaborators")
        }
        return res.json()
      })
      .then((json) => {
        setData(json.share)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [open, projectId])

  const invite = useCallback(async () => {
    if (!inviteEmail.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
        credentials: "include",
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error ?? "Failed to invite")
      }

      setInviteEmail("")
      // Refresh the list
      const detailsRes = await fetch(
        `/api/projects/${projectId}/collaborators`,
        {
          credentials: "include",
        }
      )
      if (detailsRes.ok) {
        const json = await detailsRes.json()
        setData(json.share)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite")
    } finally {
      setSubmitting(false)
    }
  }, [inviteEmail, projectId])

  const remove = useCallback(
    async (email: string) => {
      setRemovingEmail(email)
      setError(null)

      try {
        const res = await fetch(`/api/projects/${projectId}/collaborators`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
          credentials: "include",
        })

        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json.error ?? "Failed to remove")
        }

        // Refresh the list
        const detailsRes = await fetch(
          `/api/projects/${projectId}/collaborators`,
          {
            credentials: "include",
          }
        )
        if (detailsRes.ok) {
          const json = await detailsRes.json()
          setData(json.share)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove")
      } finally {
        setRemovingEmail(null)
      }
    },
    [projectId]
  )

  const copyLink = useCallback(() => {
    const url = `${window.location.origin}/editor/${projectId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [projectId])

  return {
    data,
    inviteEmail,
    loading,
    submitting,
    removingEmail,
    error,
    copied,
    setInviteEmail,
    invite,
    remove,
    copyLink,
  }
}
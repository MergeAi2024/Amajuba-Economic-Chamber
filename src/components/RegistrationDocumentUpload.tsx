'use client'

import { useMemo, useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const BUCKET = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET as string | undefined) ?? 'Registrations'

const createSupabaseClient = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

type RegistrationDocumentUploadProps = {
  onUploadSuccess?: (publicUrl: string, file: File) => void
}

export default function RegistrationDocumentUpload({ onUploadSuccess }: RegistrationDocumentUploadProps) {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const normalizeFileName = (name: string) => {
    return name.replaceAll(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
  }

  const onUpload = async () => {
    if (!file) {
      setMessage('Choose a file first.')
      return
    }

    if (!supabase) {
      setMessage('Supabase client is not configured.')
      return
    }

    setMessage(null)
    setUploading(true)

    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser()
      if (userErr) {
        throw userErr
      }

      const user = userData.user
      if (!user) {
        throw new Error('Not authenticated.')
      }

      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
      const safeName = normalizeFileName(file.name)
      const objectPath = `${user.id}/${safeName}-${Date.now()}.${ext}`

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, file, {
          contentType: file.type || undefined,
        })

      if (error) {
        throw error
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
      if (!urlData?.publicUrl) {
        throw new Error('Unable to retrieve public URL after upload.')
      }

      console.log('Uploaded OK:', { path: data.path })
      setMessage('Upload successful!')
      onUploadSuccess?.(urlData.publicUrl, file)
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Upload failed.'
      console.error(e)
      setMessage(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Supporting Document</label>
        <input
          type="file"
          onChange={event => setFile(event.target.files?.[0] ?? null)}
          disabled={uploading}
          className="w-full text-sm text-slate-700 file:border file:border-slate-300 file:bg-slate-100 file:px-3 file:py-2 file:rounded-xl"
        />
      </div>

      <button
        type="button"
        onClick={onUpload}
        disabled={uploading || !file}
        className="inline-flex items-center justify-center rounded-xl bg-chamber-blue px-5 py-3 text-sm font-semibold text-white hover:bg-chamber-navy disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {uploading ? 'Uploading…' : 'Upload document'}
      </button>

      {message && (
        <p className={`text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Trash2 } from 'lucide-react'

interface ModuleActionsProps {
  moduleId: string
  moduleTitle: string
}

export function ModuleActions({ moduleId, moduleTitle }: ModuleActionsProps) {
  const router = useRouter()
  const [duplicating, setDuplicating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDuplicate = async () => {
    if (duplicating) return

    setDuplicating(true)
    try {
      const response = await fetch(`/api/admin/modules/${moduleId}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to duplicate module')

      const data = await response.json()
      alert(`Module duplicated successfully as "${data.module.title}"`)
      router.refresh()
    } catch (error) {
      console.error('Error duplicating module:', error)
      alert('Failed to duplicate module. Please try again.')
    } finally {
      setDuplicating(false)
    }
  }

  const handleDelete = async () => {
    if (deleting) return

    const confirmed = confirm(
      `Are you sure you want to delete "${moduleTitle}"?\n\nThis will permanently delete:\n- The module\n- All content sections\n- All student progress\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete module')

      alert('Module deleted successfully')
      router.refresh()
    } catch (error) {
      console.error('Error deleting module:', error)
      alert('Failed to delete module. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Duplicate */}
      <button
        onClick={handleDuplicate}
        disabled={duplicating}
        className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
        title="Duplicate module"
      >
        <Copy className="w-5 h-5" />
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        title="Delete module"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </>
  )
}

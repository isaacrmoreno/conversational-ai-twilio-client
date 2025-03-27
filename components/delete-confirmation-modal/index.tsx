'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Loader2, Trash2 } from 'lucide-react'

interface DeleteConfirmationModalProps {
  onDelete: () => Promise<void> | void
  title?: string
  description?: string
  itemName?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  isLoading?: boolean
  trigger?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export default function DeleteConfirmationModal({
  onDelete,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  isLoading: externalIsLoading,
  trigger,
  variant = 'destructive',
  size = 'default',
  className = ''
}: DeleteConfirmationModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [internalIsLoading, setInternalIsLoading] = useState(false)

  // Use either external or internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
  const setIsOpen = externalOnOpenChange || setInternalIsOpen
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading

  const handleDelete = async () => {
    if (!externalIsLoading) setInternalIsLoading(true)

    try {
      await onDelete()
      setIsOpen(false)
    } catch (error) {
      console.error('Error during deletion:', error)
    } finally {
      if (!externalIsLoading) setInternalIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size} className={className}>
            <Trash2 className='h-4 w-4 mr-2' />
            Delete{itemName ? ` ${itemName}` : ''}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {itemName && <p className='mt-2 font-medium text-destructive'>"{itemName}"</p>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button variant='outline' onClick={() => setIsOpen(false)} disabled={isLoading} className='mr-2'>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { AlertCircle } from 'lucide-react'
import React from 'react'

const Error = ({ error }: { error: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-red-600">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>{error || "Something went wrong!"}</p>
      </div>
  )
}

export default Error
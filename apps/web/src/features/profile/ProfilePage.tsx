import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { useGetProfileQuery, useUpdateProfileMutation } from '@porchlite/api'

export const ProfilePage = () => {
  const { user } = useAuth()
  const { data: profile, isLoading } = useGetProfileQuery(user?.id ?? '', { skip: !user })
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation()

  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName)
      setBio(profile.bio ?? '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    await updateProfile({
      userId: user.id,
      updates: { displayName, bio: bio || null },
    })
    setEditing(false)
  }

  if (isLoading) {
    return <p className="text-stone-400 text-center py-16">Loading profile...</p>
  }

  if (!profile) {
    return <p className="text-red-600 text-center py-16">Could not load profile.</p>
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Your Profile</h2>

      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-stone-900">{profile.displayName}</p>
            <p className="text-sm text-stone-500">{profile.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-stone-700 mb-1">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-stone-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="A little about yourself..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900
                           placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500
                           focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !displayName.trim()}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium
                           hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setDisplayName(profile.displayName)
                  setBio(profile.bio ?? '')
                }}
                className="px-4 py-2 rounded-lg text-stone-600 text-sm font-medium
                           hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {profile.bio ? (
              <p className="text-stone-600">{profile.bio}</p>
            ) : (
              <p className="text-stone-400 italic">No bio yet</p>
            )}
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg text-amber-600 text-sm font-medium
                         hover:bg-amber-50 transition-colors"
            >
              Edit profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

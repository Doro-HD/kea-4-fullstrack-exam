import { BASE_URL } from '../stores/base'
import { writable, get } from 'svelte/store'

const user = await authorize()

async function authorize() {
  let user = {}

  const username = localStorage.getItem('username')
  const sessionExpiration = localStorage.getItem('sessionExpiration')

  let isSessionNotExpired = false
  if (sessionExpiration) {
    const date = new Date(sessionExpiration)

    isSessionNotExpired = date > Date.now()
  }

  if (!username || !isSessionNotExpired) {
    const response = await fetch(get(BASE_URL) + '/protected/users/self', {
      credentials: 'include'
    })
    const responseData = await response.json()

    if (responseData.user) {
      user = { username: responseData.user.username }
    }
  } else {
    user = { username: username }
  }

  return user
}

export const session = writable(user)
export const setSession = (username, sessionExpiration) => {
  localStorage.setItem('username', username)
  localStorage.setItem('sessionExpiration', sessionExpiration)

  session.update(data => {
    data.username = username

    return data
  })
}
export const destroySession = async () => {
  const response = await fetch(get(BASE_URL) + '/auth/signOut', {
    credentials: 'include'
  })

  if (response.ok) {
    session.set({})
    localStorage.clear()
  }
}


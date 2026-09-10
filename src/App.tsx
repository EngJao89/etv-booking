import { useState } from 'react'
import { BooksPage } from '@/pages/books'
import { LoginPage } from '@/pages/login'

function App() {
  const [username, setUsername] = useState<string | null>(null)

  function handleLogout() {
    setUsername(null)
  }

  if (!username) {
    return <LoginPage onLogin={setUsername} />
  }

  return <BooksPage username={username} onLogout={handleLogout} />
}

export default App

import logo from '@/assets/logo.svg'
import padlock from '@/assets/padlock.png'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type LoginPageProps = {
  onLogin: (username: string) => void
}

export function LoginPage({ onLogin }: Readonly<LoginPageProps>) {
  function handleSubmit(event: { preventDefault(): void; currentTarget: HTMLFormElement }) {
    event.preventDefault()
    const usernameField = event.currentTarget.elements.namedItem('username')
    if (!(usernameField instanceof HTMLInputElement)) return

    const username = usernameField.value.trim()
    if (username) onLogin(username)
  }

  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto grid min-h-svh w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-88 flex-col gap-8"
          >
            <img src={logo} alt="ETV" className="size-14 rounded-md" />

            <div className="flex flex-col gap-5">
              <h1 className="text-left text-[1.75rem] leading-tight font-bold tracking-tight text-neutral-950">
                Access your Account
              </h1>

              <div className="flex flex-col gap-3">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  required
                  className="h-11 bg-white px-3"
                />

                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  className="h-11 bg-white px-3"
                />
              </div>

              <Button type="submit" size="lg" className="h-11 w-full text-base">
                Login
              </Button>
            </div>
          </form>
        </section>

        <section
          aria-hidden="true"
          className="hidden items-center justify-center p-10 lg:flex"
        >
          <div className="relative size-[min(22rem,70vw)] drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-[16%] rounded-full bg-white" />
            <img
              src={padlock}
              alt=""
              className="relative z-10 size-full object-contain"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

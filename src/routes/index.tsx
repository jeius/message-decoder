import { createFileRoute } from '@tanstack/react-router'
import { getSecretMessage } from '#/features/decoder/lib/helpers'
import { GOOGLE_DOC_URL } from '#/lib/constants'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  loader: async () => {
    if (!GOOGLE_DOC_URL) {
      throw new Error('GOOGLE_DOC_URL environment variable is not set.')
    }
    return getSecretMessage(GOOGLE_DOC_URL)
  },
  component: DecoderPage,
  pendingComponent: PendingView,
  errorComponent: ErrorView,
})

function DecoderPage() {
  const message = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 py-10 h-full">
      <Card className="island-shell rise-in rounded-2xl border-0 shadow-none">
        <CardHeader>
          <CardTitle className="display-title text-2xl font-bold text-(--sea-ink) sm:text-3xl">
            Secret Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message ? (
            <pre className="overflow-x-auto whitespace-pre font-mono text-sm leading-tight text-(--sea-ink)">
              {message}
            </pre>
          ) : (
            <p className="text-sm text-(--sea-ink-soft)">
              No message found.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

function PendingView() {
  return (
    <main className="page-wrap px-4 py-10 h-full">
      <Card className="island-shell rounded-2xl border-0 shadow-none">
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-(--sea-ink-soft)">
            Decoding message…
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="page-wrap px-4 py-10 h-full">
      <Card className="island-shell rounded-2xl border-0 shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-(--sea-ink-soft)">{error.message}</p>
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}


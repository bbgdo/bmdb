import VerifyEmailPage from "@/views/VerifyEmailPage"
import { verifyEmailToken } from "@/lib/server-api"

export const dynamic = "force-dynamic"

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value

export default async function Page({ searchParams }: Props) {
  const params = (await searchParams) ?? {}
  const token = firstValue(params.token)
  const success = token ? await verifyEmailToken(token) : false

  return <VerifyEmailPage status={success ? "success" : "error"} />
}

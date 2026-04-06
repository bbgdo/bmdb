import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmail } from "@/api/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Status = "loading" | "success" | "error"

// Module-level cache survives React StrictMode unmount/remount cycles,
// preventing the token from being consumed twice (second call would fail
// because the token is already nulled in the DB after the first call).
const tokenResultCache = new Map<string, "success" | "error">()

const VerifyEmailPage = () => {
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token")
	const [status, setStatus] = useState<Status>(() => {
		if (!token) return "error"
		return tokenResultCache.get(token) ?? "loading"
	})

	useEffect(() => {
		if (!token) {
			setStatus("error")
			return
		}
		const cached = tokenResultCache.get(token)
		if (cached) {
			setStatus(cached)
			return
		}

		void (async () => {
			try {
				await verifyEmail(token)
				tokenResultCache.set(token, "success")
				setStatus("success")
			} catch {
				tokenResultCache.set(token, "error")
				setStatus("error")
			}
		})()
	}, [token])

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Email Verification</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					{status === "loading" && <p>Verifying your email...</p>}
					{status === "success" && (
						<>
							<p className="text-green-600">
								Email verified! You can now log in.
							</p>
							<Link to="/login">
								<Button>Go to Login</Button>
							</Link>
						</>
					)}
					{status === "error" && (
						<>
							<p className="text-destructive">Invalid or expired token.</p>
							<Link to="/login">
								<Button variant="outline">Go to Login</Button>
							</Link>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default VerifyEmailPage

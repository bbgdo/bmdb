import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { verifyEmail } from "@/api/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Status = "loading" | "success" | "error"

const VerifyEmailPage = () => {
	const [searchParams] = useSearchParams()
	const [status, setStatus] = useState<Status>("loading")
	const token = searchParams.get("token")
	const calledRef = useRef(false)

	useEffect(() => {
		if (calledRef.current) return
		calledRef.current = true

		void (async () => {
			if (!token) {
				setStatus("error")
				return
			}
			try {
				await verifyEmail(token)
				setStatus("success")
			} catch {
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

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Status = "success" | "error"

type Props = {
	status: Status
}

const VerifyEmailPage = ({ status }: Props) => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Email Verification</CardTitle>
				</CardHeader>
				<CardContent className="text-center space-y-4">
					{status === "success" && (
						<>
							<p className="text-green-600">
								Email verified! You can now log in.
							</p>
							<Link href="/login">
								<Button>Go to Login</Button>
							</Link>
						</>
					)}
					{status === "error" && (
						<>
							<p className="text-destructive">Invalid or expired token.</p>
							<Link href="/login">
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

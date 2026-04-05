import { ExecutionContext, Injectable } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import { GqlExecutionContext } from "@nestjs/graphql"

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
	getRequestResponse(context: ExecutionContext) {
		const contextType = context.getType<"http" | "graphql">()
		if (contextType === "graphql") {
			const gqlCtx = GqlExecutionContext.create(context)
			const ctx = gqlCtx.getContext()
			return { req: ctx.req, res: ctx.res }
		}
		return super.getRequestResponse(context)
	}
}

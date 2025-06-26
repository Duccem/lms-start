import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { BetterSession, BetterUser, getSession } from "../auth/server";
import { DomainError } from "../ddd/core/domain-error";
import { HttpNextResponse } from "./http-next-response";

export const routeHandler = <T extends DomainError, P, Q>(
  options: {
    name: string;
    schema?: ZodSchema<P>;
    querySchema?: ZodSchema<Q>;
    authenticated?: boolean;
    permissions?: (user: BetterUser) => boolean;
  },
  handler: (params: {
    req: NextRequest;
    user: BetterUser;
    params: { [key: string]: any };
    searchParams: Q;
    body?: P;
  }) => Promise<NextResponse | void>,
  onError?: (error: T) => NextResponse,
) => {
  return async (req: NextRequest, { params }: { params: Promise<any> }) => {
    console.log(`Handling request for ${options.name} with method ${req.method}`);
    let session: BetterSession | null = null;
    if (options.authenticated) {
      session = await getSession();
      if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      if (options?.permissions && !options.permissions(session.user as BetterUser)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    const user = session?.user as BetterUser;
    const urlParams = await params;
    const searchParams = options.querySchema
      ? options.querySchema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()))
      : (Object.fromEntries(req.nextUrl.searchParams.entries()) as Q);
    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? options?.schema
          ? options?.schema?.parse(await req.json())
          : await req.json()
        : undefined;

    try {
      const response = await handler({
        req,
        user,
        params: urlParams,
        searchParams,
        body,
      });

      if (response instanceof NextResponse) {
        return response;
      } else if (response === undefined) {
        return HttpNextResponse.noResponse();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof DomainError) {
        const response = onError?.(error as T);
        if (response) {
          return response;
        }
      }
      return HttpNextResponse.internalServerError();
    }
  };
};

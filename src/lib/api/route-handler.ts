import { unstable_cache as cache, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { ZodError } from "zod/v4";
import { BetterSession, BetterUser, getSession } from "../auth/server";
import { DomainError } from "../ddd/core/domain-error";
import { Unauthenticated } from "../ddd/core/errors/unauthenticated";
import { Unauthorized } from "../ddd/core/errors/unauthorized";
import { HttpNextResponse } from "./http-next-response";

type RouteHandlerParams<Q, P> = {
  req: NextRequest;
  user: BetterUser;
  params: { [key: string]: any };
  searchParams: Q;
  body?: P;
};

type RouteHandler<Q, P, R> = (params: RouteHandlerParams<Q, P>) => Promise<R>;

type RouteHandlerOptions<Q, P, R> = {
  name: string;
  schema?: ZodSchema<P>;
  querySchema?: ZodSchema<Q>;
  authenticated?: boolean;
  permissions?: (user: BetterUser) => boolean;
  cache?: RouteHandlerCacheOptions<Q, P>;
};

type RouteHandlerCacheOptions<Q, P> = {
  tags: string[] | ((params: RouteHandlerParams<Q, P>) => string[]);
  ttl?: number;
  revalidate?: string[];
};

// The route handler function that processes the request, validates the user session, and handles caching.
export const routeHandler = <R, T extends DomainError, P, Q>(
  options: RouteHandlerOptions<Q, P, R>,
  handler: RouteHandler<Q, P, R>,
  onError?: (error: T) => NextResponse,
) => {
  return async (req: NextRequest, { params }: { params: Promise<any> }) => {
    // Validate session and permissions
    const session = await authentication(options.authenticated);
    authorization(session?.user, options.permissions);

    // Parse URL parameters, search parameters, and body
    const user = session?.user as BetterUser;
    const urlParams = await params;
    const searchParams = parseSeachParams<Q>(req, options.querySchema);
    const body = parseBody<P>(req, options.schema);

    try {
      // Execute the handler with the parsed parameters in cache if applicable
      const response = await handleCache<R, P, Q>(
        handler,
        {
          req,
          user,
          params: urlParams,
          searchParams,
          body,
        },
        options.cache,
      );

      // If the response is a NextResponse, return it directly
      // If the response is undefined, return a no response
      if (response instanceof NextResponse) {
        return response;
      } else if (response === undefined) {
        return HttpNextResponse.noResponse();
      }
    } catch (error) {
      // Handle errors based on their type
      console.error(error);
      switch (true) {
        // Check if the error is an instance of a specific error class
        case error instanceof Unauthenticated: // Handle unauthenticated errors
          return HttpNextResponse.domainError(error, 401);
        case error instanceof Unauthorized: // Handle unauthorized errors
          return HttpNextResponse.domainError(error, 403);
        case error instanceof DomainError: // Handle other domain errors
          const response = onError?.(error as T);
          if (response) {
            return response;
          }
          return HttpNextResponse.internalServerError();
        case error instanceof ZodError: // Handle Zod validation errors
          return HttpNextResponse.error(error.message);
        default: // Handle any other unexpected errors
          return HttpNextResponse.internalServerError();
      }
    }
  };
};

/**
 * Function to authenticate the user based on the session.
 * @param  authenticated  Indicates if authentication is required.
 * @throws Unauthenticated error if the user is not authenticated.
 */
async function authentication(authenticated?: boolean): Promise<BetterSession | null> {
  if (!authenticated) {
    return null;
  }
  const session = await getSession();
  if (!session || !session.user) {
    throw new Unauthenticated("User is not authenticated");
  }
  return session;
}

/**
 * Function to authorize the user based on a callback function.
 * If the user does not have the required permissions, an Unauthorized error is thrown.
 * @param user The user to authorize.
 * @param  permissions The callback function that checks if the user has the required permissions.
 * @throws Unauthorized error if the user does not have the required permissions.
 */
function authorization(
  user: BetterUser | undefined,
  permissions?: (user: BetterUser) => boolean,
): void {
  if (!user) {
    return;
  }
  if (permissions && !permissions(user)) {
    throw new Unauthorized("User does not have the required permissions");
  }
}

/**
 * Parses the search parameters from the request object and validates them against a Zod schema if provided.
 * @param req Request object from Next.js
 * @param schema Zod schema to validate the search parameters
 */
function parseSeachParams<Q>(req: NextRequest, schema?: ZodSchema<Q>): Q {
  if (!schema) {
    return Object.fromEntries(req.nextUrl.searchParams.entries()) as Q;
  }
  return schema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));
}

/**
 * Parses the body of the request and validates it against a Zod schema if provided.
 * @param req Request object from Next.js
 * @param schema Zod schema to validate the request body
 */
function parseBody<P>(req: NextRequest, schema?: ZodSchema<P>): P | undefined {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }
  if (!schema) {
    return req.json() as P;
  }
  return schema.parse(req.json());
}

/**
 * Handles caching of the route handler response.
 * If cache options are provided, it uses Next.js unstable_cache to cache the response.
 * If the response is undefined and revalidation tags are provided, it revalidates those tags.
 * If no cache options are provided, it simply executes the handler.
 * @param handler The route handler function to execute.
 * @param params The parameters for the route handler.
 * @param cacheOptions Optional cache options for caching the response.
 */
async function handleCache<R, P, Q>(
  handler: RouteHandler<Q, P, R>,
  params: RouteHandlerParams<Q, P>,
  cacheOptions?: RouteHandlerCacheOptions<Q, P>,
): Promise<R> {
  let response: R;
  if (cacheOptions?.tags && cacheOptions.ttl) {
    const tags =
      typeof cacheOptions.tags === "function" ? cacheOptions.tags(params) : cacheOptions.tags;
    response = await cache(() => handler(params), tags, {
      revalidate: cacheOptions.ttl,
      tags: [tags.join("-")],
    })();
  } else {
    response = await handler(params);
  }

  if (cacheOptions?.revalidate && response === undefined) {
    const tag = cacheOptions.revalidate.join("-");
    revalidateTag(tag);
  }

  return response;
}

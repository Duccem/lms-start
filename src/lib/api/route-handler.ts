import { NextRequest, NextResponse } from "next/server";
import { BetterUser, getSession } from "../auth/server";
import { DomainError } from "../ddd/core/domain-error";

export const routeHandler = <T extends DomainError, P = unknown>(
  handler: (params: {
    req: NextRequest;
    user: BetterUser;
    params: { [key: string]: any };
    searchParams: { [key: string]: any };
  }) => Promise<NextResponse>,
  onError: (error: T) => NextResponse | void = () => undefined
) => {
  return async (req: NextRequest, { params }: { params: Promise<any> }) => {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = session.user as BetterUser;
    const urlParams = await params;
    const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

    try {
      return await handler({ req, user, params: urlParams, searchParams });
    } catch (error) {
      console.log(error);
      if (error instanceof DomainError) {
        const response = onError(error as T);
        if (response) {
          return response;
        }
      }
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
};


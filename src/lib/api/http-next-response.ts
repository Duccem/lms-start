import { NextResponse } from "next/server";
import { DomainError } from "../ddd/core/domain-error";

export class HttpNextResponse {
  static domainError(error: DomainError, statusCode: number): NextResponse {
    return NextResponse.json(
      {
        message: error.getMessage(),
      },
      { status: statusCode },
    );
  }

  static internalServerError(): NextResponse {
    return NextResponse.json(
      {
        code: "InternalServerError",
        message: "Internal server error",
        data: {},
      },
      { status: 500 },
    );
  }

  static noResponse(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  static error(message: string): NextResponse {
    return new NextResponse(null, { status: 400 });
  }

  static created(): NextResponse {
    return new NextResponse(null, { status: 201 });
  }

  static json<JsonBody>(data: JsonBody): NextResponse {
    return NextResponse.json(data, { status: 200 });
  }
}

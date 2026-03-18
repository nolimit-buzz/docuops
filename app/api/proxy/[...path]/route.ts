import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "transfer-encoding",
]);

function buildUpstreamUrl(request: NextRequest, path: string[]) {
  const upstream = new URL(path.join("/"), `${UPSTREAM_BASE_URL.replace(/\/+$/, "")}/`);
  upstream.search = request.nextUrl.search;
  return upstream;
}

function getForwardHeaders(request: NextRequest) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!UPSTREAM_BASE_URL) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_URL is not configured." },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const upstreamUrl = buildUpstreamUrl(request, path);
  const method = request.method.toUpperCase();

  const response = await fetch(upstreamUrl, {
    method,
    headers: getForwardHeaders(request),
    body: method === "GET" || method === "HEAD" ? undefined : await request.text(),
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers(response.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

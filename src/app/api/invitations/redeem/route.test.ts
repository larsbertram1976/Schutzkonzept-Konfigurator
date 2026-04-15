import { describe, it, expect, vi, beforeEach } from "vitest";

const getUserMock = vi.fn();
const rpcMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
    rpc: rpcMock,
  })),
}));

import { POST } from "./route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/invitations/redeem", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/invitations/redeem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });
    const res = await POST(makeRequest({ token: "a".repeat(32) }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing token", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 when invitation is expired", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    rpcMock.mockResolvedValueOnce({
      data: null,
      error: { message: "Einladung abgelaufen" },
    });
    const res = await POST(makeRequest({ token: "a".repeat(32) }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("abgelaufen");
  });

  it("returns clubId on success", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    rpcMock.mockResolvedValueOnce({ data: "club-9", error: null });
    const res = await POST(makeRequest({ token: "a".repeat(32) }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.clubId).toBe("club-9");
  });
});

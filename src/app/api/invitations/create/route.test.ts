import { describe, it, expect, vi, beforeEach } from "vitest";

const getUserMock = vi.fn();
const fromMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
    from: fromMock,
  })),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentClubId: vi.fn(async () => "club-1"),
}));

import { POST } from "./route";

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/invitations/create", {
    method: "POST",
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/invitations/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });
    const res = await POST(makeRequest({ role: "member" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid body", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    const res = await POST(makeRequest("not-json"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid role", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    const res = await POST(makeRequest({ role: "owner" }));
    expect(res.status).toBe(400);
  });

  it("returns 403 when user is not admin of the club", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { role: "member" } }),
          }),
        }),
      }),
    });
    const res = await POST(makeRequest({ role: "member" }));
    expect(res.status).toBe(403);
  });

  it("returns token and expiresAt on success", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    // membership check
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: { role: "admin" } }),
          }),
        }),
      }),
    });
    // insert
    fromMock.mockReturnValueOnce({
      insert: () => ({
        select: () => ({
          single: async () => ({
            data: {
              id: "inv-1",
              token: "tok",
              expires_at: "2099-01-01T00:00:00Z",
            },
            error: null,
          }),
        }),
      }),
    });

    const res = await POST(makeRequest({ role: "member" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ id: "inv-1", token: "tok" });
  });
});

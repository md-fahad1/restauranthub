/**
 * What we encode inside the ACCESS token.
 * Kept intentionally small — this gets decoded on every single request.
 *
 * NOTE: because roles/restaurantId are baked into the token, a permission
 * change won't take effect until the user's next login or token refresh.
 * That's an acceptable tradeoff for now (access tokens are short-lived,
 * ~15 min) but is worth remembering if you ever build a "revoke access
 * immediately" admin feature — you'd need a token-blocklist for that.
 */
export interface JwtPayload {
  sub: string; // userId
  email: string;
  roles: string[]; // role slugs, e.g. ['OWNER'], ['MANAGER'], ['SUPER_ADMIN']
  restaurantId?: string; // present if user is an Employee somewhere
  branchId?: string; // present if user is an Employee somewhere
}

export interface JwtRefreshPayload {
  sub: string; // userId
  tokenId: string; // id of the RefreshToken row, so we can revoke individual sessions
}

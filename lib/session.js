/** @type {import('iron-session').SessionOptions} */
export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'snap_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

/**
 * Shape of the data stored in the session cookie.
 * @typedef {Object} SessionData
 * @property {string} [accessToken]
 * @property {string} [refreshToken]
 * @property {string} [userId]
 * @property {string} [userEmail]
 * @property {boolean} [isAdmin]
 */

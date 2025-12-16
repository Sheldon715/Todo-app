// ====================== Imports ======================
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import pool from "../db.js";

// ====================== Config ======================
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET } = process.env;

const serverOrigin =
  process.env.SERVER_ORIGIN ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4000");

const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || `${serverOrigin}/api/auth/google/callback`;


// ====================== Strategy ======================
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false);
        }

        const existingUser = await pool.query(
          "SELECT id, email FROM users WHERE email = $1",
          [email]
        );

        let user;

        if (existingUser.rows.length > 0) {
          user = existingUser.rows[0];
        } else {
          const newUser = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
            [email, "google-oauth"]
          );
          user = newUser.rows[0];
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return done(null, { token, user });
      } catch (error) {
        console.error("Google auth error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;

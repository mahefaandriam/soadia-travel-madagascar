import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Initialize the SQL client with the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Simplify the executeQuery function since we're using tagged template literals directly

// Helper function to execute raw SQL queries with tagged template literals
export async function executeQuery<T = any>(query: TemplateStringsArray, ...params: any[]): Promise<T> {
  try {
    const result = await sql(query, ...params)
    return result as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// User-related queries
export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT u.*, us.email_notifications, us.sms_notifications, us.dark_mode, us.two_factor_enabled, us.language
    FROM users u
    LEFT JOIN user_settings us ON u.id = us.user_id
    WHERE u.email = ${email}
  `
  return result.length > 0 ? result[0] : null
}

export async function createUser(name: string, email: string, passwordHash: string, imageUrl?: string) {
  const result = await sql`
    INSERT INTO users (name, email, password_hash, image_url)
    VALUES (${name}, ${email}, ${passwordHash}, ${imageUrl})
    RETURNING id
  `

  if (result.length > 0) {
    // Create default user settings
    await sql`
      INSERT INTO user_settings (user_id, email_notifications, sms_notifications, dark_mode)
      VALUES (${result[0].id}, TRUE, FALSE, FALSE)
    `

    return getUserById(result[0].id)
  }

  return null
}

export async function getUserById(id: number) {
  const result = await sql`
    SELECT u.*, us.email_notifications, us.sms_notifications, us.dark_mode, us.two_factor_enabled, us.language
    FROM users u
    LEFT JOIN user_settings us ON u.id = us.user_id
    WHERE u.id = ${id}
  `
  return result.length > 0 ? result[0] : null
}

export async function updateUser(id: number, data: any) {
  const { name, email, phone, bio, image_url } = data

  const result = await sql`
    UPDATE users
    SET name = ${name}, email = ${email}, phone = ${phone}, bio = ${bio}, image_url = ${image_url}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `
  return result.length > 0 ? result[0] : null
}

export async function updateUserSettings(userId: number, settings: any) {
  const { email_notifications, sms_notifications, dark_mode, two_factor_enabled, language } = settings

  const result = await sql`
    UPDATE user_settings
    SET email_notifications = ${email_notifications}, sms_notifications = ${sms_notifications}, dark_mode = ${dark_mode}, 
        two_factor_enabled = ${two_factor_enabled}, language = ${language}, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
    RETURNING *
  `

  return result.length > 0 ? result[0] : null
}

// Plan-related queries
export async function getAllPlans() {
  return sql`
    SELECT p.*, 
           (SELECT json_agg(pf.*) FROM plan_features pf WHERE pf.plan_id = p.id) AS features
    FROM plans p
    ORDER BY p.price ASC
  `
}

export async function getPlanById(id: number) {
  const result = await sql`
    SELECT p.*, 
           (SELECT json_agg(pf.*) FROM plan_features pf WHERE pf.plan_id = p.id) AS features
    FROM plans p
    WHERE p.id = ${id}
  `
  return result.length > 0 ? result[0] : null
}

// Vehicle-related queries
export async function getAllVehicles() {
  return sql`
    SELECT v.*, 
           (SELECT json_agg(s.*) FROM seats s WHERE s.vehicle_id = v.id) AS seats
    FROM vehicles v
  `
}

export async function getVehicleById(id: number) {
  const result = await sql`
    SELECT v.*, 
           (SELECT json_agg(s.*) FROM seats s WHERE s.vehicle_id = v.id) AS seats
    FROM vehicles v
    WHERE v.id = ${id}
  `
  return result.length > 0 ? result[0] : null
}

// Country and city queries
export async function getAllCountries() {
  return sql`SELECT * FROM countries ORDER BY name`
}

export async function getCitiesByCountryId(countryId: number) {
  return sql`SELECT * FROM cities WHERE country_id = ${countryId} ORDER BY name`
}

// Reservation-related queries
export async function createReservation(data: any) {
  const {
    user_id,
    plan_id,
    vehicle_id,
    reservation_date,
    reservation_time,
    country_id,
    city_id,
    payment_method,
    total_price,
    status = "upcoming",
    selected_seats,
  } = data

  try {
    // Start a transaction
    await sql`BEGIN`

    // Create the reservation
    const reservationResult = await sql`
      INSERT INTO reservations (
        user_id, plan_id, vehicle_id, reservation_date, reservation_time,
        country_id, city_id, payment_method, total_price, status
      )
      VALUES (${user_id}, ${plan_id}, ${vehicle_id}, ${reservation_date}, ${reservation_time}, 
              ${country_id}, ${city_id}, ${payment_method}, ${total_price}, ${status})
      RETURNING id
    `

    const reservationId = reservationResult[0].id

    // Add the selected seats
    if (selected_seats && selected_seats.length > 0) {
      for (const seatId of selected_seats) {
        await sql`
          INSERT INTO reservation_seats (reservation_id, seat_id)
          VALUES (${reservationId}, ${seatId})
        `
      }
    }

    // Commit the transaction
    await sql`COMMIT`

    return getReservationById(reservationId)
  } catch (error) {
    // Rollback the transaction in case of error
    await sql`ROLLBACK`
    throw error
  }
}

export async function getReservationById(id: number) {
  const result = await sql`
    SELECT r.*,
           p.name AS plan_name, p.price AS plan_price, p.period AS plan_period,
           v.name AS vehicle_name,
           c1.name AS country_name,
           c2.name AS city_name,
           (SELECT json_agg(s.*) FROM seats s 
            JOIN reservation_seats rs ON s.id = rs.seat_id 
            WHERE rs.reservation_id = r.id) AS seats
    FROM reservations r
    LEFT JOIN plans p ON r.plan_id = p.id
    LEFT JOIN vehicles v ON r.vehicle_id = v.id
    LEFT JOIN countries c1 ON r.country_id = c1.id
    LEFT JOIN cities c2 ON r.city_id = c2.id
    WHERE r.id = ${id}
  `

  return result.length > 0 ? result[0] : null
}

export async function getReservationsByUserId(userId: number) {
  return sql`
    SELECT r.*,
           p.name AS plan_name, p.price AS plan_price, p.period AS plan_period,
           v.name AS vehicle_name,
           c1.name AS country_name,
           c2.name AS city_name,
           (SELECT json_agg(s.*) FROM seats s 
            JOIN reservation_seats rs ON s.id = rs.seat_id 
            WHERE rs.reservation_id = r.id) AS seats
    FROM reservations r
    LEFT JOIN plans p ON r.plan_id = p.id
    LEFT JOIN vehicles v ON r.vehicle_id = v.id
    LEFT JOIN countries c1 ON r.country_id = c1.id
    LEFT JOIN cities c2 ON r.city_id = c2.id
    WHERE r.user_id = ${userId}
    ORDER BY r.reservation_date DESC, r.reservation_time DESC
  `
}

export async function updateReservationStatus(id: number, status: string) {
  const result = await sql`
    UPDATE reservations
    SET status = ${status}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `

  return result.length > 0 ? result[0] : null
}

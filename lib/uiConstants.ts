/**
 * ค่าคงที่ฝั่ง UI (จำนวนแถวต่อหน้า · จำนวนการ์ด · จังหวะอัปเดต) — ย้ายมาจาก app/data/*MockData.ts
 * เมื่อ backend ทำ pagination ฝั่ง server ให้ส่งค่าเหล่านี้เป็น pageSize ใน query
 */

/** ประวัติเดิมพันในหน้าธุรกรรม */
export const TRANSACTION_BET_PAGE_SIZE = 10;

/** แนะนำเพื่อน — รายชื่อเพื่อน / ประวัติรายได้ */
export const REFERRAL_USERS_PAGE_SIZE = 10;
export const REFERRAL_EARNING_PAGE_SIZE = 10;

/** ประวัติคืนยอดเสีย */
export const LOSS_REBATE_HISTORY_PAGE_SIZE = 5;

/** ประวัติวงล้อ */
export const LUCKY_WHEEL_HISTORY_PAGE_SIZE = 5;

/** Hall of Fame — จำนวนแถวที่แสดง และรอบอัปเดต (ms) */
export const HALL_OF_FAME_ROW_LIMIT = 8;
export const HALL_OF_FAME_TICK_MS = 2000;

/** หน้าแรก — จำนวนการ์ดสูงสุดต่อ carousel เกม / carousel ทั่วไป */
export const HOME_LOBBY_GAME_CAROUSEL_MAX = 8;
export const HOME_LOBBY_CAROUSEL_MAX = 15;

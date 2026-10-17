# Design Specification & UI Breakdown: SuperLotto (Dashboard)

เอกสารนี้ถอดสไตล์และ component จากภาพ UI "SUPERLOTTO" (dark neon dashboard, desktop) เพื่อใช้เป็นแนวทางขึ้นงาน — ค่าสีเป็นค่าประมาณจากภาพ ไม่ใช่ค่าจริงจาก source

---

## 1. Design Tokens

### 1.1 Color Palette

| Token | ค่าโดยประมาณ | การใช้งาน |
| :--- | :--- | :--- |
| **bg-app** | `#0a0d1f` ~ `#0c1024` | พื้นแผงหลัก (navy เกือบดำ) |
| **bg-card** | `#12162e` ~ `#161a36` | การ์ดทั่วไป, แถว Live Feed, ช่อง leaderboard |
| **bg-card-raised** | `#1a1f40` | การ์ดที่ยกขึ้น, ปุ่ม icon rail |
| **border-subtle** | `rgba(255,255,255,.06)` | ขอบการ์ด/เส้นแบ่ง |
| **text-primary** | `#ffffff` | หัวข้อ, ชื่อผู้เล่น, ตัวเลข |
| **text-muted** | `#7b83a6` | คำอธิบาย, label คอลัมน์, เวลา |
| **accent-blue** | `#3d7bff` ~ `#2f6bff` | ปุ่มหลัก/ส่งข้อความ, ขอบ focus ช่องพิมพ์, เหรียญ $ |
| **accent-orange** | `#ff5a36` ~ `#ff7a3c` | ไอคอน active ใน rail, อันดับ 1, badge ตั๋ว |
| **accent-green** | `#22d36b` | ลิงก์/ลูกศร "Match 6 numbers", อันดับ 3, สถานะออนไลน์, ปุ่มเติมเงิน (+) |
| **accent-gold** | `#ffb82e` | เหรียญดาว "Results for today", เน้นรางวัล |
| **accent-purple/pink** | `#9b5cff` ~ `#ff4fd8` | การ์ดถ้วยรางวัล (Top winners) |

อันดับใน Top Leaders: 1 = ส้มแดง · 2 = น้ำเงิน · 3 = เขียว · 4–5 = เทาเข้ม

### 1.2 Typography
* ฟอนต์ geometric sans (คล้าย Montserrat/Exo) — โลโก้ใช้ตัวหนาอักษรผสม "SUPER" ขาว + "LOTTO" จาง
* Hero card title: ตัวใหญ่ หนา **UPPERCASE** แตกหลายบรรทัด (~22–26px, weight 800)
* Section title: UPPERCASE, หนา, letter-spacing กว้างเล็กน้อย (~16px) มีไอคอนนำหน้า + เส้นตั้งคั่นก่อนคำอธิบาย
* Caption / label: 10–12px, สี text-muted; label คอลัมน์ตาราง UPPERCASE 10px
* ตัวเลขเงิน/อันดับ: ตัวหนา ขาว; "Last win / Winnings" เป็น caption ใต้ตัวเลข

### 1.3 Shape, Border, Elevation
* Radius: การ์ดใหญ่ 16–20px · การ์ดเล็ก/แถว 10–12px · ปุ่ม pill (See more, ภาษา) เต็มวงรี · icon button 12px
* ขอบ 1px โปร่งแสง + inner highlight บางที่ขอบบน ให้ความรู้สึกกระจก
* Glow: องค์ประกอบ active/focus มีเส้นขอบสีนีออน + `box-shadow` เรืองรอบ (น้ำเงินที่ช่องแชท, ส้มที่ปุ่ม rail ที่เลือก, เขียวที่แถบ Results)
* พื้นหลังการ์ดมี gradient เฉียงอ่อน + แสงเรืองด้านหลังภาพประกอบ

---

## 2. Components

### 2.1 Top Bar
* ซ้าย: โลโก้ (ไอคอนตั๋วเอียง + wordmark)
* ถัดมา: **Language pill** — ธง + "ENG" + ลูกศรลง, ขอบน้ำเงินเรือง
* เมนูข้อความ: Provably Fair · FAQ · Terms of Services — ไอคอนเล็ก + ตัวหนังสือ 11px สี muted
* ขวา: ชื่อผู้ใช้ + **Balance chip** (ปุ่มเขียวกลม "+" + ยอด `$ 1.740` ในแคปซูลมืด) + avatar กรอบเหลี่ยมมน + ปุ่มตั้งค่า

### 2.2 Hero Feature Card (3 ใบเรียงแถว)
* สัดส่วนกว้าง ~ 2:1, radius ~18px, ขอบสีตามธีมการ์ด (น้ำเงิน / ม่วง / ชมพู-ส้ม)
* ซ้ายล่าง: หัวข้อ UPPERCASE หนา (DAILY NUMBER DRAWING / TOP WINNERS FOR THE WEEK / HOW DOES THE LOTTERY WORK?)
* บนซ้าย: **link row** — ปุ่มลูกศรเขียวกลมเล็ก + คำอธิบาย 2 บรรทัด (เช่น "Match 6 numbers and win!")
* ขวา: ภาพ 3D ใหญ่ (ลูกบอลในโหล, ถ้วยรางวัลม่วงเรือง, เฟืองส้มชมพู) ล้นกรอบเล็กน้อย มี confetti กระจาย
* พื้นหลัง: gradient เข้ม + glow สีเดียวกับภาพ

### 2.3 Action Strip (2 ใบ)
* **Help card**: ไอคอนซ้าย + ชื่อ UPPERCASE + คำอธิบาย + ปุ่มไอคอนหกเหลี่ยมน้ำเงินเรืองด้านขวา
* **Results card**: พื้นเขียวเข้มไล่เฉด, ขอบเขียวเรือง, เหรียญดาวทองหกเหลี่ยมตรงกลาง, ตามด้วยลูกเลข 6 ช่อง (ช่องสี่เหลี่ยมมนสีเทาเข้ม ตัวเลขขาว)

### 2.4 Section Header
ไอคอนในวงมืด + ชื่อ UPPERCASE + เส้นตั้งบาง + คำอธิบาย muted (2 บรรทัด) · ปุ่ม **See more** แบบ pill ขอบบางชิดขวา

### 2.5 Leader Card (Top Leaders — 5 ใบเท่ากัน)
* การ์ดแนวตั้ง radius ~14px, พื้นมืด + แสงรัศมีวงกลมด้านหลัง avatar
* บน: avatar ในกรอบหกเหลี่ยมมีช่อลอเรล/ปีกประดับ สีตามอันดับ
* ล่าง: ธงรางวัล (ribbon banner) ตัวเลขอันดับใหญ่ตรงกลาง · ซ้าย `$ Last win`, ขวา `$ Winnings` (ตัวเลขหนา + caption)

### 2.6 Live Feed Table
* หัวคอลัมน์ UPPERCASE 10px muted: AVATAR · NICKNAME · TICKETS · TIME · SELECTED NUMBERS
* แถวสูง ~34px พื้น card-raised, radius 8–10px, เว้นแถวละ ~6px
* Avatar สี่เหลี่ยมมนเล็ก · Tickets = ไอคอนตั๋ว + "Tickets purchased: **x4**" · Time = ไอคอนนาฬิกา + วันที่
* **Number chip**: สี่เหลี่ยมมน ~28px พื้นเทาเข้ม ตัวเลขขาว เรียงชิดขวา 6 ช่อง

### 2.7 Right Sidebar
* **Ticket header**: ไอคอนเหรียญ `$2` น้ำเงินพร้อมปุ่ม "+" เขียว, ชื่อ "LOTTERY TICKET [x1]" (x1 สีแดง), "Dividends: 5%" (5% เขียว)
* **Online chat card**: ไอคอน + "ONLINE CHAT / Online: 74" (ตัวเลขสีส้ม) + avatar ซ้อน 3 วง + ปุ่มลูกศรเขียว
* **Chat bubble**: การ์ด radius ~10px พื้น card, avatar เหลี่ยมมนซ้าย, ชื่อ (muted) + เวลา "xx sec ago" ชิดขวา, ข้อความขาว 12px; ข้อความ Admin มี badge ส้มขอบบางข้างชื่อ
* รายการเลื่อนได้ ขอบบนเฟดหาย (mask gradient)
* **Message input**: ช่องสูง ~40px ขอบน้ำเงินเรืองชัด, placeholder muted, ปุ่มส่งหกเหลี่ยม/ทรงมนสีน้ำเงินมีไอคอนเครื่องบินกระดาษ

### 2.8 Icon Rail Button
สี่เหลี่ยมมน ~44px พื้น card-raised · ปกติไอคอนเทาม่วง · **active** = ขอบ + ไอคอนสีส้มแดงเรือง

---

## 3. Interaction Notes (ตีความจากภาพ)
* Hover การ์ด: ยกขึ้นเล็กน้อย + เพิ่ม glow ของสีธีมการ์ด
* Focus ช่องแชท: ขอบน้ำเงินเรือง (มีอยู่แล้วในภาพ)
* ปุ่ม/ลิงก์ลูกศรเขียว = จุดกดหลักของ hero card
* Chat/Live feed เป็นข้อมูล real-time — แถวใหม่เข้าด้านบน, เวลาเป็น relative

---

## 4. สรุปสไตล์เพื่อนำไปใช้กับ CM Lotto

| หัวข้อ | แนวทาง |
| :--- | :--- |
| พื้น | navy เกือบดำ + การ์ดโทน navy ไล่เฉดเบา ๆ (ไม่ใช่ดำล้วน) |
| สีเน้น | แยกบทบาทชัด: น้ำเงิน = primary/focus, เขียว = สำเร็จ/ลิงก์, ส้ม = active/อันดับ, ทอง = รางวัล |
| รูปทรง | มุมโค้ง 12–20px, pill สำหรับ chip/ปุ่มรอง, หกเหลี่ยมสำหรับ icon badge |
| ความลึก | ขอบโปร่งแสง + glow สีเดียวกับธีมการ์ด แทนเงาดำล้วน |
| ภาพประกอบ | 3D ล้นกรอบการ์ดด้านขวา, ข้อความ UPPERCASE หนาทางซ้าย |
| ตัวอักษร | หัวข้อ UPPERCASE หนา, caption เล็กสี muted |

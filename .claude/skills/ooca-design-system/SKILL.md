---
name: ooca-design-system
description: Design system ของโปรเจกต์ OOCA V.2 (เว็บระบายความในใจผ่านจดหมาย) ดึงมาจากหน้า CI ใน Figma ครอบคลุม Color, Logo, Shapes, Typography EN (Gotham Rounded), Typography TH (Prompt), Icon, Background, Button, Elevation ใช้ทุกครั้งที่ออกแบบหน้าจอ เขียนโค้ด UI ทำ mockup หรือตรวจงานดีไซน์ของโปรเจกต์นี้ เพื่อให้ใช้สี ฟอนต์ ปุ่ม เงา และไอคอนตรงตามระบบ
---

# OOCA V.2 Design System

ที่มา: Figma ไฟล์ `OOCA-V.2` (fileKey `jctrN3IDLbVHznhZz90CpC`) หน้า **CI** (node `0:1`)
https://www.figma.com/design/jctrN3IDLbVHznhZz90CpC/OOCA-V.2?node-id=0-1

> ข้อความกำกับในไฟล์: "The following information is permitted to be used solely for assignments from ooca"

## กฎการใช้

- ใช้เฉพาะค่าที่อยู่ในไฟล์นี้ ห้ามคิดสี ฟอนต์ ขนาด หรือเงาขึ้นมาเอง
- ถ้าต้องการค่าที่ไม่มีในนี้ ให้ถามผู้ใช้ก่อน
- ชื่อ token ใช้ตามชื่อ style/variable ใน Figma (เช่น `Main Colors/OOCA Blue/Blue 1`)
- จุดที่ไฟล์ Figma ขัดกันเอง หรือยังไม่ระบุ ดูในหัวข้อ "จุดที่ต้องระวัง" ท้ายไฟล์

| หัวข้อ | Figma node |
|---|---|
| Color | `1:1809` |
| Logo | `1:2185` (ชื่อเฟรมใน Figma คือ "Shapes" แต่เนื้อหาเป็น Logo) |
| Shapes | `1:2165` |
| Typography / EN | `1:1678` |
| Typography / TH | `1:1744` |
| Icon | `1:2309` |
| Background | `1:2156` |
| Button | `1:3033` (component set `Button/In card only` = `1:3034`) |
| Elevation | `1:2282` |

---

## 1. Color

### OOCA Turquoise (สีแบรนด์)
"Brand color, essential set (primary color, 30% is sub-primary and 10% is accent color.)"

| ชื่อ | HEX |
|---|---|
| Turquoise 1 (main) | `#00C4B3` |
| Turquoise 2 | `#B3EDE8` |
| Turquoise 3 | `#DBF0EE` |
| Turquoise text | `#009688` |

### Accent blue
"Use to emphasize actions and highlighted information"

| ชื่อ | HEX |
|---|---|
| Blue 1 (500) | `#1F77DF` |
| Blue 2 (300) | `#62A0E9` |
| Blue 3 (200) | `#8FBBEF` |
| Blue 4 (100) | `#C7DDF7` |
| Blue 5 (50) | `#E4EFFB` |

### Accent orange
"Use to emphasize actions and highlighted information"

| ชื่อ | HEX |
|---|---|
| Marigo 1 (500) | `#F9A000` |
| Marigo 2 (100) | `#F8E4B3` |

### System

| สถานะ | สีหลัก (500) | สีอ่อน (100) |
|---|---|---|
| Error | Flamingo 1 `#EF7773` | Flamingo 2 `#FAD6D5` |
| Warning | Sunshade 1 `#FF8F4B` | Sunshade 2 `#FFDDC9` |
| Success | Guava 1 `#8AD866` | Guava 2 `#DCF3D1` |

### Gray
"Text, container border, system icon"

| ชื่อ | HEX |
|---|---|
| Black | `#000000` |
| Black Gray 1 (400) | `#C4C4C4` |
| Black Gray 2 (200) | `#F1F1F1` |
| Black Gray 3 (100) | `#F6F6F6` |
| White | `#FFFFFF` |
| Turquoise Gray 1 | `#355956` |
| Turquoise Gray 2 | `#3F6866` |
| Turquoise Gray 3 | `#528984` |
| Turquoise Gray 4 | `#79ADA9` |

Variable อื่นที่ใช้ในไฟล์: `Main Colors/Blue Grays/Blue Gray 1` = `#465969`, `Main Colors/Blue Grays/Blue Gray 3` = `#CDD8E1`

### Gradient (ใช้กับ Background)

| ชื่อ | ค่า |
|---|---|
| Black Gradient | `#000000` 90% |
| Turquoise Gradient 01 | `#DBF0EE` |
| Turquoise Gradient 02 | `#D7FFFC` → `#E0FEFB` |

### Color palettes (OOCA All Shades and Hues)
ชื่อ variable: `OOCA All Shades and Hues/<กลุ่ม>/<ระดับ>` · ระดับ 500 คือ Base

| ระดับ | OOCA Turquoise | OOCA Blue | OOCA Marigo | Blue Grays | Black Grays | OOCA Flamingo | OOCA Sunshade | OOCA Guava |
|---|---|---|---|---|---|---|---|---|
| 50 | `#E0F8F6` | `#E4EFFB` | `#FCF4E0` | `#EAEFF5` | `#FBFBFB` | `#FDEFEE` | `#FFF2E9` | `#F1FAED` |
| 100 | `#B3EDE8` | `#C7DDF7` | `#F8E4B3` | `#CDD8E1` | `#F6F6F6` | `#FAD6D5` | `#FFDDC9` | `#DCF3D1` |
| 200 | `#80E2D9` | `#8FBBEF` | `#F4D280` | `#B0BDCA` | `#F1F1F1` | `#F7BBB9` | `#FFC7A5` | `#C5ECB3` |
| 300 | `#4DD6CA` | `#62A0E9` | `#F0BF4D` | `#91A3B4` | `#E6E6E6` | `#F4A09D` | `#FFB181` | `#ADE494` |
| 400 | `#26CDBE` | `#418BE4` | `#ECB226` | `#7A8FA2` | `#C4C4C4` | `#F18B88` | `#FFA066` | `#9CDE7D` |
| 500 | `#00C4B3` | `#1F77DF` | `#E9A400` | `#637B91` | `#A6A6A6` | `#EF7773` | `#FF8F4B` | `#8AD866` |
| 600 | `#00BEAC` | `#1B6FDB` | `#E69C00` | `#566D80` | `#7C7C7C` | `#ED6F6B` | `#FF8744` | `#82D45E` |
| 700 | `#00B6A3` | `#1764D7` | `#E39200` | `#465969` | `#686868` | `#EB6460` | `#FF7C3B` | `#77CE53` |
| 800 | `#00AF9A` | `#125AD2` | `#DF8900` | `#374654` | `#484848` | `#E85A56` | `#FF7233` | `#6DC849` |
| 900 | `#00A28B` | `#0A47CA` | `#D97800` | `#26313C` | `#272727` | `#E44743` | `#FF6023` | `#5ABF38` |

---

## 2. Logo

- **Logotype:** คำว่า **"mindfull"** ตัวอักษรสี Turquoise `#00C4B3` จุดบนตัว i เป็นรูปหัวใจ และตัว u เป็นหน้ายิ้ม (สองจุด + เส้นโค้ง) สี Blue `#1F77DF`
- **พื้นหลังที่ใช้ได้ (สี):**
  - พื้นขาว: ตัวอักษร Turquoise + หัวใจ/หน้ายิ้มสีน้ำเงิน
  - พื้น Turquoise 3 (`#DBF0EE`): ตัวอักษร Turquoise + หัวใจ/หน้ายิ้มสีน้ำเงิน
  - พื้นดำ: logotype สีขาวทั้งหมด
  - พื้น Turquoise (`#00C4B3`): logotype สีขาวทั้งหมด
- **Black & White Logotype:** "Use black & white logotype in B&W documents or overlay the bright or dark color to optimize readability"
  - พื้นดำ → logotype ขาว · พื้นขาว → logotype ดำ
- ใช้ไฟล์โลโก้จาก Figma (node `1:2185`) เท่านั้น ห้ามวาดหรือพิมพ์ขึ้นใหม่

---

## 3. Shapes

สีตัวอย่างในไฟล์คือ Blue Gray 3 `#CDD8E1`

| Shape | ใช้กับ | รายละเอียด |
|---|---|---|
| **Circle** | control เช่น toggle switch | "Because of their unique shape, their visual prominence is high and should be used only where a high visual prominence is desired." |
| **Rounded square** | avatar | "Rounded square are used for avatars." |
| **Rectangles** (มุมเหลี่ยม) | แบ่งพื้นที่: header, side bar, body, banner, footer | วิ่งชนขอบ (edge to edge) มี margin น้อยหรือไม่มีเลย · **ห้ามใช้มุมเหลี่ยมกับ action, avatar หรือ metadata** |
| **Rounded Rectangle** | สิ่งที่กดได้: button, dialog, card, input | รัศมีมุม **8 px** หรือ **24 px** · ต้องมี margin รอบตัว **ห้ามชนขอบ** · รูปทรงเกิดจาก fill, stroke หรือ shadow |

---

## 4. Typography / EN — Gotham Rounded

- ฟอนต์: **Gotham Rounded** (ดาวน์โหลด: https://drive.google.com/drive/u/1/folders/1Jsz3fTGMil1GR7g2i_jFGRvxdSMf5IpB)
- letter-spacing = 0 ทุก style
- ค่าในตารางยึดตาม **ตัวเลขที่เขียนกำกับในหน้า Typography** (ผู้ใช้ยืนยันแล้ว)

| Style | Size | Font style | Line-height | Weight |
|---|---|---|---|---|
| H1 | 36 px | Bold | 40 | 700 |
| H2 | 36 px | Book | 36 | 325 |
| H3 | 24 px | Medium | 30 | 350 |
| H4 | 20 px | Medium | 24 | 350 |
| Subheader 1 | 14 px | Medium | 20 | 350 |
| Subheader 2 | 14 px | Book | 20 | 325 |
| Title 1 | 20 px | Medium | 24 | 350 |
| Title 2 | 18 px | Medium | 22 | 350 |
| Title 3 | 16 px | Medium | 20 | 350 |
| Body 1 | 16 px | Book | 20 | 325 |
| Body 2 | 14 px | Medium | 24 | 350 |
| Body 3 | 14 px | Book | 24 | 325 |
| Body 4 | 12 px | Medium | 16 | 350 |
| Body 5 | 12 px | Book | 16 | 325 |
| Button large | 20 px | Medium | 24 | 350 |
| Button Small | 16 px | Medium | 16 | 350 |
| Button underline | 16 px | Book (ขีดเส้นใต้) | 16 | 325 |
| Button underline small | 14 px | Book (ขีดเส้นใต้) | 14 | 325 |
| Button underline extra small | 12 px | Book (ขีดเส้นใต้) | 12 | 325 |
| Small | 9 px | Medium | 10 | 350 |

---

## 5. Typography / TH — Prompt

- ฟอนต์: **Prompt** (ในไฟล์ไม่มีลิงก์ดาวน์โหลด)
- letter-spacing = 0 ทุก style
- ค่าในตารางยึดตาม **ตัวเลขที่เขียนกำกับในหน้า Typography** (ผู้ใช้ยืนยันแล้ว)

| Style | ตัวอย่างในไฟล์ | Size | Font style | Line-height | Weight |
|---|---|---|---|---|---|
| H1 | เอช1 เฮดไลน์ | 36 px | SemiBold | 40 | 600 |
| H2 | เอช2 เฮดไลน์ | 36 px | Regular | 36 | 400 |
| H3 | เอช3 เฮดไลน์ | 24 px | Medium | 30 | 500 |
| H4 | เอช4 เฮดไลน์ | 20 px | Medium | 24 | 500 |
| Subheader 1 | หัวข้อย่อย 1 | 14 px | Medium | 20 | 500 |
| Subheader 2 | หัวข้อย่อย 2 | 14 px | Light | 20 | 300 |
| Title 1 | หัวเรื่อง 1 | 20 px | Medium | 24 | 500 |
| Title 2 | หัวเรื่อง 2 | 18 px | Medium | 22 | 500 |
| Title 3 | หัวเรื่อง 3 | 16 px | Medium | 20 | 500 |
| Body 1 | บอร์ดี้ 1 | 16 px | Light | 20 | 300 |
| Body 2 | บอร์ดี้ 2 | 14 px | Medium | 24 | 500 |
| Body 3 | บอร์ดี้ 3 | 14 px | Regular (กำกับไว้) | 24 | 300 (กำกับไว้) |
| Body 4 | บอร์ดี้ 4 | 12 px | Medium | 16 | 500 |
| Body 5 | บอร์ดี้ 5 | 12 px | Light | 16 | 300 |
| Button large | ปุ่มขนาดใหญ่ | 20 px | Medium | 24 | 500 |
| Button small | ปุ่มขนาดเล็ก | 16 px | Medium | 16 | 500 |
| Button underline | ปุ่มขีดเส้นใต้ | 16 px | Light (ขีดเส้นใต้) | 16 | 300 |
| Button underline small | ปุ่มขีดเส้นใต้เล็ก | 14 px | Light (ขีดเส้นใต้) | 14 | 300 |
| Button underline extra small | ปุ่มขีดเส้นใต้เล็ก | 12 px | Light (ขีดเส้นใต้) | 12 | 300 |
| Small | ขนาดเล็ก | 8 px | Medium | 10 | 500 |

---

## 6. Icon

- ขนาดหลัก **24×24 px** ("Main icon size 24x24 px. but you can resize them accordingly.")
- ขนาดที่แสดงไว้: 12, 16, 20, 24, 40, 56, 72 px
- มี 2 สไตล์: **Regular** (เส้น) และ **Bold** (ทึบ)
- ชื่อ component: `Icon/<หมวด>/<ชื่อ>/<Regular|Bold>` เช่น `Icon/Home/Regular`, `Icon/Calendar/MakeAppointment/Bold`
- หมวดในหน้า Icon: Regular · Bold · Control Icons · Social Icons · Badge icon · Mobile banking icon
- ใช้ไอคอนจาก Figma (node `1:2309`) เท่านั้น ถ้าไม่มีไอคอนที่ต้องการ ให้ถามผู้ใช้ก่อน

### รายชื่อไอคอน
มีทั้ง Regular และ Bold ยกเว้นที่ระบุในวงเล็บ

- **Add**: Circle · **Alert**: Triangle · **Attachment** · **Bin** · **Camera** · **Chat** · **Check**: Circle · **Choosepictuer** · **Consentform** · **Cursor** · **Dashboard** · **Deduct**: Circle · **Detail** · **Discount** · **DoctorF** · **DoctorM** · **Download** · **Edit** · **Email** · **Expertise** (Regular) · **Extend time** · **FaceID** · **Favorite** · **Floder file** · **Graph1 / Graph2 / Graph3** · **Help** (Regular) · **Home** · **Hyperlink** · **Information**: Circle · **List** · **Loading** · **Lock** · **Unlock** · **Login** · **Logout** · **Magic wand** · **Map** · **Massage** · **Mood** · **Moon** · **Music note** · **None** · **Off** · **Paperclip** · **Pause** · **Pencil** · **Picture** · **Price Tag** · **Print** · **Profile** · **Question** · **Receipt** · **Remove**: Circle · **Reward** · **Search** · **Setting** · **Share** · **Shop** · **Speaker** · **Sunrise** · **Synchronize** · **Tag** · **Test** · **Time** · **Touch** · **User1 / User2** · **Warning** · **Wifi1 / Wifi2**
- **Background**: Blur, Default (Regular), Defaul (Bold — สะกดตามไฟล์)
- **Calendar**: AppointmentTime, Default, MakeAppointment, Myappointment, RemoveAppointment, WarningAppointment
- **Creditcard**: Check, Mastercard, Remove, Visa, card (Bold) · **Card**: Card
- **Delivery**: Motorcycle1, Motorcycle2, Package
- **Drug**: Hands · **Insurance**: Card, Hands
- **Emotion**: Verygood, Good, So, Bad, Verybad
- **Filter**: Controller, Filter, Filtered, Funnel
- **Location**: (ทั่วไป), Here, Pin1, Pin2
- **Medical**: Allergy (Regular), Blood, File, Note, Pill, Pills, Visit Note
- **Microphone**: On, Off
- **Money**: Coins, Wallet
- **Navigation**: Hamburger, Horizontal, Vertical
- **Notification**: Active, Default
- **Rating**: Give, Star/Full, Star/Half
- **Screen**: Screen Full, Exit Screen Full
- **Service**: Customer, Help (Bold)
- **Tel**: Call, Hang · **Thumb**: Up, Down
- **Video**: Play · **Video call** (Bold) · **Video call on** · **Video call off**
- **View**: On, Off · **Volume**: On, Off
- **Zoom**: In (`Icon/Regular/Zoom/In`), Out

**Control Icons**
- `Icon/Arrow/Big/*`: Back, Next, Up, Down, Left, Right, Scroll, Scroll down
- `Icon/Arrow/Small/*`: Back, Next, Up, Down, Left, Right, Open, Close
- `Icon/Arrow/Enter` · `Icon/Close`, `Icon/Close 2`, `Icon/Forward`, `Icon/Reverse`, `Icon/Sort`

**Social Icons** (แต่ละตัวมี BW และ Color): Facebook, Instagram, Line, Twitter, Youtube, Google

**Badge icon**: OOCA, Wall of sharing, Sunny, Mooca (Happy, Neutral, Sad)

**Mobile banking icon** (`Icon/mobilebanking/*`): Kplus, SCB, Bangkokbank, Krungsri, Krungthai, QR Promptpay

**ไอคอนที่ไม่ได้อยู่ในระบบชื่อ `Icon/...`** (วางอยู่ในหน้าเดียวกัน): `ci:sort-ascending`, `medical-condition-cough 1`, `ic:round-access-time-filled`, `flag`, `Review`, `sort by`, `history`, `Check small round`, `iconoir:language`

---

## 7. Background

| ชื่อ | ค่า |
|---|---|
| **Background/Default** | สีพื้น `#F6F6F6` (Black Gray 3) |
| **Background/Gradient/Extended** | พื้น `#F6F6F6` + ชั้น gradient ด้านบน สูง 584 px (บนจอ 375×812) ไล่จาก `#DBF0EE` ที่ 41.338% ไปโปร่งใส (`rgba(219,240,238,0)`) ที่ 84.385% ทิศบนลงล่าง |

CSS อ้างอิง (ชั้น gradient):
```css
background: linear-gradient(to bottom, #DBF0EE 41.338%, rgba(228,239,251,0) 84.375%, rgba(219,240,238,0) 84.385%);
```

---

## 8. Button

Component set: **`Button/In card only`** · มุมโค้ง **50 px** (pill) ทุกแบบที่มีพื้น

### Variant properties
| Property | ค่า |
|---|---|
| Type | Primary, Secondary, Text |
| Icon | Yes, No |
| State | Default, Active, Disabled, Loading |
| Size | Default, Small (มีค่า Loading ปนอยู่ใน property นี้ด้วย) |
| Colors | Blue, Red, Turquoise |
| Language | EN, TH |

### ขนาด
| แบบ | ขนาด |
|---|---|
| Primary/Secondary · Size Default | 279 × 40 px |
| Primary/Secondary · Size Small | 88 × 40 px |
| Text (ไม่มีไอคอน) | สูง 16 px |
| Primary/Secondary + Icon | gap 8 px, padding แนวนอน 86 px, ไอคอน 24 px |
| Text + Icon | gap 8 px, ไอคอน 16 px |
| Loading | spinner 16 px อยู่หน้าข้อความ, padding แนวนอน 16 px |

### ฟอนต์บนปุ่ม
- Primary / Secondary: **Button/Small** — EN Gotham Rounded Medium 16/16 · TH Prompt Medium 16/16
- Text: **Button/Underline** — EN Gotham Rounded Book 16/16 ขีดเส้นใต้ · TH Prompt Light 16/16 ขีดเส้นใต้

### สีตาม State (ค่าจริงจาก component)

**Primary** (พื้นเต็ม)
| State | Blue | Red | Turquoise | สีตัวอักษร |
|---|---|---|---|---|
| Default | `#1F77DF` | `#EF7773` | `#00C4B3` | `#FFFFFF` |
| Active | `#8FBBEF` | `#F4A09D` | `#4DD6CA` | `#FFFFFF` |
| Loading | `#62A0E9` | `#F18B88` | `#26CDBE` | `#FFFFFF` |
| Disabled | `#CDD8E1` | `#FAD6D5` | `#B3EDE8` | `#F6F6F6` |

**Secondary** (พื้นขาว `#FFFFFF` + เส้นขอบ 2 px · ตัวอักษรสีเดียวกับเส้นขอบ)
| State | Blue | Red | Turquoise |
|---|---|---|---|
| Default | `#1F77DF` | `#EF7773` | `#00C4B3` |
| Active | `#8FBBEF` | `#F4A09D` | `#4DD6CA` |
| Loading | `#62A0E9` | `#F18B88` | `#26CDBE` |
| Disabled | `#CDD8E1` | `#FAD6D5` | `#B3EDE8` |

**Text** (ไม่มีพื้น ตัวอักษรขีดเส้นใต้) ใช้สีตัวอักษรชุดเดียวกับ Secondary

---

## 9. Elevation

เงาทุกระดับใช้สี Turquoise `#00C4B3` (rgb 0,196,179) · ค่าในตารางยึดตาม **effect จริงใน Figma** (ผู้ใช้ยืนยันแล้ว)

| ระดับ | box-shadow |
|---|---|
| 01 | `0px 2px 8px 0px rgba(0,196,179,0.08)` |
| 02 | `0px 2px 16px 0px rgba(0,196,179,0.12)` |
| 03 | `0px 8px 16px 0px rgba(0,196,179,0.12)` |
| 04 | `0px 16px 24px 0px rgba(0,196,179,0.16)` |
| 05 | `0px 8px 16px -4px rgba(0,196,179,0.12)` |
| 06 | `0px 4px 8px -4px rgba(0,196,179,0.10), 0px 16px 24px 0px rgba(0,196,179,0.10)` |
| 07 | `0px 4px 12px -4px rgba(0,196,179,0.12), 0px 16px 32px 0px rgba(0,196,179,0.16)` |
| 08 | `0px 8px 24px -4px rgba(0,196,179,0.14), 0px 24px 40px 0px rgba(0,196,179,0.18)` |

กล่องตัวอย่างในไฟล์: 200×200 px พื้นขาว มุมโค้ง 24 px (01–04) และ 16 px (05–08)

---

## จุดที่ต้องระวัง (ไฟล์ Figma ขัดกันเอง / ยังไม่ระบุ)

1. **Typography: ข้อความกำกับไม่ตรงกับ text style จริง** — skill นี้ยึดข้อความกำกับ (ผู้ใช้ยืนยันแล้ว) แต่ text style จริงใน Figma ต่างไปดังนี้:
   - EN Body 1: line-height จริง 22 (กำกับ 20)
   - EN Small: size จริง 10 px (กำกับ 9 px) · TH Small: size จริง 10 px (กำกับ 8 px)
   - TH หัวข้อย่อย 1: ตัวอย่างจริงใช้ 20 px / line-height 24 (กำกับ 14/20)
   - Weight ใน Figma variable ส่วนใหญ่เป็น 400 ไม่ตรงกับเลขที่กำกับ (EN 350/700, TH 500)
2. **TH Body 3** ข้อความกำกับเขียนว่า "Regular … Weight 300" ซึ่งขัดกันเอง (Regular = 400, Light = 300) ส่วนตัวอย่างจริงใช้ Prompt Light
3. **TH Button**: ข้อความตัวอย่างเขียนว่า "/ Gotham Rounded" แต่ฟอนต์ที่ใช้จริงคือ Prompt
4. **Elevation**: ข้อความกำกับใต้กล่องไม่ตรงกับ effect จริง (02 ไม่มีข้อความ, 05–08 ไม่ระบุ opacity) — skill นี้ยึด effect จริง
5. **Rounded square (avatar)**: ไม่ได้ระบุรัศมีมุม
6. **Button**: Blue ใช้ระดับ 200 ตอน Active แต่ Red/Turquoise ใช้ระดับ 300 · component `Primary + Icon + Loading` สี Red/Turquoise ใน Figma เป็นแบบพื้นขาวมีขอบ (ต่างจาก Blue ที่เป็นพื้นเต็ม)
7. **Logo** เป็นคำว่า "mindfull" ไม่ใช่ "OOCA" (ผู้ใช้ยืนยันให้บันทึกตามไฟล์)
8. หน้า **Mooca** (มาสคอต) ไม่ได้รวมไว้ใน skill นี้ตามที่ผู้ใช้เลือก

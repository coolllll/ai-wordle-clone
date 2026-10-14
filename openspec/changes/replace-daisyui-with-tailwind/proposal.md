# Proposal

## Why

หน้าจอเกมและประวัติคะแนนพึ่ง class และธีมของ daisyUI ทั้งที่โปรเจกต์ใช้ Tailwind CSS v4 อยู่แล้ว การคง plugin นี้ไว้ทำให้สี ปุ่ม และการ์ดผูกกับ semantic class ของ daisyUI และทดสอบต้องตรวจชื่อ class เหล่านั้น ควรย้ายงานนำเสนอไปใช้ utility และ token ของ Tailwind โดยตรง เพื่อให้สไตล์อยู่ในระบบเดียวกับ Tailwind v4

## What Changes

- ถอด daisyUI ออกจาก stylesheet และ dependency
- กำหนดโทนสีเขียวแบบ emerald ด้วย Tailwind v4 `@theme` แล้วใช้ utility class แทน `btn`, `alert`, `card`, `navbar` และสีแบบ `bg-base-*` / `bg-success`
- คงหน้าเกม หน้าประวัติ แป้นพิมพ์ กระดาน และข้อความสถานะให้ใช้งานได้เหมือนเดิมบนจอแคบและจอกว้าง
- อัปเดตเทสต์ที่ตรวจ class ของ daisyUI ให้ตรวจสไตล์ Tailwind แทน
- **BREAKING** สำหรับโค้ดที่อ้าง class หรือ plugin ของ daisyUI class เหล่านั้นจะไม่ถูกสร้างอีกต่อไป

สมมติฐาน: ไม่เปลี่ยนกฎเกม รูปแบบข้อมูลประวัติ หรือเส้นทางหน้า โทนสีหลักยังเป็นเขียวแบบ emerald ที่ใช้เป็นค่าเริ่มต้นของ daisyUI อยู่ตอนนี้

## Capabilities

### New Capabilities

- `interface-theme`: กำหนดให้ส่วนหัว ปุ่ม แจ้งเตือน ช่องตัวอักษร แป้นพิมพ์ และการ์ดประวัติใช้โทนสีและสถานะที่แยกกันได้ โดยไม่พึ่ง daisyUI

### Modified Capabilities

- ไม่มี requirement ของ `wordle-gameplay` หรือ `score-history` เปลี่ยน การแสดงผลเกมและการดูประวัติยังเป็นไปตาม spec เดิม

## Impact

- `src/app/globals.css` และ component ใน `src/components/` รวมถึง `src/app/history/page.tsx`
- `package.json` ถอด dependency `daisyui`
- เทสต์ `src/smoke.test.ts` และ `src/components/AppShell.test.tsx` ที่ล็อก class ของ daisyUI
- API, ที่เก็บ JSON และกฎการทายคำไม่ได้รับผลกระทบ

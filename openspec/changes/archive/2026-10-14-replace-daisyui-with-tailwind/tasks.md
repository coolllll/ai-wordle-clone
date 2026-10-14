# Tasks

## 1. โทเคนธีม

- [x] 1.1 เพิ่ม `@theme` ใน `src/app/globals.css` สำหรับพื้นหลังหน้า พื้นผิว ข้อความ สีหลัก และสีสถานะถูกตำแหน่ง มีในคำตอบ ไม่มีในคำตอบ สำเร็จ และผิดพลาด แล้วลบ `@plugin "daisyui"` ตรวจว่า `src/smoke.test.ts` ผ่านเมื่อ stylesheet มี `@theme` และไม่มี plugin ของ daisyUI

## 2. ชิ้นส่วนหน้าจอ

- [x] 2.1 แทน class ของ daisyUI ใน `AppShell` ด้วย utility จาก token และปรับ `AppShell.test.tsx` ให้ตรวจว่าลิงก์ History ยังกดได้โดยไม่มี class `btn` หรือ `btn-primary` ตรวจว่าเทสต์นี้ผ่าน
- [x] 2.2 แทนสีช่องตัวอักษรใน `GameBoard` และสีแป้นใน `Keyboard` ด้วย token สถานะชุดเดียวกัน ตรวจว่าเทสต์กระดานเดิมยังผ่าน และช่อง `correct`, `present`, `absent` ใช้คนละชุดสี
- [x] 2.3 แทน `alert` ใน `GameClient` และหน้า `history` รวมถึง `card` ใน `HistoryList` ด้วยกล่องจาก utility ตรวจว่าเทสต์ของ `GameClient` และ `HistoryList` ยังผ่านโดยข้อความสถานะและ `data-testid` เดิมไม่เปลี่ยน

## 3. ถอด dependency

- [x] 3.1 ถอด `daisyui` ออกจาก `package.json` แล้วติดตั้ง dependency ใหม่ ตรวจว่า `package-lock.json` ไม่มีแพ็กเกจ `daisyui` และคำสั่ง `npm test` ผ่าน

## Workflow follow-up

- Archive change นี้หลังรีวิวงาน implement ผ่านแล้ว

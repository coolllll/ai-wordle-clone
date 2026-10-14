# Design

## Context

ดูแรงจูงใจที่ proposal.md หน้าเกมใช้ Tailwind utility อยู่แล้ว แต่สีและชิ้นส่วนหลักยังมาจาก daisyUI ผ่าน `@plugin "daisyui"` ใน `src/app/globals.css` ธีมเริ่มต้นคือ `emerald` class ที่ต้องแทนที่กระจายอยู่ใน `AppShell`, `GameClient`, `GameBoard`, `Keyboard`, `HistoryList` และหน้า `history`

ข้อกำหนดพฤติกรรมอยู่ที่ `specs/interface-theme/spec.md` กติกาเกมและประวัติคะแนนไม่เปลี่ยน

## Goals / Non-Goals

**Goals:**

- กำหนด token สีใน CSS ด้วย Tailwind v4 `@theme` แล้วให้ utility ที่สร้างจาก token นั้นใช้ทั้ง shell, ปุ่ม, แจ้งเตือน, ช่องตัวอักษร และแป้นพิมพ์
- ถอด daisyUI ออกจน stylesheet และ `package.json` ไม่เหลือ plugin หรือ dependency นี้

**Non-Goals:**

- ไม่เพิ่ม `tailwind.config.js` และไม่ใช้ directive แบบ Tailwind v3
- ไม่เปลี่ยนโครง DOM ที่เทสต์อ้างผ่าน `data-testid` หรือ `data-state`
- ไม่ปรับกฎการทายคำ, API หรือไฟล์ JSON

## Decisions

### ใช้ `@theme` เป็นแหล่งสีเดียว

เพิ่ม token ใน `src/app/globals.css` ต่อจาก `@import "tailwindcss"` เช่น พื้นหลังหน้า, พื้นผิวส่วนหัวและการ์ด, ข้อความ, สีหลักสีเขียว, สีถูกตำแหน่ง, สีมีตัวอักษรแต่ผิดตำแหน่ง, สีไม่มีในคำตอบ, สีสำเร็จ และสีผิดพลาด แต่ละ token ต้องสร้าง utility `bg-*`, `text-*` และ `border-*` ได้

ทางเลือกที่ไม่ได้ใช้: คง `@plugin "daisyui"` ไว้แล้วเขียนทับเฉพาะบาง class จะยังผูกธีมกับ daisyUI หรือใส่สีแบบ arbitrary ในแต่ละ component จะทำให้โทนสีกระจายและแก้ทีหลังยาก

### แทน semantic class ของ daisyUI ด้วย utility ที่ประกอบเอง

| daisyUI ปัจจุบัน | แทนด้วย |
| --- | --- |
| `bg-base-200`, `bg-base-100`, `text-base-content`, `border-base-300` | พื้นหลังหน้า, พื้นผิว, ข้อความ และเส้นขอบจาก token |
| `navbar` | flex header ที่มีพื้นผิวและเงา |
| `btn`, `btn-primary`, `btn-sm`, `btn-outline` | ปุ่มจาก padding, radius, สีพื้น และสีขอบ |
| `btn-success`, `btn-warning`, `btn-neutral` | ปุ่มแป้นพิมพ์ตามสีถูกตำแหน่ง, มีในคำตอบ, และไม่มีในคำตอบ |
| `alert`, `alert-success`, `alert-error` | กล่องแจ้งเตือนที่มีพื้นและข้อความคนละสีตามชนิด |
| `card`, `card-body` | กล่องประวัติที่มีพื้นผิว เส้นขอบ และระยะห่างภายใน |
| `bg-success`, `bg-warning`, `bg-neutral` และคู่ `text-*-content` บนช่องตัวอักษร | พื้นและข้อความของช่องจาก token สถานะเดียวกันกับแป้นพิมพ์ |

แป้นพิมพ์และกระดานใช้ชุดสีสถานะเดียวกัน เพื่อให้สถานะที่ผู้เล่นเห็นไม่ขัดกัน

ทางเลือกที่ไม่ได้ใช้: สร้าง `@utility btn` เพื่อเลียนชื่อ class เดิม จะยังล็อก API ของ daisyUI ไว้ในโปรเจกต์

### อัปเดตเทสต์ให้ล็อกผลที่มองเห็น ไม่ล็อกชื่อ class ของ daisyUI

`src/smoke.test.ts` ตรวจว่า `globals.css` มี `@theme` และไม่มี `@plugin "daisyui"` `AppShell.test.tsx` ตรวจว่าลิงก์ History ยังเป็นลิงก์ที่กดได้ และ class ไม่มี `btn` หรือ `btn-primary` ของ daisyUI

## Risks / Trade-offs

- [สี emerald ของ daisyUI ไม่มี token ชื่อเดียวกันใน Tailwind] → เลือกค่าเขียวที่ใกล้เคียงแล้วใช้ token เดียวกันทั้งแอป ไม่พยายามคัดลอกตัวเลขสีภายในของ daisyUI
- [class สั้นของ daisyUI ถูกแทนด้วย utility ยาวขึ้น] → รวมเฉพาะสีไว้ที่ `@theme` ไม่สร้างชั้น component ใหม่
- [เทสต์ e2e ตรวจข้อความ ไม่ตรวจ class] → คง `data-testid` เดิม เพื่อไม่ให้การเปลี่ยนสไตล์ทำให้เกณฑ์การเล่นพัง

## Migration Plan

1. เพิ่ม token และลบ `@plugin "daisyui"`
2. แทน class ใน component และหน้าประวัติ
3. ถอด dependency `daisyui` แล้วรันเทสต์หน่วยและเทสต์ที่เกี่ยวข้องกับหน้าจอ
4. ถ้าต้องย้อนกลับ ให้นำ plugin, dependency และ class เดิมกลับมาพร้อมกัน การแสดงผลเกมไม่มีการย้ายข้อมูล

## Open Questions

ไม่มีคำถามที่เปลี่ยน spec หรือลำดับงาน สมมติฐานเรื่องโทนเขียวแบบ emerald ถูกบันทึกใน proposal แล้ว

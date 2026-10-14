# Tasks

## 1. หน้าเกม

- [x] 1.1 เอา `history-panel`, state ประวัติ และ effect ที่เรียก `fetchHistory` ออกจาก `GameClient` โดยคงสถานะชนะหรือแพ้ของเกมปัจจุบัน ปุ่ม New game และ alert การทายหรือการบันทึกผล ปรับ `GameClient.test.tsx` ให้ตรวจว่าไม่มี `history-panel` และไม่มีการเรียก `/api/history` ทั้งตอนเปิดหน้าและหลังจบเกม ตรวจว่าเทสต์นี้ผ่านเมื่อชนะ แพ้ และบันทึกผลไม่สำเร็จยังแสดงข้อความเดิม
- [x] 1.2 ลบ `fetchHistory` ออกจาก `src/lib/client-api.ts` เมื่อไม่มีผู้เรียกเหลือ และอย่าลบ `GET /api/history` หรือ `HistoryList` ตรวจว่าไม่มี import ของ `fetchHistory` และเทสต์ `HistoryList` ยังผ่าน

## Workflow follow-up

- Archive change นี้หลังรีวิวงาน implement ผ่านแล้ว

# Proposal

## Why

`/opsx-propose` และ `/opsx-explore` ตัดสินใจเรื่อง scope และเกณฑ์รับได้เองเมื่อคำขอคลุมเครือ ทำให้แผนที่เขียนลง artifact ไม่ตรงกับที่ผู้ใช้ต้องการ โปรเจกต์มี skill `grill-me` แล้ว แต่ workflow ทั้งสองยังไม่เรียกใช้ และ skill `grilling` ที่มันชี้ไปยังไม่ได้ติดตั้ง

## What Changes

- `/opsx-propose` เรียก `grill-me` ทุกครั้งก่อน `openspec new change` **BREAKING** สำหรับพฤติกรรมเดิมที่เขียน artifact ทันทีเมื่อคำขอชัดเจนแล้ว
- ถ้า `/opsx-propose` ยังไม่มีคำอธิบายงาน หรือมีแค่ชื่อ change ให้ถามก่อนว่าจะสร้างหรือแก้อะไร แล้วเริ่ม `grill-me` หลังมีคำอธิบายนั้น
- เขียน proposal, spec, design และ tasks ของ change ใหม่ได้เมื่อผู้ใช้ยืนยันว่าเข้าใจตรงกัน
- `/opsx-explore` เรียก `grill-me` เมื่อกำลังวางแผน change หรือเค้นแผนกับดีไซน์ การสำรวจโค้ด คำถามเปิด และการสืบข้อเท็จจริงใช้ท่า explore เดิม
- ขณะ `grill-me` ทำงานใน explore ให้ถามตามกฎของ `grilling` จนต้นไม้ตัดสินใจว่าง
- หลังเข้าใจตรงกันแล้ว `/opsx-explore` ยังต้องได้รับคำขอหรือคำตอบ yes ก่อนเขียน artifact
- ใส่คำสั่งนี้ทั้งใน command และ skill ของ propose และ explore เป็นภาษาอังกฤษ โดยสั่งเรียก `grill-me` และกำหนดประตูก่อนเขียนไฟล์ โดยไม่ก็อปขั้นตอนสัมภาษณ์ของ `grilling`
- ติดตั้ง skill `grilling` จาก `mattpocock/skills` ลง `.agents/skills/grilling` และบันทึกใน `skills-lock.json`
- workflow อื่นนอกจาก propose กับ explore ยังทำงานแบบเดิม

## Capabilities

### New Capabilities

- `planning-interview`: การสัมภาษณ์ด้วย `grill-me` ก่อนเขียน planning artifact ของ `/opsx-propose` และ `/opsx-explore`

### Modified Capabilities

- ไม่มี capability เดิมที่ requirement เปลี่ยน spec ปัจจุบันคือ `interface-theme`, `player-auth`, `score-history` และ `wordle-gameplay`

## Impact

- `.cursor/commands/opsx-propose.md`
- `.cursor/skills/openspec-propose/SKILL.md`
- `.cursor/commands/opsx-explore.md`
- `.cursor/skills/openspec-explore/SKILL.md`
- `.agents/skills/grilling/`
- `skills-lock.json`
- บทสัมภาษณ์กับผู้ใช้เป็นภาษาไทยตาม AGENTS.md
- ไม่แตะโค้ดเกม, API หรือ spec ของเกม

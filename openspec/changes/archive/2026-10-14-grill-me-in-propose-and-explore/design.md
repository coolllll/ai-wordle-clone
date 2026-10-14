# Design

## Context

ดูแรงจูงใจที่ proposal.md และพฤติกรรมที่ต้องได้ใน `specs/planning-interview/spec.md`

`/opsx-propose` กับ `/opsx-explore` มีคนละสองไฟล์ที่เนื้อหา workflow ขนานกัน: `.cursor/commands/opsx-propose.md` กับ `.cursor/skills/openspec-propose/SKILL.md` และ `.cursor/commands/opsx-explore.md` กับ `.cursor/skills/openspec-explore/SKILL.md` ขั้นแรกของ propose ถามเฉพาะเมื่อคำขอคลุมเครือ แล้วสร้าง change ได้เลย ส่วนหัวข้อ Planning a Change ของ explore สั่งให้ถามทีละข้อและหยุดเมื่อชัดพอ

`grill-me` อยู่ที่ `.agents/skills/grill-me/SKILL.md` มี `disable-model-invocation: true` และเนื้อหาคือคำสั่งให้เรียก skill `grilling` skill นั้นยังไม่อยู่ในโปรเจกต์ `skills-lock.json` บันทึก `grill-me` จาก `mattpocock/skills` แล้ว

## Goals / Non-Goals

**Goals:**

- ให้ command และ skill ของ workflow เดียวกันใช้ประตูสัมภาษณ์ชุดเดียวกัน
- ให้ข้อความที่เพิ่มเป็นภาษาอังกฤษ และสั่งเรียก `grill-me` โดยไม่ก็อปขั้นตอนของ `grilling`
- ให้ `grilling` ติดตั้งด้วยเส้นทางเดียวกับ `grill-me`

**Non-Goals:**

- เปลี่ยนรูปแบบสัมภาษณ์ภายใน `grilling`
- แปลไฟล์ workflow ทั้งไฟล์เป็นภาษาไทย
- ใส่ `grill-me` ใน apply, archive, update หรือ sync

## Decisions

### 1. แทรกประตูภาษาอังกฤษ แล้วปล่อยบทสัมภาษณ์ไว้ที่ skill

ใน propose ให้แทนขั้น "ถามเมื่อคลุมเครือ" ด้วยประตูนี้: ถ้ายังไม่มีคำอธิบายงาน หรือมีแค่ชื่อ change ให้ถามก่อนว่าจะสร้างหรือแก้อะไร เมื่อมีคำอธิบายแล้วให้เรียก `grill-me` ก่อน `openspec new change` และเขียน artifact ได้เมื่อผู้ใช้ยืนยันว่าเข้าใจตรงกัน

ใน explore ให้ใส่ประตูในหัวข้อ Planning a Change: ถ้ากำลังวางแผน change หรือเค้นแผนกับดีไซน์ ให้เรียก `grill-me` และให้กฎของ `grilling` ทับการถามทีละข้อและการหยุดเมื่อชัดพอ การสำรวจโค้ด คำถามเปิด และการสืบข้อเท็จจริงยังใช้ท่าเดิม หลังเข้าใจตรงกันแล้ว การเขียน artifact ยังต้องได้คำขอหรือคำตอบ yes ตาม guardrail เดิม

ทางเลือกที่ตัดไป: ก็อปบทสัมภาษณ์เข้าไฟล์ workflow ทำให้สองแหล่งคำสั่งเดินคนละทางเมื่อ `grilling` เปลี่ยน

### 2. แก้ command และ skill คู่กัน

Cursor โหลด slash command กับ skill คนละไฟล์ จึงใส่ประตูเดียวกันทั้งสี่ไฟล์ ตรวจว่าคู่ propose ตรงกันและคู่ explore ตรงกันหลังแก้

ทางเลือกที่ตัดไป: แก้เฉพาะ skill เพราะ `/opsx-propose` และ `/opsx-explore` อ่านจาก `.cursor/commands/`

### 3. ติดตั้ง `grilling` ผ่าน skills CLI

ใช้ `npx skills add https://github.com/mattpocock/skills --skill grilling` ให้ไฟล์ไปที่ `.agents/skills/grilling` และให้ CLI อัปเดต `skills-lock.json` แบบเดียวกับ `grill-me` เครื่องนี้ต้องใช้ Node 22 เพราะ Node 20.11.1 รัน CLI นี้ไม่ได้

ทางเลือกที่ตัดไป: คัดลอก `SKILL.md` มือเข้า `.cursor/skills` เพราะ `grill-me` ที่โปรเจกต์ใช้อยู่ถูกติดตั้งที่ `.agents/skills`

### 4. ให้เอเจนต์แยกโหมดของ explore จากข้อความผู้ใช้

ข้อความที่กำลังตัดสินใจเรื่องแผนหรือดีไซน์เข้า `grill-me` ข้อความที่ขอให้ดูของที่มีอยู่เข้าท่า explore ข้อเท็จจริงที่สัมภาษณ์ต้องใช้ให้เอเจนต์ตรวจเอง ตามที่ `grilling` กำหนดอยู่แล้ว

## Risks / Trade-offs

- [ไฟล์ command กับ skill หลุดกัน] → แก้เป็นคู่ในงานเดียวกัน แล้วเทียบข้อความประตูของแต่ละคู่
- [เอเจนต์แยกโหมด explore ผิด] → เขียนเกณฑ์วางแผนกับการสำรวจไว้ในประตูภาษาอังกฤษ
- [`grill-me` ไม่ถูกเรียกเองเพราะ `disable-model-invocation`] → workflow สั่งเรียกตรง ๆ
- [การอัปเดต OpenSpec ภายหลังทับไฟล์ที่ `generatedBy` ไว้] → ใส่ประตูเป็นบล็อกที่หาเจอ เพื่อเอากลับมาได้ถ้าไฟล์ถูกสร้างใหม่
- [สัมภาษณ์ทุกครั้งทำให้ propose ช้าขึ้น] → เป็นพฤติกรรมที่เลือกแล้ว ไม่มีทางลัดเมื่อคำขอชัด

## Migration Plan

ไม่มีข้อมูลเกมให้ย้าย ติดตั้ง `grilling` แล้วแก้สี่ไฟล์ workflow ถ้าต้องย้อนกลับ ให้คืนสี่ไฟล์นั้นและเอา `grilling` ออกจาก `.agents/skills` กับ `skills-lock.json`

## Open Questions

ไม่มี

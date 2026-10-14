# Tasks

## 1. Skill `grilling`

- [ ] 1.1 ติดตั้ง `grilling` ด้วย Node 22 ผ่าน `npx skills add https://github.com/mattpocock/skills --skill grilling` ตรวจว่า `.agents/skills/grilling/SKILL.md` มีอยู่ และ `skills-lock.json` มีรายการ `grilling` จาก `mattpocock/skills`

## 2. ประตูของ `/opsx-propose`

- [ ] 2.1 ใส่ประตูภาษาอังกฤษชุดเดียวกันใน `.cursor/commands/opsx-propose.md` และ `.cursor/skills/openspec-propose/SKILL.md` โดยให้ถามโจทย์ก่อนเมื่อยังไม่มีคำอธิบายหรือมีแค่ชื่อ change เรียก `grill-me` ก่อน `openspec new change` และเขียน artifact ได้เมื่อผู้ใช้ยืนยันว่าเข้าใจตรงกัน โดยไม่ก็อปขั้นตอนของ `grilling` ตรวจว่าสองไฟล์มีประตูนี้ตรงกัน และขั้นที่ถามเฉพาะเมื่อคำขอคลุมเครือถูกแทนแล้ว

## 3. ประตูของ `/opsx-explore`

- [ ] 3.1 ใส่ประตูภาษาอังกฤษชุดเดียวกันใน `.cursor/commands/opsx-explore.md` และ `.cursor/skills/openspec-explore/SKILL.md` ที่หัวข้อ Planning a Change ให้เรียก `grill-me` เมื่อวางแผนหรือเค้นแผนกับดีไซน์ จนต้นไม้ตัดสินใจว่าง และให้กฎนั้นทับการถามทีละข้อ การสำรวจโค้ดกับคำถามเปิดยังใช้ท่าเดิม และหลังเข้าใจตรงกันแล้วยังต้องได้คำขอหรือคำตอบ yes ก่อนเขียน artifact ตรวจว่าสองไฟล์มีประตูนี้ตรงกัน และไม่ได้ก็อปขั้นตอนของ `grilling`

## 4. ตรวจทั้งชุด

- [ ] 4.1 เทียบประตูของ command กับ skill ในแต่ละ workflow ตรวจว่า apply, archive, update และ sync ไม่มีคำสั่งให้เรียก `grill-me` และว่า `grill-me` ยังชี้ไปที่ `grilling`

## Workflow follow-up

- Archive change นี้หลังรีวิวงาน implement ผ่านแล้ว

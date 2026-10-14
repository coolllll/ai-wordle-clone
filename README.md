# Word Guess

เกมทายคำห้าตัวอักษรสำหรับผู้เล่นคนเดียว ทำงานบนเครื่องด้วย Next.js process เดียว กติกาและการตรวจคำอยู่ฝั่ง server และเกมที่จบแล้วถูกบันทึกลงไฟล์ JSON

## ความต้องการของระบบ

- Node.js 20
- npm 10

## ติดตั้ง

```bash
npm install
npx playwright install chromium
```

คำสั่งที่สองใช้สำหรับ end-to-end test เท่านั้น

## พัฒนา

```bash
npm run dev
```

เปิด [http://127.0.0.1:3000](http://127.0.0.1:3000)

## ทดสอบ

```bash
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

`npm run test:e2e` build แอปก่อน แล้วเปิด production server ด้วย `npm start` เพื่อรัน end-to-end test ต้องติดตั้ง Chromium ของ Playwright ก่อน

## Production บนเครื่อง

```bash
npm run build
npm start
```

## ข้อมูล JSON

- `data/words.json` คือรายการคำตอบและคำที่อนุญาตให้ทาย ถูกจัดส่งมากับโปรเจกต์
- `data/games.json` คือเกมที่กำลังเล่นและเกมที่จบแล้ว แอปสร้างไฟล์นี้เมื่อเริ่มบันทึกครั้งแรก
- ตั้ง `WORDLE_DATA_DIR` เพื่อย้ายโฟลเดอร์ที่เก็บ `games.json`
- ตั้ง `WORDLE_WORDS_PATH` เพื่อใช้ไฟล์คำศัพท์อื่น

## ข้อจำกัด

แอปนี้ออกแบบให้มี Node.js process เดียว การเขียน `games.json` ถูกทำให้เป็นลำดับภายใน process นั้นและแทนที่ไฟล์แบบ atomic แต่ไม่รองรับ serverless, หลาย process, หรือหลาย instance ที่ใช้ไฟล์เดียวกันพร้อมกัน การรัน `next start` มากกว่าหนึ่งครั้งกับไฟล์เดียวกันอาจทำให้ข้อมูลหาย

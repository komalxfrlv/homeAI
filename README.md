# Fast run
cp .example.env .env

npm install

npm install prisma --save-dev

npx prisma migrate dev

npm run dev
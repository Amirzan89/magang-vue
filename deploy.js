import 'dotenv/config'
import fs from 'fs-extra'
import path from 'path'
const target = process.env.DEPLOY || '../laravel/public/dist'
const src = path.resolve('dist')
if(!fs.existsSync(src)){
    console.error('❌ dist folder not found. Run npm run build first.')
    process.exit(1)
}

fs.copySync(src, target, { overwrite: true })
console.log(`✅ Copied dist → ${target}`)
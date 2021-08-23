import { copySync } from 'fs-extra'

const dirs = [
  {
    in: 'src/server/public/',
    out: 'dist/server/public/'
  }
]

for (const dir of dirs) {
  copySync(dir.in, dir.out)
}

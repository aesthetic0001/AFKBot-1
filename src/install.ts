import { copySync } from 'fs-extra'

const dirs = [
  {
    in: 'src/server/',
    out: 'dist/server/'
  }
]

for (const dir of dirs) {
  copySync(dir.in, dir.out)
}

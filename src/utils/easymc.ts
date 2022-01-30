import fetch from 'node-fetch'

async function getAlt (token: string): Promise<Alt> {
  const redeemed = await redeem(token)
  return {
    selectedProfile: {
      name: redeemed.mcName,
      id: redeemed.uuid.replace(/-/g, '')
    },
    accessToken: redeemed.session,
    clientToken: token,
    microsoft: redeemed.microsoft
  }
}

async function redeem (token: string): Promise<Redeemed> {
  const res = await fetch('https://api.easymc.io/v1/token/redeem/', {
    method: 'POST',
    body: JSON.stringify({
      token: token
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const parsed = JSON.parse(await res.text())
  if (parsed.error != null) {
    throw new Error(parsed.error)
  }

  return parsed
}

interface Redeemed {
  session: string
  uuid: string
  mcName: string
  userId: string
  microsoft: boolean
}

interface Alt {
  selectedProfile: {
    name: string
    id: string
  }
  accessToken: string
  clientToken: string
  microsoft: boolean
}

export {
  getAlt
}

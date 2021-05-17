const create = async (params, credentials, shop) => {
  try {
    let response = await fetch('/api/shops/by/'+params.userId, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: shop
    })
    return await response.json()
  } catch (error) {
    console.log(error)
  }
}

const list = async (signal) => {
  try {
    let response = await fetch('/api/shops', {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const listByOwner = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/shops/by/' + params.userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

export {
  create,
  list,
  listByOwner,
}

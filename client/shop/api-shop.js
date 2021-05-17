const create = async (params, credentials, shop) => {
  try {
    let response = await fetch('/api/shops/by/'+params.userId, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: shop
    })
    return response.json()
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

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/shops/' + params.shopId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const update = async (params, credentials, shopUpdate) => {
  try {
    let response = await fetch('/api/shops/'+params.shopId, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: shopUpdate
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const remove = async (params, credentials) => {
  try {
    let response = await fetch('/api/shops/' + params.shopId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

export {
  create,
  list,
  listByOwner,
  read,
  update,
  remove,
}

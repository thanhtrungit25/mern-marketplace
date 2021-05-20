const create = async (params, credentials, product) => {
  try {
    let response = await fetch('/api/products/by/'+params.shopId, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: product
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const remove = async ({ shopId, productId }, credentials) => {
  try {
    let response = await fetch(`/api/product/${shopId}/${productId}`, {
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

const update = async ({ shopId, productId }, credentials, product) => {
  try {
    let response = await fetch(`/api/product/${shopId}/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + credentials.t
      },
      body: product,
    })
    return response.json()
  } catch(err) {
    console.log(err)
  }
}

const listByShop = async (params, signal) => {
  try {
    let response = await fetch('/api/products/by/'+params.shopId, {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const listLatest = async (signal) => {
  try {
    let response = await fetch('/api/products/latest', {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const listRelated = async (params, signal) => {
  try {
    let response = await fetch('/api/products/related/'+params.productId, {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/products/'+params.productId, {
      method: 'GET',
      signal: signal
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

export {
  create,
  read,
  listByShop,
  listLatest,
  listRelated,
  remove,
  update,
}
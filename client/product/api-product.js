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

export {
  create,
  listByShop,
}
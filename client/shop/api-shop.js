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

export {
  create,
}

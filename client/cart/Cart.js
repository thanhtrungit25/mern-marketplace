import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Checkout from './Checkout'
import CartItems from './CartItems'
import { StripeProvider } from 'react-stripe-elements';
import config from '../../config/config'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30
  }
}))

export default function Cart() {
  const classes = useStyles()
  const [checkout, setCheckout] = useState(false)

  const showCheckout = (val) => {
    setCheckout(val)
  }

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6} sm={6}>
          <CartItems checkout={checkout} setCheckout={showCheckout} />
        </Grid>
        {checkout && (
          <Grid item xs={6} sm={6}>
            <StripeProvider apiKey={config.stripe_test_api_key}>
              <Checkout />
            </StripeProvider>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

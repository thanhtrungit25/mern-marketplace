import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import queryString from 'querystring'
import auth from '../auth/auth-helper'
import { stripeUpdate } from './api-user'

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: '1.1em'
  },
  subheading: {
    color: theme.palette.openTitle,
    marginLeft: '24px'
  }
}))

export default function StripeConnect(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    connecting: false,
    connected: false,
    error: false
  })

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    const jwt = auth.isAuthenticated()
    const parsed = queryString.parse(props.location.search)

    if (parsed.error) {
      setValues({ ...values, error: true })
    }

    if (parsed.code) {
      setValues({ ...values, error: false, connecting: true })
      // post call to stripe, get credentials and update user data
      stripeUpdate(
        {
          userId: jwt.user._id
        },
        {
          t: jwt.token
        },
        parsed.code,
        signal
      ).then((data) => {
        if (data.error) {
          setValues({ ...values, error: true, connected: false })
        } else {
          setValues({
            ...values,
            error: false,
            connected: true,
            connecting: false
          })
        }
      })
    }
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type='title' className={classes.title}>
          Connect to Stripe Account
        </Typography>
        {values.error && (
          <Typography type='title' className={classes.subheading}>
            Could not connect to your Stripe account. Try again later
          </Typography>
        )}
        {values.connecting && (
          <Typography type='subheading' className={classes.subheading}>
            Connecting your Stripe account ...
          </Typography>
        )}
        {values.connected && (
          <Typography type='subheading' className={classes.subheading}>
            Your Stripe account successfully connected!
          </Typography>
        )}
      </Paper>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import { Divider, Paper } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { Link } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import auth from './../auth/auth-helper'
import { listByOwner } from './api-shop'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px` ,
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  addButton:{
    float:'right'
  },
  avatar: {
    width: 100,
    height: 100
  },
  subheading: {
    color: theme.palette.text.secondary
  },
  shopTitle: {
    fontSize: '1.2em',
    marginBottom: '5px'
  },
  details: {
    padding: '24px'
  },
  leftIcon: {
    marginRight: '8px'
  }
}))

export default function MyShops() {
  const classes = useStyles()
  const [shops, setShops] = useState([])

  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByOwner(
      {
        userId: jwt.user._id
      },
      {
        t: jwt.token
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setShops(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  /**
   *
   * @param {*} shop
   * TODO add remove shop to DeleteShop component like props
   */
  const removeShop = (shop) => {
    const updatedShops = [...shops]
    const index = updatedShops.indexOf(shop)
    updatedShops.splice(index, 1)
    setShops(updatedShops)
  }

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type='title' className={classes.title}>
          Your Shops
          <span className={classes.addButton}>
            <Link to='/seller/shop/new'>
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> New Shop
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {shops.map((shop, i) => (
            <span key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    src={`/api/shops/logo/${shop._id}?${new Date().getTime()}`}
                  />
                </ListItemAvatar>
                <div className={classes.details}>
                  <Typography
                    className={classes.shopTitle}
                    type='headline'
                    component='h2'
                    color='primary'
                  >
                    {shop.name}
                  </Typography>
                  <Typography
                    className={classes.subheading}
                    type='subheading'
                    component='h4'
                  >
                    {shop.description}
                  </Typography>
                </div>
                <ListItemSecondaryAction>
                  <Link to={`/seller/shop/edit/${shop._id}`}>
                    <IconButton edge='end' aria-label='edit' color='primary'>
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton edge='end' aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </span>
          ))}
        </List>
      </Paper>
    </div>
  )
}

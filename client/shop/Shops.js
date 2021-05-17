import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { list } from './api-shop'
import { Divider, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(3)
  },
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.protectedTitle,
    textAlign: 'center',
    fontSize: '1.2em'
  },
  avatar:{
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
  }
}));

export default function Shops() {
  const classes = useStyles();
  const [shops, setShops] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    list(signal).then(data => {
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

  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          All Shops
        </Typography>
        <List dense>
        {shops.map((shop, i) => (
          <Link to={`/shops/${shop._id}`} key={i}>
            <Divider />
            <ListItem button>
              <ListItemAvatar>
                <Avatar className={classes.avatar} src={`/api/shops/logo/${shop._id}?${new Date().getTime()}`} />
              </ListItemAvatar>
              <div className={classes.details}>
                <Typography className={classes.shopTitle} type="headline" component="h2" color="primary">
                  {shop.name}
                </Typography>
                <Typography className={classes.subheading} type="subheading" component="h4">
                  {shop.description}
                </Typography>
              </div>
            </ListItem>
            <Divider />
          </Link>
        ))}
        </List>
      </Paper>
    </div>
  )
}

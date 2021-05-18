import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { read } from './api-shop';
import { listByShop } from '../product/api-product';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Products from '../product/Products'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(1),
    color: theme.palette.openTitle,
  },
  bigAvatar: {
    width: 100,
    height: 100,
    margin: 'auto'
  },
  productTitle: {
    width: '100%',
    fontSize: '1.2em',
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
  }
}));

export default function Shop({match}) {
  const classes = useStyles();
  const [shop, setShop] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      shopId: match.params.shopId
    }, signal).then(data => {
      if (data.error) {
        setError(data.error)
      } else {
        setShop(data)
      }
    })

    return function clearnup() {
      abortController.abort()
    }
  }, [match.params.shopId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    listByShop({
      shopId: match.params.shopId
    }, signal).then((data)=>{
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })

    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.shopId])

  const logoUrl = shop._id
    ? `/api/shops/logo/${shop._id}`
    : '/api/shops/photo/defaultPhoto'

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={4} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography type="headline" component="h2" className={classes.title}>
                {shop.name}
              </Typography>
              <Avatar src={logoUrl} className={classes.bigAvatar} />
              <Typography type="subheading" component="h2" className={classes.subheading}>
                {shop.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <Typography type="title" component="h2" className={classes.productTitle}>
              Products
            </Typography>
            <Products products={products} searched={false} />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

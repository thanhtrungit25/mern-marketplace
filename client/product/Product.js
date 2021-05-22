import React, { useState, useEffect } from 'react'
import {makeStyles} from '@material-ui/core/styles'
import { listRelated, read } from './api-product'
import Icon from '@material-ui/core/Icon';
import AddCartIcon from '@material-ui/icons/AddShoppingCart';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Suggestions from './Suggestions';
import AddToCart from '../cart/AddToCart';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  flex:{
    display:'flex'
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '24px',
    color: theme.palette.openTitle
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: '#375a53',
  },
  media: {
    height: 200,
    display: 'inline-block',
    width: '45%',
    marginLeft: '24px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  link:{
    color: '#3e4c54b3',
    fontSize: '0.9em'
  },
  addCart: {
    width: '35px',
    height: '35px',
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b'
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  },
  iconButton: {
    width: '28px',
    height: '28px'
  },
}))

export default function Product({match}) {
  const classes = useStyles()
  const [product, setProduct] = useState({shop:{}})
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const fetchProduct = async () => {
      try {
        const data = await read({productId: match.params.productId}, signal)
        console.log('----fetchProduct data----', data)
        if (data.error) {
          setError(data.error)
        } else {
          setProduct(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchProduct()
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.productId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const fetchListRelated = async () => {
      try {
        const data = await listRelated({productId: match.params.productId}, signal)
        if (data.error) {
          setError(data.error)
        } else {
          setSuggestions(data)
        }

        return function cleanup() {
          abortController.abort()
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchListRelated()
  }, [match.params.productId])

  const imageUrl = product._id
    ? `/api/products/image/${product._id}?${new Date().getTime()}`
    : '/api/products/defaultPhoto'
  return (
    <div className={classes.root}>
      <Grid container spacing={10}>
        <Grid item xs={7} sm={7}>
          <Card className={classes.card}>
            <CardHeader
              action={
                <div style={{ marginTop: '20px' }}>
                  <AddToCart item={product} cartStyle={classes.addCart} />
                </div>
              }
              title={product.name}
              subheader="In Stock"
            />
            <div className={classes.flex}>
              <CardMedia
                className={classes.media}
                image={imageUrl}
                title={product.name}
              />
              <Typography variant="subtitle1" component="p" className={classes.subheading}>
                {product.description}<br/>
                <span className={classes.price}>$ {product.price}</span>
                <span>
                  <Icon className={classes.icon}>shopping_basket</Icon> {product.shop.name}
                </span>
              </Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={5} sm={5}>
          <Suggestions title={"Related Products"} products={suggestions} />
        </Grid>
      </Grid>
    </div>
  )
}

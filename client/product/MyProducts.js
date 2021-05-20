import React, { useEffect, useState, memo } from 'react'
import PropTypes from 'prop-types'
import { listByShop } from './api-product'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Icon from '@material-ui/core/Icon'
import { Divider, Paper } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { Link } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import auth from './../auth/auth-helper'
import IconButton from '@material-ui/core/IconButton'
import DeleteProduct from './DeleteProduct'

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
  productTitle: {
    fontSize: '1.2em',
    marginBottom: '5px'
  },
  details: {
    padding: '24px'
  },
  leftIcon: {
    marginRight: '8px'
  },
  cover: {
    width: 110,
    height: 100,
    margin: 8
  }
}))

const MyProducts = memo(props => {
  const classes = useStyles()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByShop({
      shopId: props.shopId
    }, signal).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [props.shopId])

  const removeProduct = (product) => {
    let updatedProducts = [...products]
    const index = updatedProducts.indexOf(product)
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

  return (
    <Card>
      <Typography type='title' className={classes.title}>
        Products
        <span className={classes.addButton}>
          <Link to={`/seller/${props.shopId}/products/new`}>
            <Button color="primary" variant="contained">
              <Icon className={classes.leftIcon}>add_box</Icon> New Product
            </Button>
          </Link>
        </span>
      </Typography>
      <List dense>
          {products.map((product, i) => (
            <span key={i}>
              <ListItem>
                <CardMedia
                  className={classes.cover}
                  image={`/api/products/image/${product._id}?${new Date().getTime()}`}
                  title={product.name}
                />
                <div className={classes.details}>
                  <Link to={`/product/${product._id}`}>
                  <Typography
                      type='headline'
                      component='h2'
                      color='primary'
                      className={classes.productTitle}
                    >
                      {product.name}
                    </Typography>
                  </Link>
                  <Typography
                    type='headline'
                    component='h4'
                    color='primary'
                    className={classes.subheading}
                  >
                    Quantity: {product.quantity} | Price: ${product.price}
                  </Typography>
                </div>
                <ListItemSecondaryAction>
                  <Link to={`/seller/${product.shop._id}/${product._id}/edit`}>
                    <IconButton edge='end' aria-label='edit' color='primary'>
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <DeleteProduct product={product} onRemoveProduct={removeProduct} />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </span>
          ))}
        </List>
    </Card>
  )
})

MyProducts.propTypes = {
  shopId: PropTypes.string.isRequired,
}

export default MyProducts;

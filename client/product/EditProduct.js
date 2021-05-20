import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Icon from '@material-ui/core/Icon'
import { AddPhotoAlternateOutlined } from '@material-ui/icons'
import auth from '../auth/auth-helper'
import { read, update } from './api-product'
import { Avatar } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    marginTop: theme.spacing(2),
    fontSize: '1em',
    color: theme.palette.openTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 'auto',
    marginBottom: theme.spacing(3)
  },
  input: {
    display: 'none'
  },
  filename: {
    marginLeft: '10px'
  },
  error: {
    verticalAlign: 'middle'
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  }
}))

export default function EditProduct({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    quantity: '',
    price: '',
    redirect: false,
    error: ''
  })

  const jwt = auth.isAuthenticated()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const fetchProduct = async () => {
      let product = await read(
        {
          productId: match.params.productId
        },
        signal
      )
      if (product.error) {
        setValues({ ...values, error: product.error })
      } else {
        setValues({
          ...values,
          error: '',
          id: product._id,
          name: product.name,
          description: product.description,
          category: product.category,
          quantity: product.quantity,
          price: product.price,
        })
      }
    }
    fetchProduct()

    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.productId])

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  const clickSubmit = () => {
    let productUpdate = new FormData()
    values.name && productUpdate.append('name', values.name)
    values.description && productUpdate.append('description', values.description)
    values.category && productUpdate.append('category', values.category)
    values.quantity && productUpdate.append('quantity', values.quantity)
    values.price && productUpdate.append('price', values.price)
    values.image && productUpdate.append('image', values.image)

    const updateProduct = async () => {
      try {
        const productUpdated = await update({
          productId: match.params.productId,
          shopId: match.params.shopId,
        }, {
          t: jwt.token,
        }, productUpdate)

        if (productUpdated.error) {
          setValues({...values, error: productUpdated.error})
        } else {
          setValues({...values, error: '', redirect: true})
        }
      } catch (err) {
        console.log(err)
      }
    }
    updateProduct()
  }

  const imageUrl = values.id
    ? `/api/products/image/${values.id}?${new Date().getTime()}`
    : '/api/products/defaultPhoto'

  if (values.redirect) {
    return <Redirect to={`/seller/shop/edit/${match.params.shopId}`} />
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} type='headline' component='h2'>
          Edit Product
        </Typography>
        <br />
        <Avatar className={classes.bigAvatar} src={imageUrl} />
        <input
          className={classes.input}
          type='file'
          accept='image/*'
          id='icon-button-file'
          onChange={handleChange('image')}
        />
        <label htmlFor='icon-button-file'>
          <Button variant='contained' color='secondary' component='span'>
            Upload image <AddPhotoAlternateOutlined />
          </Button>
        </label>
        <span className={classes.filename}>
          {values.image ? values.image.name : ''}
        </span>
        <br />
        <TextField
          className={classes.textField}
          id='name'
          label='Name'
          value={values.name}
          onChange={handleChange('name')}
        />
        <TextField
          className={classes.textField}
          id='description'
          label='Description'
          margin='normal'
          multiline
          rows={2}
          value={values.description}
          onChange={handleChange('description')}
        />
        <TextField
          id='category'
          label='Category'
          className={classes.textField}
          value={values.category}
          onChange={handleChange('image')}
        />
        <TextField
          id='quantity'
          label='Quantity'
          className={classes.textField}
          value={values.quantity}
          onChange={handleChange('quantity')}
        />
        <TextField
          id='price'
          label='Price'
          className={classes.textField}
          value={values.price}
          onChange={handleChange('price')}
        /><br />
        {values.error && (
          <Typography color="error" component="p">
            <Icon color="error" className={classes.error}>error</Icon>
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          variant='contained'
          color='primary'
          className={classes.submit}
          onClick={clickSubmit}
        >
          Submit
        </Button>
        <Link to={`/seller/shops/edit/${match.params.shopId}`} className={classes.submit}>
          <Button variant='contained'>Cancel</Button>
        </Link>
      </CardActions>
    </Card>
  )
}

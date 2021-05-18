import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { AddPhotoAlternateOutlined } from '@material-ui/icons';
import auth from '../auth/auth-helper'
import { create } from './api-product';

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
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  },
  error: {
    verticalAlign: 'middle'
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  }
}));

export default function NewProduct({match}) {
  const classes = useStyles();
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

  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value})
  }

  const createProduct = () => {
    let product = new FormData()
    values.name && product.append('name', values.name)
    values.description && product.append('description', values.description)
    values.image && product.append('image', values.image)
    values.category && product.append('category', values.category)
    values.quantity && product.append('quantity', values.quantity)
    values.price && product.append('price', values.price)

    create({
      shopId: match.params.shopId
    }, {
      t: jwt.token
    }, product).then(data => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, error: '', redirect: true})
      }
    })
  }

  if (values.redirect) {
    return (<Redirect to={'/seller/shop/edit/'+match.params.shopId}/>)
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography type='headline' component='h2' className={classes.title}>
          New Product
        </Typography>
        <br />
        <input
          type='file'
          onChange={handleChange('image')}
          accept='image/*'
          id='icon-button-file'
          className={classes.input}
        />
        <label htmlFor='icon-button-file'>
          <Button variant='contained' color='secondary' component='span'>
            Upload Logo <AddPhotoAlternateOutlined />
          </Button>
        </label>
        <span className={classes.filename}>{values.image ? values.image.name : ''}</span><br />
        <TextField id='name' label='Name' value={values.name} className={classes.textField} onChange={handleChange('name')} />
        <TextField
          id='multiline-flexible'
          label='Description'
          multiline
          rows='2'
          margin="normal"
          value={values.description}
          className={classes.textField}
          onChange={handleChange('description')}
        /><br />
        <TextField id='category' label='Category' value={values.category} className={classes.textField} onChange={handleChange('category')} />
        <TextField id='quantity' label='Quantity' value={values.quantity} className={classes.textField} onChange={handleChange('quantity')} />
        <TextField id='price' label='Price' value={values.price} className={classes.textField} onChange={handleChange('price')} />

        {values.error && (<Typography component="p" color="error">
          <Icon color="error" className={classes.error}>error</Icon>
          {values.error}
        </Typography>)}
      </CardContent>
      <CardActions>
        <Button onClick={createProduct} variant='contained' color='primary' className={classes.submit}>Submit</Button>
        <Link to='/seller/shops' className={classes.submit}><Button variant='contained'>Cancel</Button></Link>
      </CardActions>
    </Card>
  )
}

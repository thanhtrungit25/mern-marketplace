import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { read, update } from './api-shop'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import { AddPhotoAlternateOutlined } from '@material-ui/icons';
import auth from './../auth/auth-helper'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 30
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
    color: theme.palette.openTitle
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: '0px auto 10px'
  },
  productTitle: {
    width: '100%',
    fontSize: '1.2em',
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      1
    )}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle
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
}))

export default function EditShop({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    id: '',
    name: '',
    description: '',
    image: '',
    redirect: false,
    error: ''
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read(
      {
        shopId: match.params.shopId
      },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, id: data._id, name: data.name, description: data.description, owner: data.owner.name})
      }
    })

    return function clearnup() {
      abortController.abort()
    }
  }, [])

  const handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    setValues({...values, [name]: value})
  }

  const clickSubmit = () => {
    let shopData = new FormData()
    values.name && shopData.append('name', values.name)
    values.description && shopData.append('description', values.description)
    values.image && shopData.append('image', values.image)
    console.cat(match.params.shopId)
    update({
      shopId: match.params.shopId
    }, {
      t: jwt.token
    }, shopData).then(data => {
      if (data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, error: '', redirect: true})
      }
    })
  }

  const logoUrl = values.id
    ? `/api/shops/logo/${values.id}`
    : '/api/shops/defaultPhoto'

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={4} sm={4}>
          <Card className={classes.card}>
            <CardContent>
              <Typography
                type='headline'
                component='h2'
                className={classes.title}
              >
                Edit Shop
              </Typography>
              <Avatar src={logoUrl} className={classes.bigAvatar} />
              <input
                type='file'
                onChange={handleChange('image')}
                accept='image/*'
                id='icon-button-file'
                className={classes.input}
              />
              <label htmlFor='icon-button-file'>
                <Button variant='contained' color='secondary' component='span'>
                  Change Logo <AddPhotoAlternateOutlined />
                </Button>
              </label>
              <span className={classes.filename}>
                {values.image ? values.image.name : ''}
              </span>
              <br />
              <TextField
                id='name'
                label='Name'
                value={values.name}
                className={classes.textField}
                onChange={handleChange('name')}
              />
              <TextField
                id='multiline-flexible'
                label='Description'
                multiline
                rows='2'
                margin='normal'
                value={values.description}
                className={classes.textField}
                onChange={handleChange('description')}
              />
              <br />
              <Typography type="subheading" component="h4" className={classes.subheading}>
                Owner: {values.owner}
              </Typography><br/>
              {values.error && (
                <Typography component='p' color='error'>
                  <Icon color='error' className={classes.error}>
                    error
                  </Icon>
                  {values.error}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                onClick={clickSubmit}
                variant='contained'
                color='primary'
                className={classes.submit}
              >
                Update
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Card>
            <Typography
              type='title'
              component='h2'
              className={classes.productTitle}
            >
              Products
            </Typography>
            {/* <Products products={products} /> */}
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

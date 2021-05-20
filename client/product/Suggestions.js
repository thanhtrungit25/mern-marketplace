import React from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ViewIcon from '@material-ui/icons/Visibility'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    padding: theme.spacing(1),
    paddingBottom: 24,
    backgroundColor: '#80808024'
  }),
  title: {
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1.1em'
  },
  viewButton: {
    verticalAlign: 'middle'
  },
  card: {
    width: '100%',
    display: 'inline-flex'
  },
  details: {
    display: 'inline-block',
    width: "100%"
  },
  content: {
    flex: '1 0 auto',
    padding: '16px 8px 0px'
  },
  cover: {
    width: '65%',
    // height: 130,
    margin: '8px'
  },
  controls: {
    marginTop: '8px'
  },
  date: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '0.9em',
    marginTop: 10,
  },
  icon: {
    verticalAlign: 'sub'
  },
  iconButton: {
    width: '24px',
    height: '24px'
  },
  productTitle: {
    fontSize: '1.15em',
    marginBottom: '5px'
  },
  subheading: {
    color: 'rgba(88, 114, 128, 0.67)'
  },
  actions: {
    float: 'right',
    marginRight: '6px'
  },
  price: {
    display: 'inline',
    lineHeight: '3',
    paddingLeft: '8px',
    color: theme.palette.text.secondary
  }
}))

export default function Suggestions(props) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography type="title" className={classes.title}>
        {props.title}
      </Typography>
      <Paper elevation={4}>
        {props.products.map((item, i) => {
          return <span key={i}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cover}
                image={`/api/products/image/${item._id}`}
                title={item.name}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography className={classes.productTitle} component="h3">
                    {item.name}
                  </Typography>
                  <Typography className={classes.subheading} type="subheading">
                    <Icon className={classes.icon}>shopping_basket</Icon>
                    {" "}{item.shop.name}
                  </Typography>
                  <Typography className={classes.date} component="p">
                    Added on {new Date(item.created).toDateString()}
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <Typography className={classes.price} type="subheading" color="primary" component="h3">
                    $ {item.price}
                  </Typography>
                  <span className={classes.actions}>
                    <IconButton color="secondary" dense="dense">
                      <ViewIcon className={classes.iconButton} />
                    </IconButton>
                    <IconButton color="secondary" dense="dense">
                      <AddCartIcon className={classes.iconButton} />
                    </IconButton>
                  </span>
                </div>
              </div>
            </Card>
          </span>
        })}
      </Paper>
    </div>
  )
}

Suggestions.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
}

import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import AddCartIcon from '@material-ui/icons/AddShoppingCart';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    minWidth: '100%',
    paddingBottom: '14px'
  },
  gridList: {
    width: '100%',
    minHeight: 200,
    padding: '16px 0 10px'
  },
  tile: {
    textAlign: 'center'
  },
  tileTitle: {
    fontSize:'1.1em',
    marginBottom:'5px',
    color:'rgb(189, 222, 219)',
    display:'block'
  },
  image: {
    height: '100%'
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    width: '100%'
  },
  titleBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    textAlign: 'left'
  },
}));

export default function Products(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {props.products.length > 0
      ? (<div className={classes.container}>
        <GridList cellHeight={200} className={classes.gridList} cols={3}>
          {props.products.map((product, i) => (
            <GridListTile key={i} className={classes.tile}>
              <Link to={`/product/${product._id}`}>
                <img className={classes.image} src={`/api/products/image/${product._id}`} alt={product.name} />
              </Link>
              <GridListTileBar
                title={<Link to={`/product/${product._id}`} className={classes.tileTitle}>{product.name}</Link>}
                subtitle={<span>$ {product.price}</span>}
                className={classes.titleBar}
                actionIcon={
                  <span>
                    <IconButton>
                      <AddCartIcon color="secondary" dense="dense" />
                    </IconButton>
                  </span>
                }
              />
            </GridListTile>
          ))}
        </GridList></div>)
        : props.searched && <Typography variant="subheading" component="h4" className={classes.title}>No products found! :(</Typography>
      }
    </div>
  )
}

Products.propTypes = {
  products: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
}

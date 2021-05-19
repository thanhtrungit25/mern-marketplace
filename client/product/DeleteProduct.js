import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import auth from './../auth/auth-helper'
import { remove } from './api-product'

export default function DeleteProduct(props) {
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleRemove = () => {
    remove({
      productId: props.product._id,
      shopId: props.product.shop._id,
    }, {
      t: jwt.token,
    }).then(data => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOpen(false)
        props.onRemoveProduct(props.product)
      }
    })
  }

  return (
    <span>
      <IconButton onClick={handleOpen} edge='end' aria-label='delete' color='secondary'>
        <DeleteIcon />
      </IconButton>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>{"Delete " + props.product.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your product {props.product.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemove} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}

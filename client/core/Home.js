import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Search from '../product/Search'
import { listCategories, listLatest } from '../product/api-product'
import Suggestions from '../product/Suggestions';
import Categories from '../product/Categories'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
}))

export default function Home(){
  const classes = useStyles()
  const [categories, setCategories] = useState([])
  const [suggestions, setSuggestions] = useState([])

  // Fetch categories used in Search, Categories component
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const fetchListCategories = async () => {
      const data = await listCategories(signal)

      if (data.error) {
        console.log(data.error)
      } else {
        setCategories(data)
      }
    }
    fetchListCategories()

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  // Fetch latest products used in Suggestions component
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const fetchLatestProducts = async () => {
      const data = await listLatest(signal)

      if (data.error) {
        console.log(data.error)
      } else {
        setSuggestions(data)
      }
    }
    fetchLatestProducts()

    return function cleanup() {
      abortController.abort()
    }
  }, [])

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={8} sm={8}>
          <Search categories={categories} />
          <Categories categories={categories} />
        </Grid>
        <Grid item xs={4} sm={4}>
          <Suggestions title="Latest Products" products={suggestions} />
        </Grid>
      </Grid>
    </div>
  )
}


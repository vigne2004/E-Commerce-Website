import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const statusList = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {productDetails: {}, status: statusList.initial, quantity: 1}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({status: statusList.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const url = `https://apis.ccbp.in/products/${id}`
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response.ok)
    if (response.ok === true) {
      const formatedData = {
        id: data.id,
        imageUrl: data.image_url,
        description: data.description,
        title: data.title,
        price: data.price,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }
      this.setState({productDetails: formatedData, status: statusList.success})
    } else {
      this.setState({status: statusList.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onIncrease = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrease = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onDirect = () => {
    const {history} = this.props
    history.replace('/products')
  }

  redneredOverall = () => {
    const {status} = this.state
    switch (status) {
      case statusList.inProgress:
        return this.renderLoader()
      case statusList.success:
        return this.renderProductDetails()
      case statusList.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  renderProductDetails() {
    const {productDetails, quantity} = this.state
    const {
      imageUrl,
      price,
      title,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productDetails
    const rawDate = productDetails.similarProducts
    const formatSimilartProduct = rawDate.map(each => ({
      id: each.id,
      imageUrl: each.image_url,
      title: each.title,
      style: each.style,
      price: each.price,
      description: each.description,
      brand: each.brand,
      totalReviews: each.total_reviews,
      rating: each.rating,
      availability: each.availability,
    }))
    return (
      <>
        <div className="details-cont">
          <img className="details-img" src={imageUrl} alt="product" />
          <div className="content-cont">
            <h1 className="title-heading">{title}</h1>
            <p className="price-text">Rs {price}/-</p>
            <div className="rating-review-cont">
              <div className="rating-cont">
                <p className="rating-text">{rating}</p>
                <img
                  className="star-img"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p className="review-text">{totalReviews} Reviews</p>
            </div>
            <p className="description-text">{description}</p>
            <p className="availability-text">Available: {availability}</p>
            <p className="brand-text">Brand: {brand}</p>
            <hr className="hori-line" />
            <div className="add-to-cart-cont">
              <div className="quantity-cont">
                <button
                  type="button"
                  onClick={this.onIncrease}
                  className="btn"
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
                <p className="quantity-text">{quantity}</p>
                <button
                  type="button"
                  onClick={this.onDecrease}
                  className="btn"
                  data-testid="minus"
                >
                  <BsDashSquare />
                </button>
              </div>
              <button type="button" className="add-btn">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <ul>
          {formatSimilartProduct.map(eachItem => (
            <SimilarProductItem key={eachItem.id} details={eachItem} />
          ))}
        </ul>
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-cont">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <button type="button" className="failure-btn" onClick={this.onDirect}>
        Continue Shopping
      </button>
    </div>
  )

  render() {
    return (
      <div className="products-details-bg-cont">
        <Header />
        {this.redneredOverall()}
      </div>
    )
  }
}
export default ProductItemDetails

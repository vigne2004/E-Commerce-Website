import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  return (
    <li className="list-product-cont">
      <img
        className="sim-img"
        src={details.imageUrl}
        alt={`similar product ${details.title}`}
      />
      <p className="sim-title">{details.title}</p>
      <p className="sim-text">{details.brand}</p>
      <div className="price-rating-cont">
        <p className="sim-price">Rs {details.price}/-</p>
        <div className="sim-rating-cont">
          <p className="sim-rating-text">{details.rating}</p>
          <img
            className="sim-rating-img"
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem

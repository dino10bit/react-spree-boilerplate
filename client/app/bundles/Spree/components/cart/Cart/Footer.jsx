import React from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { FormattedMessage } from "react-intl"
import { cart as messages } from "app/locales/messages"
import { Button } from "react-bootstrap"

const Adjustments = ({ price: { items, tax, shipping, adjustment } }) => {
  const components = []
  if(tax) {
    components.push(
      <tr key="tax">
        <td colSpan={3}>
          <FormattedMessage {...messages.taxTotal} />
        </td>
        <td>${tax}</td>
      </tr>
    )
  }
  if(shipping) {
    components.push(
      <tr key="shipping">
        <td colSpan={3}>
          <FormattedMessage {...messages.shippingTotal} />
        </td>
        <td>${shipping}</td>
      </tr>
    )
  }
  if(adjustment) {
    components.push(
      <tr key="adjustment">
        <td colSpan={3}>
          <FormattedMessage {...messages.adjustmentTotal} />
        </td>
        <td>${adjustment}</td>
      </tr>
    )
  }
  if(components.length) {
    components.unshift(
      <tr key="items">
        <td colSpan={3}>
          <FormattedMessage {...messages.itemsTotal} />
        </td>
        <td>${items}</td>
      </tr>
    )
  }
  return components
}

const CartFooter = ({ cart: { price }, onClear }) => (
  <tfoot>
    <Adjustments price={price} />
    <tr>
      <td colSpan={3}>
        <Button onClick={onClear}>
          <FormattedMessage {...messages.emptyCart} />
        </Button>
        <Link to="/products">
          <FormattedMessage {...messages.continueShopping} />
        </Link>
      </td>
      <td>${price.total}</td>
    </tr>
  </tfoot>
)

CartFooter.propTypes = {
  cart: PropTypes.object.isRequired,
  onClear: PropTypes.func
}

export default CartFooter

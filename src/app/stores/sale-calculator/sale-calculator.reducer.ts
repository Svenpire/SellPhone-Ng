import { createReducer, on } from '@ngrx/store'
import produce from 'immer'
import { SaleOrder } from 'src/app/models/SaleOrder'
import * as fromSaleCalculatorActions from './sale-calculator.actions'

export const saleOrderFeatureKey = 'saleOrder'

export interface SaleOrderState extends SaleOrder {

}

// export interface SaleOrderDetailState extends EntityState<SaleOrderDetails> {

// }

export const initialState: SaleOrderState = {
  orderId: null,
  total: null,
  orderDate: '',
  orderStatus: '',
  orderDetails: [{
    lineId: null,
    selectedPhoneType: { typeId: null, name: null },
    selectedPhoneModel: { modelId: null, name: null, maxValue: null },
    phoneCondition: null,
    quantity: null,
    subTotal: null
  }]
}

export const saleCalculatorReducer = createReducer(
  initialState,
  // update inputs from estimator

  on(fromSaleCalculatorActions.updateSelectedPhoneType,
    (state, action) => ({
      ...state,
      orderDetails: {
        ...state.orderDetails,
        [action.formIndex]: {
          ...state.orderDetails[action.formIndex],
          selectedPhoneType: action.selectedPhoneType
        }
      }
    })
  ),

  on(fromSaleCalculatorActions.updateSelectedPhoneModel,
    (state, action) => ({
      ...state,
      orderDetails: {
        ...state.orderDetails,
        [action.formIndex]: {
          ...state.orderDetails[action.formIndex],
          selectedPhoneModel: action.selectedPhoneModel
        }
      }
    })
  ),

  on(fromSaleCalculatorActions.updateSelectedPhoneConditionId,
    (state, action) => (
      { ...state, phoneConditionId: action.selectedPhoneConditionId })
  )
)

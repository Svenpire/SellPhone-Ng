import { Component, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { selectOrderDetail, selectSaleOrder } from 'src/app/stores/sale-calculator/sale-calculator.selectors'
import { selectPhoneModelsList, selectStaticData } from 'src/app/stores/staticData/staticData.selectors'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms'
import { StaticData } from 'src/app/models/StaticData'
import { PhoneModel } from 'src/app/models/PhoneModel'
import { PhoneType } from 'src/app/models/PhoneType'
import { addFormSection, updateCondition, updateQuantity, updateSelectedPhoneModel, updateSubtotal } from 'src/app/stores/sale-calculator/sale-calculator.actions'
import { Condition } from 'src/app/models/Condition'
import { SaleOrder } from 'src/app/models/SaleOrder'
import { Helpers } from 'src/app/helpers/helpers'

@Component({
  selector: 'app-sale-calculator',
  templateUrl: './sale-calculator.component.html',
  styleUrls: ['./sale-calculator.component.scss']
})
export class SaleCalculatorComponent implements OnInit {
  saleOrder: SaleOrder;
  conditionsList: Array<Condition>;
  phoneTypesList: Array<PhoneType>;
  saleOrderForm: FormGroup;
  phoneModelList: Array<PhoneModel[]>

  get orderDetails () {
    return this.saleOrderForm.get('orderDetails') as FormArray
  }

  // eslint-disable-next-line no-useless-constructor
  constructor (
    private _store: Store<SaleOrder>,
    private fb: FormBuilder,
    private _helper: Helpers
  ) { }

  ngOnInit () {
    this._store.pipe(select(selectSaleOrder))
      // eslint-disable-next-line no-return-assign
      .subscribe(sO => this.saleOrder = sO)
    // get conditions list
    this._store.pipe(select(selectStaticData))
      .subscribe(sD => {
        this.conditionsList = sD.conditions
        this.phoneTypesList = sD.phoneTypes
        this.phoneModelList = sD.phoneModelsList
      })

    this.saleOrderForm = this.fb.group({
      orderId: [{ value: '001', disabled: true }, Validators.required],
      total: [null],
      orderDate: [null],
      orderStatus: ['incomplete'],
      orderDetails: this.fb.array([
        this.fb.group({
          phoneType: [Number(
            this.saleOrder.orderDetails[0].phoneType.typeId
          ), Validators.required],
          phoneModel: [Number(
            this.saleOrder.orderDetails[0].phoneModel.modelId
          ), Validators.required],
          phoneCondition: ['', Validators.required],
          quantity: [null, Validators.required],
          subTotal: [0],
          lineId: [1, Validators.required],
          modelList: [this.phoneModelList[0]]
          // modelsData: [ PhoneModel]
        })

      ])
    })
  } // ngOnInit

  public changeCondition (formIndex, id:string) {
    const condition:Condition = this.conditionsList.find((condition) =>
      condition.id == id)

    // update the store
    this._store.dispatch(updateCondition({ formIndex, condition })
    )

  }

  public onQuantityChange (formIndex: number, quantity: number) {
    // update the store
    this._store.dispatch(updateQuantity({ formIndex, quantity }))
  }

  public onOrderDetailsChange (formIndex: number) {
    // if formGroup is valid, calc subtotal
    debugger
    if (this.orderDetails.controls[formIndex].valid) {
      // call calculate subtotal
      this.calcSubtotal(formIndex)
    }
  }

  public onSelectedPhoneTypeChange (e: any, formIndex): void {
    const selectedPhoneType: PhoneType = {
      typeId: Number(e.target.selectedOptions[0].id),
      name: e.target.selectedOptions[0].label
    }

    // update store
    this._helper.storeUpdateOnTypeChange(formIndex, selectedPhoneType)

    // update form modelList value
    // TODO Move to helper
    let list: Array<PhoneModel>
    this._store.pipe(select(selectPhoneModelsList))
      .subscribe((mL) => list = mL[formIndex])

    this.saleOrderForm.get('orderDetails.'+formIndex+'.modelList')
      .patchValue(list)
  }

  public onSelectedPhoneModelChange (e, formIndex:number): void {
    const modelId: number = e.target.selectedOptions[0].id

    const selectedPhoneModel = this.phoneModelList[formIndex].find( (model) => model.modelId == modelId)


    this._store.dispatch(updateSelectedPhoneModel(
      { formIndex, selectedPhoneModel }))
  }

  public calcSubtotal (formIndex: number): void {
    // should this be done as part of a subscription instead?

    debugger
    // load values from the store
    const maxValue = this.saleOrder.orderDetails[formIndex].phoneModel.maxValue
    const conditionMod = this.saleOrder.orderDetails[formIndex].phoneCondition.priceMod
    const quantity = this.saleOrder.orderDetails[formIndex].quantity

    const subTotal = maxValue * conditionMod * quantity

    // update store
    this._store.dispatch(updateSubtotal(
      { formIndex, subTotal } )
    )

    // update form from store
    this.saleOrderForm.get('orderDetails.'+formIndex+'.subTotal').patchValue(this.saleOrder.orderDetails[formIndex].subTotal)

    this.calcTotalSale()
  }

  calcTotalSale () {
    // TODO: add subtotals
    let total: number = 0;
    this.saleOrderForm.get('orderDetails').value
    .forEach(orderDetail => orderDetail.subTotal != null
      ? total += orderDetail.subTotal : null
    );

    this.saleOrderForm.get('total').setValue(total)

  }

  public addOrderDetails (index) {
    let orderDetailArray = this.saleOrderForm.controls.orderDetails as FormArray
    let arrayLen = orderDetailArray.length
    let orderDetailGroup: FormGroup = this.fb.group({
      lineId: index + 1,
      phoneType: '',
      phoneModel: '',
      phoneCondition: '',
      quantity: null,
      subTotal: null,
      modelList: []
    })

    orderDetailArray.insert(index + 1, orderDetailGroup)

    this._store.dispatch(addFormSection())
  }

  public deleteOrderDetails (index) {
    this.orderDetails.removeAt(index)
  }

  public onSubmit () {
    // TODO: use event emitter with form value
    console.warn(this.saleOrderForm.value)
  }
}

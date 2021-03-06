import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import { User } from 'src/app/models/User';
import * as fromContactInfo from './contact-info.reducer';

export const selectContactInfoState = createFeatureSelector<fromContactInfo.State['contactForm']>(
  fromContactInfo.contactInfoFeatureKey
);

export const selectContactInfoForm = createSelector(
  selectContactInfoState,
  (state: fromContactInfo.State['contactForm']) => state.formState
)

export const selectContactFormSubmission = createSelector(
  selectContactInfoState,
  (state: fromContactInfo.State['contactForm']) => state.submittedValue
)


export const selectContactInfoControls = createSelector(
  selectContactInfoForm,
  (state: FormGroupState<User>) => state.controls
)

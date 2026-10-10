export interface UserData {
  displayName: string | null
  email: string | null
  emailVerified: boolean
  phoneNumber: null | string
  photoURL: null | string
  providerId: string
  uid: string
}

export interface UserState {
  token: string | undefined
  userData: UserData | undefined
  isLogin: boolean
  paymentStatus: boolean
}

export interface IUser {
  id?: number;
  phoneNumber: string;
  fullName: string;
  name?: string;
  userName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone:string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

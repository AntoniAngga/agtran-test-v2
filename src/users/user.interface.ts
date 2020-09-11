interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  birthDate: Date;
  icNumber: string;
}

export default User;

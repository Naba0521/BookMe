export type employeeType = {
  _id: string;
  employeeName: string;
  description: string;
  duration: number;
  profileImage: string;
  availability: boolean;
  startTime: string;
  endTime: string;
  lunchTimeStart: string;
  lunchTimeEnd: string;
  companyId: string;
  bookings: string[];
};
export type CompanyType = {
  _id: string;
  workingHours: Record<string, { closed: boolean }>;
  companyName: string;
  address: string;
  companyLogo: string;
  phoneNumber: number;
  description: string;
  companyImages: string[];
  employees: [employeeType];
  bookings: string[];
};
export type OrderNavpropsType = {
  isStage: string;
  setIsStage: (stage: string) => void;
  title: string;
  Stages: string[];
  setSelectedTime: (time: Date | null) => void;
  companyData: CompanyType | undefined
};
export type StagOneProps = {
  company: CompanyType;
  isSelectEmployee: string | string[];
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  setSelectedEmployeeImf: (employeeId: string) => void;
};
export type OrderImformationType = {
  isChecked: boolean,
  HandleNextStage: () => void;
  isSelectEmployee: string | string[];
  company?: CompanyType;
  isStage: string;
  Stages: string[];
  setIsSelectEmployee: (employee: string) => void;
  date: Date | null;
  selectedTime: Date | null;
  setSelectedTime: (time: Date | null) => void;
  setSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  setIsStage: (stage: string) => void;
  setDate: (date: Date | null) => void;
};
export type OrderType = {
  _id?: string;
  company: string;
  user: string;
  employee: string;
  selectedTime: string;
  description: string;
  status: string
};
export type user = {
  _id?: string;
  username: string;
  phoneNumber: number;
  booking: string[];
  email: string;
  address: string;
  role: string;
  companyId: string[];
};
export type UpdateEmployeeProps = {
  isSelectEmployee: string | string[];
  zurag?: string;
  company: CompanyType | undefined;
  setIsSelectEmployee: (value: string) => void;
  selectedEmployeeImf: string | undefined;
  setSelectedEmployee: (employeeId: string) => void;
  setSelectedTime: (time: Date | null) => void;

};
export type CalendarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  date: Date | null;
  setDate: (date: Date | null) => void;
};

export type DayPickerProps = {
  date: Date | null;
  setDate: (date: Date | null) => void;
  dayArrays: () => Date[];
  company: CompanyType;
  orders: OrderType[] | undefined;
  availabilityTimes: (time: number) => number[];
  isDayClosed: (day: Date) => boolean;
  isFully: boolean;
};

export type availabilityProps = {
  times: Number[];
  date: Date | null;
  setDate: (date: Date | null) => void;
  setSelectedTime: (time: Date) => void;
  selectedTime: Date | null;
  isPassed: boolean
  orders: OrderType[] | undefined
};
export type IfClosedProps = {
  date: Date | null;
  setDate: (date: Date | null) => void;
  dayArrays: (day: Date) => Date[];
  isDayClosed: (day: Date) => boolean;
  nextAvailabilityDay: () => void;
};
export type isFullDayProps = {
  setSelectedTime: (time: Date | null) => void;
  isSelectEmployee: string | string[];
  zurag: string;
  company: CompanyType;
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  setSelectedEmployee: (employeeId: string) => void;
  nextAvailabilityDay: () => void;
};

export type TimePickerProps = {
  date: Date | null;
  setDate: (date: Date | null) => void;
  availabilityTimes: (time: number) => number[];
  dayArrays: (date: Date) => Date[];
  setSelectedTime: (time: Date | null) => void;
  orders: OrderType[] | undefined;
  selectedTime: Date | null;
  isDayClosed: (day: Date) => boolean;
  isFully: boolean;
  isSelectEmployee: string | string[];
  zurag: string;
  company: CompanyType;
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  setSelectedEmployee: (employeeId: string) => void;
};
export type returnProps = {
  isSelectEmployee: string | string[];
  zurag: string;
  company: CompanyType;
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  date: Date | null;
  setDate: (date: Date | null) => void;
  setSelectedTime: (time: Date | null) => void;
  dayArrays: () => Date[];
  orders: OrderType[] | undefined;
  availabilityTimes: (day: number) => number[];
  setSelectedEmployee: (employeeId: string) => void;
  isDayClosed: (day: Date) => boolean;
  isFully: boolean;
  selectedTime: Date | null;
};
export type TimingProps = {
  isSelectEmployee: string | string[];
  zurag: string;
  company: CompanyType;
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  date: Date | null;
  setDate: (date: Date | null) => void;
  setSelectedTime: (time: Date | null) => void;
  selectedTime: Date | null;
  setSelectedEmployee: (employeeId: string) => void;
};
export type EmployeeCardProps = {
  ner: string;
  mergejil: string;
  zurag: string;
  captionText: string|null;
};

export type BookingPageProps = {
  isStage: string;
  setSelectedTime: (date: Date | null) => void;
  setIsStage: (stage: string) => void;
  isSelectEmployee: string | string[];
  setIsSelectEmployee: (employee: string) => void;
  selectedEmployeeImf: string | undefined;
  setSelectedEmployeeImf: (employee: string | undefined) => void;
  companyData: CompanyType | undefined;
  selectedTime: Date | null;
  HandleNextStage: () => void;
  date: Date | null;
  setDate: (date: Date | null) => void;
};
export type leaveOrderProps = {
  companyData: CompanyType | undefined;
}

export type ConfirmBookingProps = {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
};
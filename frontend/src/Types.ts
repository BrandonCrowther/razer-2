import { Cookies } from "react-cookie"

type AppProps = {
    cookies: Cookies
}
type AppState = {
    loggedIn: boolean
}

type LoginProps = {
  userLoggedIn: Function
  cookies: Cookies
}
type LoginState = {
  username: string
  password: string
}

type User = {
    id?: number
    role: number 
    name: string 
    email: string
}
type UserType = User
type UserProps = {
    model: User,
    forceUpdate: Function
}
type UserState = {
    model: User
    isEditing: boolean
}

type UsersPageProps = {}
type UsersPageState = {
    users: User[]
    isCreateModalOpen: boolean
}

type UserCreateModalProps = {
    triggerClose: Function
}
type UserCreateModalState = User & {password: string}


type Job = {
    id?: number
    address: string
	note: string
    driver_id: number
    date: Date
    clock_in?: Date
    clock_out?: Date
}
type JobType = Job
type JobsPageProps = {}
type JobsPageState = {
    jobs: Job[]
    isCreateModalOpen: boolean
}
type JobProps = {
    model: User,
    forceUpdate: Function
}
type JobState = {
    model: User
    isEditing: boolean
}


export type {
    UserType,
    UserProps,
    UserState,
    UsersPageProps,
    UsersPageState,
    UserCreateModalProps,
    UserCreateModalState,
    JobType,
    JobsPageProps,
    JobsPageState,
    JobProps,
    JobState,
    AppProps,
    AppState,
    LoginProps,
    LoginState
}
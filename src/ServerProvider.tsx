import { add } from './Serverconn'

function creator<T>(request: string, data: any = {}, inner: string = "") {
    let simple: T extends boolean ? true : false
    data.request = request
    return new Promise<T>((res, rej) => {
        add(data, (data) => {
            if (data.error) {
                rej(data.error)
            } else {
                if (simple) {
                    res(true as any)
                } else {
                    if (inner) {
                        res(data[inner])
                    } else {
                        res(data)
                    }
                }
            }
        })
    })
}

export const auth = (token: string) => creator<string>("auth", {token}, "auth")
export const getMentors = () => creator<any[]>("getMentors", {}, "items")
export const scheduleAppointment = (mentor: string, date: number, hour: number) => creator<boolean>("scheduleAppointment", {mentor, date, hour})
export const cancelAppointment = (id: string) => creator<boolean>("cancelAppointment", {uuid: id})
export const getSelf = () => creator<any>("getSelf")
export const updateSelf = (predicate: string, value: any) => creator<boolean>("updateSelf", {predicate, value})
export const updateImage = (image: string) => creator<boolean>("updateImage", {image})
export const addAvailableTime = (day: string | number, fromTime: number, toTime: number, id: string) => creator<boolean>("addAvailableTime", {day, fromTime, toTime, id})
export const removeAvailableTime = (id: string) => creator<boolean>("removeAvailableTime", {id})
export const getAppointmentsForMentor = (email: string, date: number) => creator<any[]>("getAppointmentsForMentor", {email, date}, "items")
export const getUpcoming = () => creator<any[]>("getUpcoming", {}, "items")
export const getUserName = (user: string) => creator<string>("getUserName", {user}, "name")
export const getUserPhone = (user: string) => creator<string>("getUserPhone", {user}, "phone")
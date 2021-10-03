import { useEffect, useState } from 'react'
import { CloseOutline } from 'react-ionicons'
import './Calendar.css'
import { getStandard, SchedDate } from './Scheduler'
import { cancelAppointment, getSelf, getUpcoming, getUserName, getUserPhone } from './ServerProvider'
import { getTimeFromI } from './Settings'

const Calendar = () => {
    const [upcoming, supcoming] = useState([] as any[])
    const [scheduled, sscheduled] = useState([] as any[])

    useEffect(() => {
        getUpcoming().then(async apps => {
            const self = await getSelf()
            const utemp: any[] = []
            const stemp: any[] = []
            for (let app of apps) {
                const today = new Date()
                today.setHours(23, 59, 59, 999)

                let isToday = false
                if (app.date < today.getTime()) isToday = true

                const email = self.email === app.mentee ? app.mentor : app.mentee
                let name = await getUserName(email)
                const phone = await getUserPhone(email)
                if (phone && phone.length > 0) {
                    name = `${name} (${email}, ${phone})`
                } else {
                    name = `${name} (${email})`
                }
                const appd: any = {name, startTime: getTimeFromI(app.hour), endTime: getTimeFromI(app.hour + 1), uuid: app.uuid}
                if (!isToday) {
                    appd.date = getStandard(new Date(app.date))
                    stemp.push(appd)
                } else {
                    utemp.push(appd)
                }
            }
            sscheduled(stemp)
            supcoming(utemp)
        })
    }, [])

    const cancel = (uuid: string) => {
        cancelAppointment(uuid).then(() => {
            console.log(uuid)
            const stemp = scheduled.filter(u => u.uuid !== uuid)
            const utemp = upcoming.filter(u => u.uuid !== uuid)
            console.log(stemp)
            console.log(utemp)
            sscheduled(stemp)
            supcoming(utemp)
        })
    }

    return (<>
        <h2>Calendar</h2>
        <div className="calendardiv">
            <div className="upcoming">
                <h4>Today, {getStandard(new Date()).substr(4)}</h4>
                <ul className="applist">
                    {upcoming.map((u, i) => <Appointment onCancel={() => cancel(u.uuid)} key={i} startTime={u.startTime} endTime={u.endTime} name={u.name}/>)}
                </ul>
            </div>
            <div className="upcoming">
                <h4>Scheduled</h4>
                <ul className="applist">
                    {scheduled.map((u, i) => <Appointment onCancel={() => cancel(u.uuid)} key={i} startTime={u.startTime} endTime={u.endTime} name={u.name} date={u.date}/>)}
                </ul>
            </div>
        </div>
    </>)
}

export const Appointment: React.FC<SchedDate> = (props) => {
    return (
        <li className="appointment">
            {props.date ? (<><b>{props.date}</b><br /></>) : ""}
            <b>{props.startTime}- {props.endTime}:</b> {props.name}
            <CloseOutline onClick={props.onCancel} color="#FFFFFF" width="1.5em" height="1.5em" />
        </li>
    )
}

export default Calendar
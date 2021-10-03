import { useEffect, useState } from 'react'
import { ArrowBackOutline } from 'react-ionicons'
import './Calendar.css'
import { getAppointmentsForMentor, scheduleAppointment } from './ServerProvider'
import { DAYS, getTimeFromI } from './Settings'

export type SchedDate = {name?: string, startTime: string, endTime: string, date?: string, onCancel: () => void}
export const getStandard = (date: Date) => {
    return date.toString().split(" ").filter((_, i) => i < 4).join(" ")
}

export const Scheduler: React.FC<{user: any, times: SchedDate[], onBack: () => void}> = (props) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const [value, onChange] = useState(today)

    let [availableTimes, sat] = useState([] as number[])
    let [blockedTimes, sbt] = useState([] as number[])

    let [hour, shour] = useState(-1)

    const changeDate = (date: number) => {
        const d = new Date(date)
        d.setHours(24, 0, 0, 0)
        onChange(d)
    }

    const schedule = () => {
        if (hour > -1) {
            scheduleAppointment(props.user.email, value.getTime(), hour).then(() => {
                props.onBack()
            })
        }
    }

    const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() + 1 === second.getDate();

    useEffect(() => {
        const ats: number[] = []
        for (let at of props.user.availableTimes) {
            const attime = new Date(at.date)
            if (DAYS.includes(at.date) && DAYS.indexOf(at.date) === value.getDay()) {
                for (let i = at.fromTime; i <= at.toTime; i++) {
                    if (!ats.includes(i)) ats.push(i)
                }
            } else if (datesAreOnSameDay(attime, value)) {
                for (let i = at.fromTime; i <= at.toTime; i++) {
                    if (!ats.includes(i)) ats.push(i)
                }
            }
        }
        ats.sort((a, b) => a - b)
        console.log(ats)
        getAppointmentsForMentor(props.user.email, value.getTime()).then(apps => {
            const bts: number[] = []
            if (apps) {
                apps.forEach(app => bts.push(app.hour))
                sbt(bts)
            }
            sat(ats)
        })
    }, [props.user.availableTimes, props.user.email, value])
    

    return (<>
        <div className="backarrow" onClick={() => props.onBack()}><ArrowBackOutline color="71cf6b" height="4vmax" width="4vmax"/></div>
        <h2>{props.user.name}</h2>
        <div className="inputdiv">
            <ul className="inputs">
                <li><input className="dateinput" type="date" onChange={(event) => changeDate(event.target.valueAsNumber)}/></li>
                <button onClick={schedule}>Schedule</button>
            </ul>
        </div>
        <h4>{getStandard(value)}</h4>
        <table className="calendardiv">
            <colgroup>
                <col width="20vw" />
                <col width="80vw" />
            </colgroup>
            <tbody>
                {availableTimes.map(i => {
                    return <tr key={i} className={(hour === i ? "selected " : "") + (blockedTimes.includes(i) ? "blocked": "")} onClick={() => !blockedTimes.includes(i) ? shour(i) : null}>
                        <td className="timetd">{getTimeFromI(i)}</td>
                        <td className="scheduletd">
                        </td>
                    </tr>
                }
                )}
            </tbody>
        </table>
    </>)
}

export default Scheduler;
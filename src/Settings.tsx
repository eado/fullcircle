import { useEffect, useState } from 'react'
import { uuidv4 } from './Serverconn'
import { addAvailableTime, getSelf, removeAvailableTime, updateImage, updateSelf } from './ServerProvider'
import './Settings.css'

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export const getTimeFromI = (i: number) => {
    return (i === 0) ? `${String(12)} am` : (i > 0 && i <= 12) ? `${String(i)} am` : `${String(i - 12)} pm`
}

const Settings = () => {
    const [pfpdata, spfp] = useState("")
    const [user, suser] = useState({} as any)

    const [every, se] = useState("")
    const [dayweek, sdw] = useState("Monday")
    const [fromTime, sft] = useState(0)
    const [toTime, stt] = useState(0)
    const [date, sd] = useState(new Date())

    const changeHandler = (imgfile: File) => {    
        const fileReader = new FileReader()
        console.log(imgfile)

        if (imgfile == null) {
            return
        }

        fileReader.readAsDataURL(imgfile)
        
        fileReader.onloadend = (_) => {
            console.log(fileReader.result)
            spfp(fileReader.result as string)
            
            updateImage(fileReader.result as string)
        }
    }

    const addTime = () => {
        console.log(dayweek)
        addAvailableTime(every === "every" ? dayweek : date.getTime(), fromTime, toTime, uuidv4()).then(() => getSelf().then(suser))
    }

    const removeTime = (id: string) => {
        removeAvailableTime(id).then(() => getSelf().then(suser))
    }

    const update = (predicate: string, value: any) => {
        user[predicate] = value
        updateSelf(predicate, value)
    }

    useEffect(() => {
        getSelf().then(user => {
            suser(user)
            if (window.location.hostname === "localhost" && (user.pfp as string).startsWith("/")) {
                user.pfp = "http://localhost:80" + user.pfp
            }
            spfp(user.pfp)
        })
    }, [])

    return (<div className="settings">
        <h2>Settings</h2>
        <img alt="pfp" className="pfp" src={pfpdata} onClick={() => document.getElementById("fileInput")?.click()} />
        <input id="fileInput" onChange={(event) => {
            if (event.target.files) {
                changeHandler(event.target.files[0])
            }
        }} type="file"  style={{display: 'none'}}/>
        <h4>Name: <input type="text" defaultValue={user.name} onChange={(event) => update("name", event.target.value)}  /></h4>
        <h4>You are a: <input type="text" name="city" list="type" defaultValue={user.type} onChange={(event) => update("type", event.target.value)} />
            <datalist id="type">
                    <option value="Freshman" />
                    <option value="Sophomore" />
                    <option value="Junior" />
                    <option value="Senior" />
                    <option value="Teacher" />
            </datalist>
        </h4>
        <h4>Phone number: <input type="text" defaultValue={user.phone} onChange={(event) => update("phone", event.target.value)}/></h4>
        <p className="smalltext">This will only be visible to mentors you sign up for/mentees approved</p>
        <div className="mentordiv">
            <label htmlFor="isMentor" >Mentor</label>
            <input type="checkbox" name="isMentor" defaultChecked={user.isMentor} onClick={(event) => update("isMentor", (event.target as HTMLInputElement).checked)}/>
        </div>
        <h4>Bio: </h4>
        <textarea placeholder="Type bio here..." defaultValue={user.bio} onChange={(event) => update("bio", event.target.value)}></textarea>
        <br />
        {user.isMentor ? <><h4>Available Times</h4>
            <h5>I am available <select name="every" onChange={(event) => se(event.target.value)}>
                    <option value="...">...</option>
                    <option value="every">every...</option>
                    <option value="on">on...</option>
                </select>
                {every === "every" ? <select name="dayweek" onChange={(event) => sdw(event.target.value)}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select> : null}
                {every === "on" ? <input className="dateinput" type="date" onChange={(event) => sd(event.target.valueAsDate ? event.target.valueAsDate : new Date() )} /> : null}
                {every === "every" || every === "on" ? <> 
                    &nbsp;from <select name="fromTime" onChange={(event) => sft(Number(event.target.value))}>
                        {[...Array(24).keys()].map(i => {
                            return <option key={i} value={i}>
                                {getTimeFromI(i)}
                            </option>
                        })}
                    </select> to <select name="toTime" onChange={(event) => stt(Number(event.target.value))}>
                        {[...Array(24).keys()].map(i => {
                            return <option key={i} value={i}>
                                {getTimeFromI(i)}
                            </option>
                        })}
                    </select><button onClick={() => addTime()}>Add</button>
                </> : null}
            </h5>
            {user.availableTimes.map((a: any) => {
                return <p key={a.uuid}>{DAYS.includes(a.date) ? a.date + "s" : new Date(a.date).toUTCString().split(" ").filter((_, i) => i < 4).join(" ")} from {getTimeFromI(a.fromTime)} to {getTimeFromI(a.toTime)} <button onClick={() => removeTime(a.uuid)}>Remove</button></p>
            })}
        </>: null}
        <br />
        <br />
        <br />  
    </div>)
}

export default Settings